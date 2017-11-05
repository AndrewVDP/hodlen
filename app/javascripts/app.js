import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import payroll_artifacts from '../../build/contracts/Payroll.json'

var Payroll = contract(payroll_artifacts);

var accounts;
var MetamaskAccount;
var contractAddress;

window.App = {
  start: function() {
    var self = this;

    Payroll.setProvider(web3.currentProvider);

    // Get the initial account balance in you ethereum client.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      MetamaskAccount = accounts[0];
      
      web3.eth.defaultAccount = MetamaskAccount;
      var devAccounts = document.getElementById("devAccounts");
      devAccounts.innerHTML = accs;
      
      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  setEmployeeInfo: function(message) {
    var employeeView = document.getElementById("employeeView");
    employeeView.innerHTML = message;
  },

  ethToWei: function(wei) {
    return wei * 1000000000000000000;
  },

  weiToEth: function(eth) {
    return eth / 1000000000000000000;
  },

  refreshBalance: function() {
    var self = this;

    console.log('foo', web3.eth.getTransactionReceipt('0x321ca1a9bf378d7cbdf813647cd285b9a3e785481ec421582c8ab7333946602b'));
    

    var inst;
    Payroll.deployed().then(function(instance) {
      inst = instance;
      console.log('Payroll address', Payroll.address);
      return inst.getBalance.call({ from: MetamaskAccount });
    }).then(function(value) {
      var balance = document.getElementById("accountBalance");
      balance.innerHTML = self.weiToEth(value.valueOf());
    }).catch(function(e) {
      console.log('Error getting balance', e);
    });
  },

  insertEmployee: function() {
    var self = this;

    var rateInWei = parseInt(document.getElementById("employeeRate").value);
    var address = document.getElementById("employeeAddress").value;

    var rateInWei = self.ethToWei(rateInWei);
    Payroll.deployed().then(function(instance) {
      return instance.newEmployee(address, rateInWei, { from: MetamaskAccount });
    }).then(function(result) {
      console.log('employee inserted', result);
    }).catch(function(e) {
      console.log('error when trying to create employee:', e);
    });
  },

  logHours: function() {
    var self = this;

    var hours = parseInt(document.getElementById('hours').value);

    Payroll.deployed().then(function(instance) {
      instance.logHours(hours, { from: MetamaskAccount })
    }).then(function(result) {
      console.log('hours logged', result);
    }).catch(function(e) {
      console.log('error loggin hours', e);
    })
  },

  depositEth: function() {
    var self = this;
    self.setStatus("Starting deposit, please wait...");

    var eth = parseInt(document.getElementById('ethDeposit').value);
    var wei = self.ethToWei(eth);
    Payroll.deployed().then(function(instance) {
      return instance.deposit({ value: wei, from: MetamaskAccount })
    }).then(function(result) {
      self.refreshBalance();
      self.setStatus("Eth deposited!");
    }).catch(function(e) {
      self.setStatus("error completing deposit");
    })
  },

  getEmployeeRate: function(address) {
    var self = this;

    var address = document.getElementById("address").value;

    Payroll.deployed().then(function(instance) {
      return instance.getRate.call(address)
    }).then(function(data) {
      var rateInEth = self.weiToEth(data.valueOf());
      self.setEmployeeInfo(rateInEth);
    }).catch(function(e) {
      console.log('Error getting rate', e);
    }); 
  },

  getEmployeeHours: function(address) {
    var self = this;

    var address = document.getElementById("address").value;

    Payroll.deployed().then(function(instance) {
      return instance.getHours.call(address)
    }).then(function(data) {
      self.setEmployeeInfo(data.valueOf());
    }).catch(function(e) {
      console.log('Error getting rate', e);
    }); 
  },

  payEmployee: function(address) {
    var self = this;

    var address = document.getElementById("address").value;

    Payroll.deployed().then(function(instance) {
      return instance.payEmployee(address, { from: MetamaskAccount });
    }).then(function(data) {
      console.log('paid employee', data);
      self.setEmployeeInfo(data.valueOf());
    }).catch(function(e) {
      console.log('Error paying employee', e);
    }); 
  },

  newPayrolContract: function() {
    var self = this;
    console.log('foo');
    Payroll.new({ from: MetamaskAccount }).then(function(instance) {
      contractAddress = document.getElementById("contractAddress");
      contractAddress.innerHTML = instance.address;
      console.log('bar');
      console.log('instance.address', instance.address);
    }).catch(function(e) {
      console.log('Error creating contract', e);
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
