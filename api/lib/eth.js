const Web3 = require('web3');

const web3 = new Web3();

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

const getBalance = (address) => {
	return web3.eth.getBalance(address);
}
