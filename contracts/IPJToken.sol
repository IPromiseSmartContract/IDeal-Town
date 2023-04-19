// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IPJToken is ERC20, Ownable{
    mapping(address => uint256) private _balances;
    uint256 _maxSupply;
    uint256 _totalSupply;

    constructor(string memory name_, string memory symbol_, uint256 amount) ERC20(name_, symbol_) {
        // maxSupply : the max supply of token.
        // totalSupply : the current supply of token.
        _maxSupply = amount * 10 ** decimals();
        _totalSupply = 0;
    }
    
    // only owner (specific project) can call mint or burn function
    function mint(address account, uint256 amount) external onlyOwner{
        // totalSupply couldn't more than maxSupply.
        require(_totalSupply + amount * 10 ** decimals() <= _maxSupply, "IPJToken: total supply exceeds maximum supply");
        _mint(account, amount * 10 ** decimals());
    }

    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount * 10 ** decimals());
    }
}