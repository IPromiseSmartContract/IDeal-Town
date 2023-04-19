// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Project.sol";
import "./IDTToken.sol";
import {Unirep} from "@unirep/contracts/Unirep.sol";

contract ProjectFactory {
    Unirep public unirep;
    IDTToken public idt;
    uint256 public count;
    uint48 internal constant epochLength = 1000;

    event ProjectCreated(
        address indexed creator,
        address projectAddress,
        address tokenAddress
    );

    modifier incr() {
        _;
        count++;
    }

    // count for project number.
    constructor(address _unirepAddr, address _idtAddr) {
        unirep = Unirep(_unirepAddr);
        idt = IDTToken(_idtAddr);
    }

    function createProject(
        string memory name,
        uint256 expiration,
        uint256 threshold,
        string memory proposalURL // url of the proposal
    ) public incr {
        // create IPJToken for project
        IPJToken token = new IPJToken(
            string.concat("IPJToken for ", name),
            string.concat("IPJ#", Strings.toString(count))
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
        project.registerAttester(epochLength);
        emit ProjectCreated(msg.sender, address(project), address(token));
    }
}
