pragma solidity ^0.4.11;

contract ContractManager {

  struct MyContracts {
    address payrollAddr;
  }

  mapping(address => MyContracts) manager;

  function ContractManager() {

  }

  function getPayrollContract() constant returns(address) {
    return manager[msg.sender].payrollAddr;
  }

  function addPayrollContract(address addr) returns(address) {
    manager[msg.sender] = MyContracts(addr);

    return manager[msg.sender].payrollAddr;
  }
}

