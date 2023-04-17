// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IDTToken is ERC20, Ownable{

    constructor(string memory name_, string memory symbol_,uint256 amount) ERC20(name_, symbol_) {
        _mint(msg.sender,amount);
    }
    
    function mint(address account, uint256 amount) internal virtual {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) internal virtual {
        _burn(account, amount);
    }

}