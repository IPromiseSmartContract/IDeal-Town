// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IPJToken is ERC20, Ownable{
    uint256 _maxSupply;
    uint256 _totalSupply;

    constructor(string memory name_, string memory symbol_, uint256 amount) ERC20(name_, symbol_) {
        // need 10000 IDT to mint all of them.
        _maxSupply = amount * 10 ** decimals();
        _totalSupply = 0;
    }
    
    function mint(address account, uint256 amount) internal virtual {
        require(_totalSupply + amount <= _maxSupply, "IPJToken: total supply exceeds maximum supply");
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) internal virtual {
        _burn(account, amount);
    }

}