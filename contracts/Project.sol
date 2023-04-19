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
    string public name;
    address public owner;
    uint256 public expiration;
    uint256 public threshold;
    address public tokenAddress;
    
    constructor(string memory _name, address _owner, uint256 _expiration, uint256 _threshold, uint256 _count, uint256 amount) {
        IPJToken Token = new IPJToken(string.concat("IPJName#", Strings.toString(_count)), string.concat("IPJSymbol#", Strings.toString(_count)), amount);
        name = _name;
        owner = _owner;
        expiration = _expiration;
        threshold = _threshold;
        tokenAddress = address(Token);
    }

    function mintToken(uint256 amount) public{
        IToken(tokenAddress).mint(msg.sender, amount);
    }

    function burnToken(uint256 amount) public{
        IToken(tokenAddress).burn(msg.sender, amount);
    }

    function getTokenAddress() public view returns(address) {
        return tokenAddress;
    }
}

