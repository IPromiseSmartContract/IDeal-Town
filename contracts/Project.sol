// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Unirep} from "@unirep/contracts/Unirep.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IPJToken.sol";
import "./IDTToken.sol";

interface IToken {
    function mint(address account, uint256 amount) external;

    function burn(address account, uint256 amount) external;
}

contract Project {
    enum Stages {
        Open, // proposer open the project and developers can submit their solution
        Vote, // proposer vote for their favorite solution(s)
        Review, // reviewers review the solution and send reputation by unirep
        Reward, // proposer claim reward after the project is expired
        Closed // project is closed
    }

    struct Payload {
        address author; // author of this proposal
        string url; // url of the proposal
    }

    IDTToken public idt;
    Unirep public unirep;

    string public name;
    address public proposer;
    uint256 public expiration;
    uint256 public threshold;
    IPJToken public ipjtoken;
    Stages public currentStage;

    Payload public proposal; // proposer's proposal
    Payload[] public solutions; // developers' solutions
    uint8 public cumulatedPercentage;

    mapping(address => uint8) public developers; // developer register 1 is the register value, 2 is verified
    mapping(address => uint8) public reviewers; // reviewer register 1 is the initial value, 2 is registered
    mapping(address => uint256) public rewards; // developer address to rewards count

    modifier onlyProposer() {
        require(
            msg.sender == proposer,
            "Project: Only proposer can call this function."
        );
        _;
    }
    modifier onlyDeveloper() {
        require(
            developers[msg.sender] == 2,
            "Project: Only verified developer can call this function."
        );
        _;
    }
    modifier onlyReviewer() {
        require(
            reviewers[msg.sender] == 2,
            "Project: Only reviewer can call this function."
        );
        _;
    }
    modifier requireStage(Stages _stage) {
        require(currentStage == _stage, "Project is not in the right stage.");
        _;
    }

    event URLSubmitted(address indexed submitter, string url, uint256 solutionId);
    event Voted(uint256 solutionId, address receiver, uint8 percent);
    event Reviewed(address indexed reveiwer, uint256 solutionIndex);
    event RewardClaimed(address indexed receiver, uint256 amount);

    constructor(
        string memory _name,
        address _proposer,
        uint256 _expiration,
        uint256 _threshold,
        IPJToken _ipjtoken,
        string memory _proposalURL,
        address[] memory _reviewers,
        IDTToken _idt,
        Unirep _unirep
    ) {
        name = _name;
        proposer = _proposer;
        expiration = _expiration;
        threshold = _threshold;
        ipjtoken = _ipjtoken;
        currentStage = Stages.Open;

        for (uint256 i = 0; i < _reviewers.length; i++) {
            reviewers[_reviewers[i]] = 1;
        }

        idt = _idt;
        unirep = _unirep;
        ipjtoken.initialize(address(this));

        proposal = Payload(_proposer, _proposalURL);
    }

    // exchange IDT to IPJToken with 1:1 ratio
    function exchange(uint256 amount) public requireStage(Stages.Open) {
        idt.transferFrom(msg.sender, address(this), amount);
        ipjtoken.mint(msg.sender, amount);
    }

    // @ Test
    // setCurrentStage change the current stage of the project manually without checking
    // Notice that this function is for testing purpose only
    // 0: Open
    // 1: Vote
    // 2: Review
    // 3: Reward
    // 4: Closed
    function setCurrentStage(uint8 _stage) external {
        currentStage = Stages(_stage);
    }

    function registerAttester(uint48 epochLength) external {
        unirep.attesterSignUp(epochLength);
    }

    // register as a developer of this project
    // one should submit a prove of their reputation is higher than threshold
    // if the prove is invalid, the transaction will be reverted
    function registerDeveloper(
        uint256[] calldata signupPublicSignals,
        uint256[8] calldata signupProof
    ) external {
        require(
            developers[msg.sender] == 0,
            "Project: Developer already registered."
        );
        developers[msg.sender] = 1;
        unirep.userSignUp(signupPublicSignals, signupProof);
    }

    // After a developer is registered, he/she should submit a prove of their reputation is higher than threshold
    function verifyDeveloper(
        uint256[] calldata reputationPublicSignals,
        uint256[8] calldata reputationProof
    ) external {
        require(
            developers[msg.sender] == 1,
            "Project: Developer already verified or not registered."
        );
        developers[msg.sender] = 2;
        // unirep.verifyReputationProof(reputationPublicSignals, reputationProof);
    }

    // register as a reviewer of this project
    // if the prove is invalid, the transaction will be reverted
    function registerReviewer(
        uint256[] calldata signupPublicSignals,
        uint256[8] calldata signupProof
    ) external {
        require(
            reviewers[msg.sender] == 1,
            "Project: Reviewer already registered or not a valid reviewer."
        );
        reviewers[msg.sender] = 2;
        unirep.userSignUp(signupPublicSignals, signupProof);
    }

    function userStateTransition(
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) public {
        unirep.userStateTransition(publicSignals, proof);
    }

    // receive file url from proposer's proposal and developer's solution
    // You should increase the total proposal count, push the url to the proposals mapping and emit URLSubmitted event
    function submitURL(
        string memory url
    ) external requireStage(Stages.Open) onlyDeveloper {
        solutions.push(Payload(msg.sender, url));
        emit URLSubmitted(msg.sender, url, solutions.length);
    }

    // proposer vote for their favorite solution(s)
    // emit Voted event if the proposal is accepted
    function voteForSolution(
        uint256 solutionId,
        uint8 percent
    ) external requireStage(Stages.Vote) onlyProposer {
        require(
            cumulatedPercentage + percent <= 100,
            "Project: The percentage is over 100"
        );
        uint256 balance = idt.balanceOf(address(this));
        address receiver = solutions[solutionId].author;
        uint256 amount = (percent * balance) / 100;
        rewards[receiver] += amount; // Add the votes from the Proposer to the proposalId.
        cumulatedPercentage += percent;
        emit Voted(solutionId, receiver, percent);
    }

    // reviewers review the solution and send reputation by unirep
    // emit Reviewed event if the solution is accepted
    function review(
        uint256 epochKey,
        uint48 targetEpoch,
        uint256 fieldIndex,
        uint256 val
    ) external requireStage(Stages.Review) onlyReviewer {
        unirep.attest(epochKey, targetEpoch, fieldIndex, val);
    }

    // claim reward for the specific developer address
    // the reward will issue to the author's address of the proposal
    // emit RewardClaimed event
    function claimReward() external requireStage(Stages.Reward) onlyDeveloper {
        require(rewards[msg.sender] > 0, "Insufficient balance");
        require(
            idt.transfer(msg.sender, rewards[msg.sender]),
            "Reward transfer failed"
        );
        rewards[msg.sender] = 0;
        emit RewardClaimed(msg.sender, rewards[msg.sender]);
    }
}
