import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import payroll_artifacts from '../../build/contracts/Payroll.json'
import contractManager_artifacts from '../../build/contracts/ContractManager.json'

var Payroll = contract(payroll_artifacts);
var ContractManager = contract(contractManager_artifacts);
var MetamaskAccount;
var contractManagerAddr = '0xed28c32ce11378eb7a7fa6106a13442237442110';

window.App = {
  start: function() {
    var self = this;

    // needs to be set before calling <conract>.new()
    Payroll.setProvider(web3.currentProvider);
    ContractManager.setProvider(web3.currentProvider);

    // remove for prod
    self.isMainNet().then(isMainNet => {
      if (isMainNet) {
        web3.currentProvider = null;
        alert('switch to testnet');
        return;
      }
    });

    // get account from ethereum client
    web3.eth.getAccounts((err, accounts) => {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accounts.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      if(typeof(Storage) === "undefined") {
        alert('Could not access localstorage. Please switch browsers');
        return;
      }

      MetamaskAccount = accounts[0];
      web3.eth.defaultAccount = MetamaskAccount;
      var devAccounts = document.getElementById("devAccounts");
      devAccounts.innerHTML = MetamaskAccount;

      // console.log('Creating new contract manager');
      // ContractManager.new({from: MetamaskAccount}).then(data=>{
      // });
    });

    // ContractManager.at(contractManagerAddr).then(instance => {
    //   console.log('found contract manager');
    //   instance.getPayrollContract.call();
    // }).then(contract => {
    //   console.log('contract', contract);
    // }).catch(e => {
    //   console.log('error finding contract', e);
    // });

    var address = localStorage.getItem("contractAddress");
    return Payroll.detectNetwork().then(id => {
      // set the contract address if it's found in localstorage
      if(address !== null) {
        return Payroll.at(address).then(() => {
          Payroll.address = address;
          self.setContractAddress();
          self.refreshBalance();

          return;
        }).catch(e => {
          console.log('contract found in localstorage not found on blockchain');
          var contractAddress = document.getElementById("contractAddress");
          contractAddress.innerHTML = "No Contract found.";

          return;
        });
      }

      var contractAddress = document.getElementById("contractAddress");
      contractAddress.innerHTML = "No Contract found.";

      return;
    }).catch(e => {
      console.log('error detecting network', e);
    });
  },

  setStatus: function(message, element) {
    var status = document.getElementById(element);
    status.innerHTML = message;
  },

  setEmployeeInfo: function(message) {
    var employeeView = document.getElementById("employeeView");
    employeeView.innerHTML = message;
  },

  setContractAddress: function(addr) {
    var setAddr = addr || Payroll.address;
    var address = document.getElementById("contractAddress");
    address.innerHTML = setAddr;
  },

  ethToWei: function(eth) {
    return eth * 1000000000000000000;
  },

  weiToEth: function(wei) {
    return wei / 1000000000000000000;
  },

  getNetowrkId: function() {
    return web3.eth.net.getId().then(function(id) {
      return Promise.resolve(id);
    })
  },

  isMainNet: function() {
    var self = this;

    return self.getNetowrkId().then(id => {
      if(id === 1) {
        return Promise.resolve(true);
      }

      return Promise.resolve(false);
    })
  },

  UpdateContractManager: async function() {
    var self = this;

    console.log('contractManagerAddr', contractManagerAddr);
    const instance = await ContractManager.at(contractManagerAddr);
    console.log('instance', instance);
    console.log('Payroll.address', Payroll.address);
    const contract = await instance.addPayrollContract(Payroll.address, { from: MetamaskAccount });
    console.log('contract', contract);
  },

  refreshBalance: async function() {
    var self = this;

    try {
      const instance = await Payroll.at(Payroll.address);
      const value = await instance.getBalance.call({ from: MetamaskAccount });
      var balance = document.getElementById("accountBalance");
      balance.innerHTML = self.weiToEth(value.valueOf());
    } catch (err) {
      console.log('Error getting balance', err);
    }
  },

  insertEmployee: async function() {
    var self = this;

    var rateInEth = parseInt(document.getElementById("employeeRate").value);
    var address = document.getElementById("employeeAddress").value;
    var rateInWei = self.ethToWei(rateInEth);

    try {
      const instance = await Payroll.at(Payroll.address);
      const result = await instance.newEmployee(address, rateInWei, { from: MetamaskAccount });
      console.log('employee inserted', result);
    } catch (err) {
      console.log('error when trying to create employee:', err);
    }

  },

  logHours: async function() {
    var self = this;

    var hours = parseInt(document.getElementById('hours').value);

    try {
      const instance = await Payroll.at(Payroll.address);
      const result = await instance.logHours(hours, { from: MetamaskAccount });
      console.log('hours logged', result);
    } catch (err) {
      console.log('error loggin hours', err);
    }
  },

  depositEth: async function() {
    var self = this;
    self.setStatus("Starting deposit, please wait...", "status");

    var eth = parseInt(document.getElementById('ethDeposit').value);
    var wei = self.ethToWei(eth);

    try {
      const instance = await Payroll.at(Payroll.address);
      const result = await instance.deposit({ value: wei, from: MetamaskAccount });
      self.refreshBalance();
      self.setStatus("Eth deposited!", "status");
    } catch(err) {
      self.setStatus("error completing deposit", "status");
    }
  },

  getEmployeeRate: async function(address) {
    var self = this;

    var address = document.getElementById("address").value;

    try {
      const instance = await Payroll.at(Payroll.address);
      const data = await instance.getRate.call(address);
      const rateInEth = self.weiToEth(data.valueOf());
      self.setEmployeeInfo(rateInEth);
      return rateInEth;
    } catch (err) {
      console.log('Error getting rate', e);
    }
  },

  getEmployeeHours: async function(address) {
    var self = this;

    var address = document.getElementById("address").value;

    try {
      const instance = await Payroll.at(Payroll.address);
      const data = await instance.getHours.call(address);
      self.setEmployeeInfo(data.valueOf());
      return data.valueOf();
    } catch (err) {
      console.log('Error getting rate', e);
    }
  },

  payEmployee: async function(address) {
    var self = this;

    var address = document.getElementById("address").value;

    try {
      const instance = await Payroll.at(Payroll.address);
      const data = await instance.payEmployee(address, { from: MetamaskAccount });
      self.refreshBalance();
      self.setEmployeeInfo("Paid!");
    } catch (err) {
      console.log('Error paying employee', e);
    }
  },

  newPayrolContract: async function() {
    var self = this;

    self.setStatus("Creating new contract, please wait...", "contractConnectionStatus");
    console.log('creating new contract');

    var payrollContract = new web3.eth.Contract(payroll_artifacts.abi)

    var transaction;

    const instance = await payrollContract.deploy({
      data: payroll_artifacts.bytecode,
      arguments: []
    }).send({
      from: MetamaskAccount
    }).on('error', e => {
      console.log('error deploying new contract', e);
      self.setStatus(`Error creating contract: \n ${e}`, "contractConnectionStatus");
    }).on('transactionHash', transactionHash => {
      transaction = transactionHash;
      self.setStatus("received transactionHash", "contractConnectionStatus");
    }).on('receipt', receipt => {
      self.setStatus("received receipt", "contractConnectionStatus");
    }).on('confirmation', confirmation => {
      self.setStatus("received confirmation", "contractConnectionStatus");
    });

    console.log('new payroll address', instance.options.address);
    Payroll.address = instance.options.address;
    self.setStatus("Contract Created!", "contractConnectionStatus");
    localStorage.setItem("contractAddress", Payroll.address);
    self.setContractAddress();
    self.refreshBalance();
    // self.UpdateContractManager();
  },

  importContract: async function() {
    var self = this;
    
    self.setStatus("Importing new contract, please wait...", "contractConnectionStatus");
    var address = document.getElementById("importContractAddress").value.trim();

    try {
      const instance = Payroll.at(address);
      Payroll.address = address;
      self.setContractAddress();
      self.refreshBalance();
      localStorage.setItem("contractAddress", Payroll.address);
      self.setStatus("Imported contract!", "contractConnectionStatus");
    } catch (err) {
      self.setStatus("Error importing contract", "contractConnectionStatus");
    }
  },

  getEmployeeList: async function() {
    var self = this;

    try {
      const instance = await Payroll.at(Payroll.address);
      const emplList = await instance.getEmployeeList.call();
      console.log(emplList);
      return emplList;  
    } catch (err) {
      console.log('error getting employee list', err);
      return err;
    }
  }
};

window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  App.start();
});
