// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

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

    mapping(address => bool) public developers;
    mapping(address => bool) public reviewers;
    mapping(uint256 => uint256) public votes; // Store every proposalId's number of votes

    modifier onlyProposer() {
        require(
            msg.sender == proposer,
            "Project: Only proposer can call this function."
        );
        _;
    }
    modifier onlyDeveloper() {
        require(
            developers[msg.sender],
            "Project: Only developer can call this function."
        );
        _;
    }
    modifier requireStage(Stages _stage) {
        require(currentStage == _stage, "Project is not in the right stage.");
        _;
    }

    event URLSubmitted(address indexed submitter, string url);
    event Voted(address indexed voter, uint256 proposalIndex);
    event Reviewed(address indexed reveiwer, uint256 proposalIndex);
    event RewardClaimed(address indexed sender, uint256 proposalIndex);

    constructor(
        string memory _name,
        address _proposer,
        uint256 _expiration,
        uint256 _threshold,
        IPJToken _ipjtoken,
        string memory _proposalURL,
        IDTToken _idt,
        Unirep _unirep
    ) {
        name = _name;
        proposer = _proposer;
        expiration = _expiration;
        threshold = _threshold;
        ipjtoken = _ipjtoken;
        currentStage = Stages.Open;

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
            !developers[msg.sender],
            "Project: Developer already registered."
        );
        developers[msg.sender] = true;
        unirep.userSignUp(signupPublicSignals, signupProof);
        // TODO: unirep.verifyReputationProof(reputationPublicSignals, reputationProof);
    }

    function userStateTransition(
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) external {
        unirep.userStateTransition(publicSignals, proof);
    }

    // receive file url from proposer's proposal and developer's solution
    // You should increase the total proposal count, push the url to the proposals mapping and emit URLSubmitted event
    function submitURL(
        string memory url
    ) external requireStage(Stages.Open) onlyDeveloper {
        solutions.push(Payload(msg.sender, url));
        emit URLSubmitted(msg.sender, url);
    }

    // proposer vote for their favorite solution(s)
    // emit Voted event if the proposal is accepted
    function voteForSolution(
        uint256 solutionId,
        uint8 percent
    ) external onlyProposer requireStage(Stages.Vote) {
        require(
            cumulatedPercentage + percent <= 100,
            "Project: The percentage is over 100"
        );
        uint256 balance = idt.balanceOf(address(this));
        votes[solutionId] += (percent * balance) / 100; // Add the votes from the Proposer to the proposalId.
        cumulatedPercentage += percent;
        emit Voted(msg.sender, solutionId);
    }

    // reviewers review the solution and send reputation by unirep
    // emit Reviewed event if the solution is accepted
    function review(
        uint256 epochKey,
        uint48 targetEpoch,
        uint256 fieldIndex,
        uint256 val
    ) external requireStage(Stages.Review) {
        unirep.attest(epochKey, targetEpoch, fieldIndex, val);
    }

    // claim reward for the specific proposal Index
    // the reward will issue to the author's address of the proposal
    // emit RewardClaimed event
    function claimReward(
        uint256 solutionId
    ) external requireStage(Stages.Reward) {
        // @Maxie revise
        Payload memory proposalStruct = solutions[solutionId];
        address payable developerAddress = payable(proposalStruct.author);
        require(
            idt.transfer(developerAddress, votes[solutionId]),
            "Reward transfer failed"
        );
        votes[solutionId] = 0;
    }
}
