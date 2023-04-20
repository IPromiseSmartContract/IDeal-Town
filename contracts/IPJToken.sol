// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract IPJToken is ERC20, ERC20Permit {
    mapping(address => uint256) private _balances;
    address public owner;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) ERC20Permit(_name) {}

    modifier onlyOwner() {
        require(msg.sender == owner, "IPJToken: caller is not the owner");
        _;
    }

    modifier isInitialized() {
        require(owner != address(0), "IPJToken: not initialized");
        _;
    }

    function initialize(address _owner) external {
        require(owner == address(0), "IPJToken: already initialized");
        owner = _owner;
    }

    // only owner (specific project) can call mint or burn function
    function mint(
        address account,
        uint256 amount
    ) external isInitialized onlyOwner {
        _mint(account, amount);
    }

    function burn(
        address account,
        uint256 amount
    ) external isInitialized onlyOwner {
        _burn(account, amount);
    }
}
