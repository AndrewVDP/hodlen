import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import payroll_artifacts from '../../build/contracts/Payroll.json'

var Payroll = contract(payroll_artifacts);

var accounts;
var account;

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
      account = accounts[0];
      
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

  refreshBalance: function() {
    var self = this;

    var inst;
    Payroll.deployed().then(function(instance) {
      inst = instance;
      return inst.getBalance({ from: account });
    }).then(function(value) {
      var balance = document.getElementById("accountBalance");
      balance.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log('Error getting balance', e);
    });
  },

  insertEmployee: function() {
    var self = this;

    var rate = parseInt(document.getElementById("employeeRate").value);
    var address = document.getElementById("employeeAddress").value;

    Payroll.deployed().then(function(instance) {
      return instance.newEmployee(address, rate, { from: account });
    }).then(function(result) {
      console.log('success', result);
    }).catch(function(e) {
      console.log('error when trying to create employee:', e);
    });
  },

  logHours: function() {
    var self = this;

    var hours = parseInt(document.getElementById('hours').value);

    Payroll.deployed().then(function(instance) {
      instance.logHours(hours, { from: account })
    }).then(function(result) {
      console.log('success', result);
    }).catch(function(e) {
      console.log('error loggin hours', e);
    })
  },

  depositEth: function() {
    var self = this;
    self.setStatus("Starting deposit, please wait...");

    var eth = parseInt(document.getElementById('ethDeposit').value);

    Payroll.deployed().then(function(instance) {
      return instance.deposit({ value: 1000, from: account })
    }).then(function(result) {
      self.refreshBalance();
      self.setStatus("Transaction complete!");
      console.log('eth should have been deposited');
    }).catch(function(e) {
      self.setStatus("error completing deposit");
      console.log('Error depositing eth', e);
    })
  },

  getEmployeeRate: function(address) {
    var self = this;

    var address = document.getElementById("address").value;

    Payroll.deployed().then(function(instance) {
      return instance.getRate.call(address)
    }).then(function(data) {
      self.setEmployeeInfo(data.valueOf());
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

  newPayrolContract: function() {
    var self = this;

    Payroll.new().then(function(instance) {
      console.log('instance.address', instance.address);
      var contractAddress = document.getElementById("contractAddress");
      contractAddress.innerHTML = instance.address;
    }).catch(function(e) {
      console.log('Error creating contract', e);
    })
  }

};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
