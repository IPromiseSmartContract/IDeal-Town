// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IDTToken is ERC20, Ownable {
    uint _premint_amount;

    constructor(uint _amount) ERC20("IDealTown", "IDT") {
        _premint_amount = _amount; // use constructor to determine the premint amount
        _mint(msg.sender, _amount * 10 ** decimals()); // premint some tokens
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount * 10 ** decimals());
    }
}
