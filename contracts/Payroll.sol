pragma solidity ^0.4.11;

import './math/SafeMath.sol';

contract Payroll {

  struct Employee {
    uint _rate;
    uint _hours;
    bool created;
  }
  address public creator;
  bytes32 public contractName;
  mapping(address => Employee) employees;

  modifier ifOwner() {
    if (msg.sender != creator) revert();
    _;
  }
  
  /*
  * constructor that sets the owner of the contract
  */

  function Payroll(bytes32 _name) {
    creator = msg.sender;
    contractName = _name;
  }
  
  function deposit() public payable {

  }

  /*
  * getters
  */

  function getBalance() public constant returns(uint) {
    return this.balance;
  }

  function getHours(address addr) public constant returns(uint) {
    return employees[addr]._hours;
  }

  function getRate(address addr) public constant returns(uint) {
    return employees[addr]._rate;
  }

  /*
  * setters
  */

  function setRate(address addr, uint _rate) public ifOwner returns(uint) {
    require(_rate >= 0);

    employees[addr]._rate = _rate;

    return employees[addr]._rate;
  }

  function logHours(uint _hours) public returns(uint) {
    address addr = msg.sender;

    require(_hours > 0);

    employees[addr]._hours = SafeMath.add(employees[addr]._hours, _hours);

    return employees[addr]._hours;
  }

  /*
  * functions for owner to update employee information
  */

  function newEmployee(address addr, uint _rate) public ifOwner returns(address) {
    if(employees[addr].created) throw;

    employees[addr] = Employee(_rate, 0, true);
    return addr;
  }

  function payEmployee(address addr) public ifOwner returns(uint) {
    require(employees[addr]._hours > 0);
    uint paymentAmount = SafeMath.mul(employees[addr]._rate, employees[addr]._hours);

    require(this.balance >= paymentAmount);
    addr.transfer(paymentAmount);

    return paymentAmount;
  }

}
