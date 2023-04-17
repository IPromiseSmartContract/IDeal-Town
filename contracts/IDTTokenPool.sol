// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract IDTTokenPool is  ERC721, Ownable {
    address public idtAddress; 
    uint256 public  idtAmount ; // The amount of ID tokens required for NFT
    uint256 public  NFT_ID ; // The ID of the NFT to be awarded
    mapping(address => bool) public isLocked; // Mapping to check if an address has locked ID tokens
    uint256 public lockTime; // Minimum amount of time to lock tokens
    mapping(address => uint256) public lockRecord; // Keep tracking of the time when tokens were locked
    mapping(address => uint256) public lockAmount; // Keep tracking of the locked amount of the address

    constructor(address _idtAddress,uint _idtAmount,uint _lockTime) ERC721("IDT Token Pool NFT", "IDTNFT") {
        idtAddress = _idtAddress;
        idtAmount = _idtAmount ;
        lockTime = _lockTime; //Unit of lockTime is seconds
        NFT_ID=0;
    }
    
    // Lock IDT tokens to get the IDTNFT
    function lockTokens(uint amount) external {
        require(isLocked[msg.sender] == false, "Tokens already locked"); 
        require(IERC20(idtAddress).balanceOf(msg.sender) >= amount, "Insufficient IDT tokens");
        require(amount >= idtAmount, "Not enough IDT tokens to lock");
        lockAmount[msg.sender]+=amount;
        IERC20(idtAddress).transferFrom(msg.sender, address(this), amount);
        lockRecord[msg.sender] = block.timestamp;
        isLocked[msg.sender] = true;
        _mint(msg.sender, NFT_ID);
        NFT_ID++;
    }
    
    // Allow users to unlock their ID tokens
    function unlockTokens() external {
        require(isLocked[msg.sender], "Tokens not locked");
        require(lockRecord[msg.sender] + lockTime <= block.timestamp, "Lock time not expired");
        IERC20(idtAddress).transfer(msg.sender, lockAmount[msg.sender]);
        lockAmount[msg.sender] = 0;
        isLocked[msg.sender] = false;
        //_burn(NFT_ID);
    }
}
