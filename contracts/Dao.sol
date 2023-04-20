// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IDTToken.sol";

interface IToken {
    function balanceOf(address account) external view returns (uint256);
}

contract Dao {
    address public owner;
    address public tokenAddress;
    uint256 public endTime;
    address[] reviewerList;
    bool public voteStage;
    uint256 candidateNum;
    struct Voters{
        address Address;
        uint256 tickets;
    }
    Voters[] public voters;
    struct Candidates{
        address Address;
        uint256 getAmount;
    }
    Candidates[] public candidates;
    
    constructor(address _tokenAddress) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
    }

    function startVoting(uint256 _durationMinutes, address[] memory _candidateAddress) public {
        require(!voteStage, "There are still a voting exist.");
        delete reviewerList;
        // Vote count start from 0
        for (uint i = 0; i < _candidateAddress.length; i++) {
            Candidates memory _newCandidate = Candidates(_candidateAddress[i], 0);
            candidates.push(_newCandidate);
        }
        candidateNum = _candidateAddress.length;
        endTime = block.timestamp + (_durationMinutes * 1 minutes);
        voteStage = true;
    }

    function vote(address _candidateAddress, uint256 _voteAmount) public {
        require(voteStage, "The voting has not been start.");
        require(block.timestamp < endTime, "Voting has ended.");
        bool firstVoted = true;
        uint256 voterPosition;
        for (uint i = 0; i < voters.length; i++) {
            if (voters[i].Address == msg.sender) {
                firstVoted = false;
                voterPosition = i;
                break;
            }
        }
        if (firstVoted) {
            Voters memory _newVoter = Voters(msg.sender, IToken(tokenAddress).balanceOf(msg.sender));
            voters.push(_newVoter);
            voterPosition = voters.length-1;
        }
        require(voters[voterPosition].tickets>_voteAmount, "You don't have enough tickets !");
        uint256 count = 0;
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].Address == _candidateAddress) {
                candidates[i].getAmount += _voteAmount;
                voters[voterPosition].tickets -= _voteAmount;
                count = 1;
                break;
            }
        }
        require(count!=0, "Invalid candidate address.");
    }

    function endVoting(uint electAmount) public {
        require(block.timestamp >= endTime, "Voting has not ended yet.");
        require(voteStage, "The voting has already settled.");
        voteStage = false;
        for (uint i = 0; i < candidateNum; i++) {
            if (candidates[i].getAmount > electAmount) {
                reviewerList.push(candidates[i].Address);          
            }
        }
        delete candidates;
        delete voters;
    }

    function getReviewer() public view returns (address[] memory) {
        return reviewerList;
    }
}