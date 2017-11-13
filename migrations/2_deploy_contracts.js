const SafeMath = artifacts.require("./math/SafeMath.sol");
const Payroll = artifacts.require("./Payroll.sol");
const ContractManager = artifacts.require("./ContractManager.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, Payroll);
  deployer.deploy(Payroll);
  deployer.deploy(ContractManager);
};
