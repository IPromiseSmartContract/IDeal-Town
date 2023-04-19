// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IPJToken is ERC20 {
    mapping(address => uint256) private _balances;
    uint256 internal _maxSupply;
    uint256 internal _totalSupply;
    address public owner;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 amount
    ) ERC20(_name, _symbol) {
        // maxSupply : the max supply of token.
        // totalSupply : the current supply of token.
        _maxSupply = amount * 10 ** decimals();
        _totalSupply = 0;
    }

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
        // totalSupply couldn't more than maxSupply.
        require(
            _totalSupply + amount * 10 ** decimals() <= _maxSupply,
            "IPJToken: total supply exceeds maximum supply"
        );
        _mint(account, amount * 10 ** decimals());
    }

    function burn(
        address account,
        uint256 amount
    ) external isInitialized onlyOwner {
        _burn(account, amount * 10 ** decimals());
    }
}
