const ContractManager = artifacts.require('./ContractManager.sol');

contract('ContractManager', (accounts) => {
  let instance;
  const account = accounts[0];
  const account2 = accounts[1];

  beforeEach(async () => {
    instance = await ContractManager.new();
  });

  it('should add a new contract', async () => {
    const address = await instance.addPayrollContract.call(account, { from: account })

    assert.equal(address, account, 'address length was not correct');
  });

  it('should return address of created contract', async () => {
    await instance.addPayrollContract(account2, { from: account });
    const address = await instance.getPayrollContract.call({ from: account });

    assert.equal(address, account2, 'address length was not correct');
  });
});
