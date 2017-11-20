const Payroll = artifacts.require('./Payroll.sol');

contract('Payroll', (accounts) => {
  let instance;
  const account = accounts[0];

  beforeEach(async () => {
    instance = await Payroll.new({ from: account });
  });

  it('should confirm contract is deployed with 0 eth', async () => {
    const balance = await instance.getBalance.call();

    assert.equal(balance.valueOf(), 0, '0 wasn\'t in the contract');
  });

  it('should deposit 1000 eth', async () => {
    await instance.deposit({ from: account, value: 1000 });
    const balance = await instance.getBalance.call();

    assert.equal(balance.valueOf(), 1000, '1000 was not deposited');
  });

  it('should be able to create a new employee', async () => {
    const address = await instance.newEmployee.call(account, 50);

    assert.equal(address, account, 'employee was not created');
  });

  it('should return the rate of an employee', async () => {
    await instance.newEmployee(account, 50);
    const rate = await instance.getRate.call(account);

    assert.equal(rate.valueOf(), 50, 'employees rate was not stored correctly');
  });

  it('should log hours to an employee', async () => {
    await instance.newEmployee(account, 50);
    const hours = await instance.logHours.call(8, { from: account });

    assert.equal(hours.valueOf(), 8, 'employees hours was not logged correctly');
  });

  it('should add to existing hours', async () => {
    await instance.newEmployee(account, 50);
    await instance.logHours(8, { from: account });
    const hours = await instance.logHours.call(8, { from: account });

    assert.equal(hours.valueOf(), 16, 'employees hours was not logged correctly');
  });

  it('should return the hours of an employee', async () => {
    await instance.newEmployee(account, 50);
    await instance.logHours(8, { from: account });
    const hours = await instance.getHours.call(account);

    assert.equal(hours.valueOf(), 8, 'employees rate was not stored correctly');
  });

  it('should be able to set rate if owner', async () => {
    await instance.newEmployee(account, 50);
    const rate = await instance.setRate.call(account, 100);

    assert.equal(rate.valueOf(), 100, 'rate was not set correctly');
  });

  it('should be able to pay an employee', async () => {
    await instance.deposit({ from: account, value: 1000 });
    await instance.newEmployee(account, 50, { from: account });
    await instance.logHours(8, { from: account });
    const amount = await instance.payEmployee.call(account, { from: account });

    assert.equal(amount.valueOf(), 400, 'amount paid was not correct');
  });

  it('should return employee list', async () => {
    await instance.newEmployee(account, 50);
    const list = await instance.getEmployeeList.call();

    assert.equal(list.length, 1, 'wrong number of employees returned from contract');
  });

});
