// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Project.sol";

contract ProjectFactory {
    address[] public ProjectAddress;
    uint256 _count;
    
    // count for project number.
    constructor() {
        _count = 0;
    }

    function createProject(string memory name, uint256 amount, uint256 expiration, uint256 threshold) public {
        // deploy project contract and push project address into ProjectAddress list.
        Project project = new Project(name, address(this), expiration, threshold, _count, amount);
        ProjectAddress.push(address(project));

        // add project number
        _count++;
    }

    function count() view public returns(uint256){
        return _count;
    }
}
