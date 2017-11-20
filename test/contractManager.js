const ContractManager = artifacts.require('./ContractManager.sol');

contract('ContractManager', (accounts) => {
  let instance;
  const account = accounts[0];

  beforeEach(async () => {
    instance = await ContractManager.new();
  });

  it('should add a new contract', async () => {
    const address = await instance.addPayrollContract.call(account, { from: account })

    assert.equal(address, account, 'address length was not correct');
  });

  it('should return address of created contract', async () => {
    const data = await instance.addPayrollContract(account, { from: account });
    const address = await instance.getPayrollContract.call({ from: account });

    assert.equal(address, account, 'address length was not correct');
  });
});
