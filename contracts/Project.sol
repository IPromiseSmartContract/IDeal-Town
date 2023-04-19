// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Unirep} from "@unirep/contracts/Unirep.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IPJToken.sol";

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

    struct Proposal {
        address author; // author of this proposal
        string url; // url of the proposal
    }

    Unirep public unirep;
    uint48 internal constant epochLength = 100;

    string public name;
    address public proposer;
    uint256 public expiration;
    uint256 public threshold;
    IPJToken public ipjtoken;
    Stages public currentStage;

    Proposal[] public proposals; // Index 0 indicates the proposal of proposer, others are developers' solution
    uint[] public rewardProposal; // Store the rewarded proposalId
    uint8 public cumulatedPercentage;

    mapping(address => bool) public developers;
    mapping(address => bool) public reviewers;
    mapping(uint256 => uint8) public votes; // Store every proposalId's number of votes

    modifier onlyProposer() {
        require(
            msg.sender == proposer,
            "Only proposer can call this function."
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
        Unirep _unirep
    ) {
        unirep = _unirep;
        unirep.attesterSignUp(epochLength);
        name = _name;
        proposer = _proposer;
        expiration = _expiration;
        threshold = _threshold;
        ipjtoken = _ipjtoken;
        currentStage = Stages.Open;

        ipjtoken.initialize(address(this));
        submitURL(_proposer, _proposalURL);
    }

    function mintToken(uint256 amount) public {
        ipjtoken.mint(msg.sender, amount);
    }

    function burnToken(uint256 amount) public {
        ipjtoken.burn(msg.sender, amount);
    }

    function getTokenAddress() public view returns (address) {
        return address(ipjtoken);
    }

    // @ Test
    // setCurrentStage change the current stage of the project manually without checking
    // Notice that this function is for testing purpose only
    // 0: Open
    // 1: Vote
    // 2: Review
    // 3: Reward
    // 4: Closed
    function setCurrentStage(uint8 _stage) public {
        currentStage = Stages(_stage);
    }

    // register as a developer of this project
    // one should submit a prove of their reputation is higher than threshold
    // if the prove is invalid, the transaction will be reverted
    function registerDeveloper(
        uint256[] memory publicSignals,
        uint256[8] memory proof
    ) public {
        require(
            !developers[msg.sender],
            "Project: Developer already registered."
        );
        developers[msg.sender] = true;
        unirep.verifyReputationProof(publicSignals, proof);
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
        address developer,
        string memory url
    ) public requireStage(Stages.Open) {
        proposals.push(Proposal(developer, url));
        emit URLSubmitted(developer, url);
    }

    // proposer vote for their favorite solution(s)
    // emit Voted event if the proposal is accepted
    function voteForSolution(
        uint256 proposalId,
        uint8 percnet
    ) external onlyProposer requireStage(Stages.Vote) {
        require(
            cumulatedPercentage + percnet > 100,
            "Project: The percentage is over 100"
        );
        votes[proposalId] += percnet; // Add the votes from the Proposer to the proposalId.
        rewardProposal.push(proposalId); // Store the rewarded proposalId
        cumulatedPercentage += percnet;
        emit Voted(msg.sender, proposalId);
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
        uint256 proposalIndex
    ) external requireStage(Stages.Reward) {
        // @Maxie revise
    }
}
