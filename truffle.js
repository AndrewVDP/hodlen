// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  // networks: {
  //   development: {
  //     host: 'localhost',
  //     port: 8545,
  //     network_id: '*' // Match any network id
  //   },
  //   ropsten: {
  //     host: 'localhost',
  //     port: 8545,
  //     network_id: '3'
  //   }
  // }
  networks: {
	  ropsten: {
	    provider: function() {
	      return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/");
	    },
	    network_id: '3',
	  },
	  development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    }
	}
}
