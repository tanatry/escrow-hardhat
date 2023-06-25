// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract AddressCreateEscrow {

    struct Escrow {
        address contractAddress;
        address arbiter;
        address beneficiary;
        uint value;
    }

    mapping (address => Escrow[]) dateEscrow;

    function saveEscorw(address contractAddress, address arbiter, address beneficiary, uint value) external {
        dateEscrow[msg.sender].push(Escrow(contractAddress, arbiter, beneficiary, value));
    }

    function getEscrowByaddress() external view returns(Escrow[] memory){
        return dateEscrow[msg.sender];
    }

}