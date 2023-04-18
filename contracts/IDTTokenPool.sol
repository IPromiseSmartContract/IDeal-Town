// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// After reviewing, reviewers can lock thier rewards(IDT Tokens) to this pool. After lockTime pass , they can unlock rewards.
contract IDTTokenPool is Ownable {
    address public idtAddress; 
    uint256 public idtAmount ; // The amount of ID tokens to lock
    mapping(address => bool) public isLocked; // Mapping to check if an address has locked ID tokens
    uint256 public lockTime; // Minimum amount of time to lock tokens
    mapping(address => uint256) public lockRecord; // Keep tracking of the time when tokens were locked
    mapping(address => uint256) public lockAmount; // Keep tracking of the locked amount of the address

    constructor(address _idtAddress,uint _idtAmount,uint _lockTime)  {
        idtAddress = _idtAddress;
        idtAmount = _idtAmount ;
        lockTime = _lockTime; //Unit of lockTime is seconds
    }
    
    // Lock IDT tokens that are going to give to reviewers 
    function lockTokens(uint amount) external {
        require(isLocked[msg.sender] == false, "Tokens already locked"); 
        require(IERC20(idtAddress).balanceOf(msg.sender) >= amount, "Insufficient IDT tokens");
        require(amount >= idtAmount, "Not enough IDT tokens to lock");
        lockAmount[msg.sender]+=amount;
        IERC20(idtAddress).transferFrom(msg.sender, address(this), amount);
        lockRecord[msg.sender] = block.timestamp;
        isLocked[msg.sender] = true;
    }
    
    // Allow reviewers to unlock their ID tokens
    function unlockTokens() external {
        require(isLocked[msg.sender], "Tokens not locked");
        require(lockRecord[msg.sender] + lockTime <= block.timestamp, "Lock time not expired");
        IERC20(idtAddress).transfer(msg.sender, lockAmount[msg.sender]);
        lockAmount[msg.sender] = 0;
        isLocked[msg.sender] = false;
    }
}
