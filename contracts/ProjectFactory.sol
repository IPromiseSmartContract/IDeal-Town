// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Project.sol";
import {Unirep} from "@unirep/contracts/Unirep.sol";

contract ProjectFactory {
    address[] public ProjectAddress;
    Unirep public unirep;
    uint256 internal _count;

    // count for project number.
    constructor(address _addr) {
        _count = 0;
        unirep = Unirep(_addr);
    }

    function createProject(
        string memory name,
        uint256 amount,
        uint256 expiration,
        uint256 threshold,
        string memory proposalURL // url of the proposal
    ) public {
        // deploy project contract and push project address into ProjectAddress list.
        Project project = new Project(
            name,
            msg.sender,
            expiration,
            threshold,
            _count,
            amount,
            proposalURL,
            unirep
        );
        ProjectAddress.push(address(project));

        // add project number
        _count++;
    }

    function count() public view returns (uint256) {
        return _count;
    }
}
