// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IPJToken.sol";
import "./Project.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ProjectFactory {
    IPJToken[] public TokenAddress;
    address[] public ProjectAddress;
    uint256 _count;
    
    constructor() {
        _count = 0;
    }

    function createProject(string memory name, uint256 amount, uint256 expiration, uint256 threshold) public {
        IPJToken token = new IPJToken(string.concat("IPJName#", Strings.toString(_count)), string.concat("IPJSymbol#", Strings.toString(_count)), amount);
        TokenAddress.push(token);
        address tokenAddress = address(token);
        Project project = new Project(name, address(this), expiration, threshold, address(tokenAddress));
        ProjectAddress.push(address(project));
        _count++;
        token.transferOwnership(address(project));
    }

    function count() view public returns(uint256){
        return _count;
    }
}
