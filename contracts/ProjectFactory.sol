// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Project.sol";
import "./IDTToken.sol";
import {Unirep} from "@unirep/contracts/Unirep.sol";

contract ProjectFactory {
    address[] public ProjectAddress;
    Unirep public unirep;
    IDTToken public idt;
    uint256 internal _count;

    // count for project number.
    constructor(address _unirepAddr, address _idtAddr) {
        _count = 0;
        unirep = Unirep(_unirepAddr);
        idt = IDTToken(_idtAddr);
    }

    function createProject(
        string memory name,
        uint256 amount,
        uint256 expiration,
        uint256 threshold,
        string memory proposalURL // url of the proposal
    ) public {
        // create IPJToken for project
        IPJToken token = new IPJToken(
            string.concat("IPJToken for ", name),
            string.concat("IPJ#", Strings.toString(_count)),
            amount
        );

        // deploy project contract and push project address into ProjectAddress list.
        Project project = new Project(
            name,
            msg.sender,
            expiration,
            threshold,
            token,
            proposalURL,
            idt,
            unirep
        );
        ProjectAddress.push(address(project));

        // increase project number
        _count++;
    }

    function count() public view returns (uint256) {
        return _count;
    }
}
