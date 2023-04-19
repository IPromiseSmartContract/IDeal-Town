// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IPJToken.sol";
import "hardhat/console.sol";
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
        address authur; // arthur of this proposal
        string url; // url of the proposal
    }

    string public name;
    address public proposer;
    uint256 public expiration;
    uint256 public threshold;
    address public tokenAddress;
    uint256 public totalProposals;
    Stages public currentStage;
    Proposal[] public proposals;
    uint[] public rewardProposal; // Store the rewarded proposalId
    mapping(uint256 => uint256) public votes; // Store every proposalId's number of votes
    mapping(uint256 => bool) public isReward;
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

    event URLSubmitted(address indexed sender, string url);
    event Voted(address indexed sender, uint256 proposalIndex);
    event Reviewed(address indexed sender, uint256 proposalIndex);
    event RewardClaimed(address indexed sender, uint256 proposalIndex);

    constructor(
        string memory _name,
        address _proposer,
        uint256 _expiration,
        uint256 _threshold,
        address _ipjaddr,
        string memory proposalURL
    ) {
        name = _name;
        proposer = _proposer;
        expiration = _expiration;
        threshold = _threshold;
        tokenAddress = _ipjaddr;
        currentStage = Stages.Open;

        submitURL(_proposer, proposalURL);
    }

    function mintToken(uint256 amount) public {
        IToken(tokenAddress).mint(msg.sender, amount);
    }

    function burnToken(uint256 amount) public {
        IToken(tokenAddress).burn(msg.sender, amount);
    }

    function getTokenAddress() public view returns (address) {
        return tokenAddress;
    }

    // @ Test
    // setCurrentStage change the current stage of the project manually without checking
    // Notice that this function is for testing purpose only
    // 0: Open
    // 1: Vote
    // 2: Review
    // 3: Reward
    // 4: Closed
    function setCurrentStage(uint _stage) public {
        currentStage = Stages(_stage);
    }

    // TODO: register as a proposer or developer
    // @ Alan
    function register() external {}

    // TODO: receive file url from proposer's proposal and developer's solution
    // You should increase the total proposal count, push the url to the proposals mapping and emit URLSubmitted event
    // @ Maxie
    function submitURL(
        address developer,
        string memory url
    ) public requireStage(Stages.Open) {
        proposals.push(Proposal(developer, url));
        emit URLSubmitted(developer, url);
    }

    // TODO: proposer vote for their favorite solution(s)
    // You should emit Voted event if the proposal is accepted
    // @ Maxie
    function voteForSolution(uint256 proposalId, uint256 percnet)
        external
        onlyProposer
        requireStage(Stages.Vote) {
        votes[proposalId]+=percnet; // Add the votes from the Proposer to the proposalId.
        rewardProposal.push(proposalId); // Store the rewarded proposalId
        emit Voted(msg.sender, proposalId);
    }

    // TODO: reviewers review the solution and send reputation by unirep
    // You should emit Reviewed event if the solution is accepted
    // @ Alan
    function review() external requireStage(Stages.Review) {}

    // TODO: claim reward after the project is expired
    // You should emit RewardClaimed event
    // @ Maxie
    function claimReward() external requireStage(Stages.Reward) {
        for (uint256 i = 0; i < rewardProposal.length; i++){ 
            uint256 rewardProposalId = rewardProposal[i];
            if (!isReward[rewardProposalId]){ 
                Proposal memory proposalStruct = proposals[rewardProposalId];
                address payable developerAddress = payable(proposalStruct.authur); 
                uint256 rewardAmount = votes[rewardProposalId] / 100;
                require(ERC20(tokenAddress).transfer(developerAddress, rewardAmount), "Reward transfer failed");
                isReward[rewardProposalId] = true;
                emit RewardClaimed(proposer, totalProposals);
            }
        }
}

}
