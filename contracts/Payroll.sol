pragma solidity ^0.4.11;

import './math/SafeMath.sol';

contract Payroll {

  struct Employee {
    uint _rate;
    uint _hours;
  }
  address public contractOwner;
  mapping(address => Employee) employees;
  address[] public employeeList;

  modifier isOwner {
    assert(msg.sender == contractOwner);
    _;
  }

  modifier isValidEmployee(address emplAddr) { 
    assert(employees[emplAddr]._rate > 0); 
    _; 
  }
  
  modifier isValueBiggerThanZero(uint value) {
    require(value > 0);
    _;
  }

  /*
  * constructor that sets the owner of the contract
  */
  function Payroll() public {
    contractOwner = msg.sender;
  }
  
  function deposit() public payable {

  }

  /*
  * getters
  */
  function getBalance() public view returns(uint) {
    return this.balance;
  }

  function getHours(address addr) public constant returns(uint) {
    return employees[addr]._hours;
  }

  function getRate(address addr) public constant returns(uint) {
    return employees[addr]._rate;
  }

  function getEmployeeList() public constant returns(address[]) {
    return employeeList;
  }

  /*
  * setters
  */
  function setRate(address addr, uint _rate)
    public
    isOwner
    isValidEmployee(addr)
    isValueBiggerThanZero(_rate)
    returns(uint)
  {
    employees[addr]._rate = _rate;
    return employees[addr]._rate;
  }

  function logHours(uint _hours)
    public
    isValidEmployee(msg.sender)
    isValueBiggerThanZero(_hours)
    returns(uint)
  {
    address addr = msg.sender;
    employees[addr]._hours = SafeMath.add(employees[addr]._hours, _hours);
    return employees[addr]._hours;
  }

  function newEmployee(address addr, uint _rate)
    public
    isOwner
    isValueBiggerThanZero(_rate)
    returns(address)
  {
    // check if employee already exists
    if(employees[addr]._rate > 0) revert();

    employeeList.push(addr);
    employees[addr] = Employee(_rate, 0);
    return addr;
  }

  function payEmployee(address addr)
    public
    isOwner
    isValidEmployee(addr)
    returns(uint)
  {
    require(employees[addr]._hours > 0);
    uint paymentAmount = SafeMath.mul(employees[addr]._rate, employees[addr]._hours);

    require(this.balance >= paymentAmount);
    
    employees[addr]._hours = 0;
    addr.transfer(paymentAmount);
    
    return paymentAmount;
  }

}
