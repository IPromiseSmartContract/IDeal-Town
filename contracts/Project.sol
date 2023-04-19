// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

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
        uint256 index; // index of this proposal
        string url; // url of the proposal
    }

    string public name;
    address public proposer;
    uint256 public expiration;
    uint256 public threshold;
    address public tokenAddress;
    uint256 public totalProposals;
    Stages public currentStage;

    mapping(address => Proposal) public proposals;
    mapping(address => uint256) public votes;

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
        uint256 _count,
        uint256 _amount,
        string memory proposalURL
    ) {
        IPJToken Token = new IPJToken(
            string.concat("IPJName#", Strings.toString(_count)),
            string.concat("IPJSymbol#", Strings.toString(_count)),
            _amount
        );
        name = _name;
        proposer = _proposer;
        expiration = _expiration;
        threshold = _threshold;
        tokenAddress = address(Token);
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
        address sender,
        string memory url
    ) public requireStage(Stages.Open) {}

    // TODO: proposer vote for their favorite solution(s)
    // You should emit Voted event if the proposal is accepted
    // @ Maxie
    function voteForSolution()
        external
        onlyProposer
        requireStage(Stages.Vote)
    {}

    // TODO: reviewers review the solution and send reputation by unirep
    // You should emit Reviewed event if the solution is accepted
    // @ Alan
    function review() external requireStage(Stages.Review) {}

    // TODO: claim reward after the project is expired
    // You should emit RewardClaimed event
    // @ Maxie
    function claimReward() external requireStage(Stages.Reward) {}
}
