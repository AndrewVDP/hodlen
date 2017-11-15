pragma solidity ^0.4.11;

/**
 * The ContractManager contract does this and that...
 */
contract ContractManager {

  struct contractList {
    address ownerAddress;
    address[] contracts;
  }

  mapping (address => contractList) manager;

  function ContractManager() {

  }

  function getContractsByOwner(address ownderAddr) constant returns(address[]) {
    return manager[ownderAddr].contracts;
  }

  function addNewContract() returns(bool res) {
    
  }
}

