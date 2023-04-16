// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Project {
    string public name;
    address public owner;
    uint256 public expiration;
    uint256 public threshold;
    address public token;
    
    constructor(string memory _name, address _owner, uint256 _expiration, uint256 _threshold, address _token) {
        name = _name;
        owner = _owner;
        expiration = _expiration;
        threshold = _threshold;
        token = _token;
    }
}

