import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import payroll_artifacts from '../../build/contracts/Payroll.json'

var Payroll = contract(payroll_artifacts);
var ropstenNetId = 3;
var MetamaskAccount;

window.App = {
  start: function() {
    var self = this;

    // needs to be set before calling <conract>.new()
    Payroll.setProvider(web3.currentProvider);

    // remove for prod
    // self.isMainNet().then(isMainNet => {
    //   if (isMainNet) {
    //     web3.currentProvider = null;
    //     alert('switch to testnet');
    //     return;
    //   }
    // });

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
    });

    var address = localStorage.getItem("contractAddress");
    console.log('address', address);
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

  setContractAddress: function() {
    var address = document.getElementById("contractAddress");
    address.innerHTML = Payroll.address;
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

  refreshBalance: function() {
    var self = this;

    Payroll.at(Payroll.address).then(instance => {
      return instance.getBalance.call({ from: MetamaskAccount });
    }).then(value => {
      var balance = document.getElementById("accountBalance");
      balance.innerHTML = self.weiToEth(value.valueOf());
    }).catch(e => {
      console.log('Error getting balance', e);
    });
  },

  insertEmployee: function() {
    var self = this;

    var rateInWei = parseInt(document.getElementById("employeeRate").value);
    var address = document.getElementById("employeeAddress").value;

    var rateInWei = self.ethToWei(rateInWei);

    return Payroll.at(Payroll.address).then(instance => {
      return instance.newEmployee(address, rateInWei, { from: MetamaskAccount });
    }).then(result => {
      return console.log('employee inserted', result);
    }).catch(e => {
      return console.log('error when trying to create employee:', e);
    });
  },

  logHours: function() {
    var self = this;

    var hours = parseInt(document.getElementById('hours').value);
    return Payroll.at(Payroll.address).then(instance => {
      return instance.logHours(hours, { from: MetamaskAccount });
    }).then(result => {
      console.log('hours logged', result);
    }).catch(e => {
      console.log('error loggin hours', e);
    })
  },

  depositEth: function() {
    var self = this;
    self.setStatus("Starting deposit, please wait...", "status");

    var eth = parseInt(document.getElementById('ethDeposit').value);
    var wei = self.ethToWei(eth);
    
    return Payroll.at(Payroll.address).then(instance => {
      return instance.deposit({ value: wei, from: MetamaskAccount });
    }).then(result => {
      self.refreshBalance();
      self.setStatus("Eth deposited!", "status");
    }).catch(e => {
      self.setStatus("error completing deposit", "status");
    })
  },

  getEmployeeRate: function(address) {
    var self = this;

    var address = document.getElementById("address").value;

    return Payroll.at(Payroll.address).then(instance => {
      return instance.getRate.call(address);
    }).then(data => {
      var rateInEth = self.weiToEth(data.valueOf());
      self.setEmployeeInfo(rateInEth);
      return rateInEth;
    }).catch(e => {
      console.log('Error getting rate', e);
    }); 
  },

  getEmployeeHours: function(address) {
    var self = this;

    var address = document.getElementById("address").value;

    return Payroll.at(Payroll.address).then(instance => {
      return instance.getHours.call(address);
    }).then(data => {
      self.setEmployeeInfo(data.valueOf());
      return data.valueOf();
    }).catch(e => {
      console.log('Error getting rate', e);
    }); 
  },

  payEmployee: function(address) {
    var self = this;

    var address = document.getElementById("address").value;

    return Payroll.at(Payroll.address).then(instance => {
      return instance.payEmployee(address, { from: MetamaskAccount });
    }).then(data => {
      console.log('paid employee', data);
      self.refreshBalance();
      self.setEmployeeInfo("Paid!");
    }).catch(e => {
      console.log('Error paying employee', e);
    }); 
  },

  newPayrolContract: function() {
    var self = this;

    self.setStatus("Creating new contract, please wait...", "contractConnectionStatus");
    console.log('creating new contract');
    return Payroll.new({ from: MetamaskAccount }).then(instance => {
      console.log('foo');
      Payroll.address = instance.address;
      self.setContractAddress();
      console.log('bar');
      self.refreshBalance();
      console.log('baz');

      // store new contract address in localstorage
      localStorage.setItem("contractAddress", Payroll.address);
      self.setStatus("Contract Created!", "contractConnectionStatus");
    }).catch(e => {
      console.log('create contract error', e);
      self.setStatus("Error creating contract", "contractConnectionStatus");
    })
  },

  importContract: function() {
    var self = this;
    
    self.setStatus("Importing new contract, please wait...", "contractConnectionStatus");

    var address = document.getElementById("importContractAddress").value.trim();

    return Payroll.at(address).then(() => {
      Payroll.address = address;
      self.setContractAddress();
      self.refreshBalance();
      localStorage.setItem("contractAddress", Payroll.address);
      self.setStatus("Imported contract!", "contractConnectionStatus");
    }).catch(e => {
      self.setStatus("Error importing contract", "contractConnectionStatus");
    });
  },

  getEmployeeList: function() {
    var self = this;

    console.log('get employee list');
    return Payroll.at(Payroll.address).then(function(instance) {
      return instance.getEmployeeList.call();
    }).then(function(emplList) {
      console.log(emplList);
      return emplList;
    }).catch(function(e) {
      console.log('error getting employee list', e);
      return e;
    })
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
