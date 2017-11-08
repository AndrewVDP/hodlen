const Payroll = artifacts.require('./Payroll.sol');

contract('Payroll', (accounts) => {
  it('should assert true', () => {
    return Payroll.deployed().then(instance => {
      assert.isTrue(true);
    });
  });

  it('should confirm contract is deployed with 0 eth', () => {
    return Payroll.deployed().then(instance => instance.getBalance.call())
      .then(balance => {
        assert.equal(balance.valueOf(), 0, '0 wasn\'t in the contract');
      });
  });

  it('should deposit 1000 eth', () => {
    let inst;
    return Payroll.deployed().then(instance => {
      inst = instance;
      return inst.deposit({value: 1000});
    })
    .then(data => inst.getBalance.call())
    .then(balance => {
      assert.equal(balance.valueOf(), 1000, '1000 was not deposited');
    })
  })

  it('should be able to create a new employee', () => {
    return Payroll.deployed().then(instance => {
      return instance.newEmployee.call(accounts[0], 50);
    })
    .then(address => {
      assert.equal(address, accounts[0], 'employee was not created');
    })
  })

  it('should return the rate of an employee', () => {
    let inst;
    return Payroll.deployed().then(instance => {
      inst = instance;
      return inst.newEmployee(accounts[0], 50);
    })
    .then(transaction => inst.getRate.call(accounts[0]))
    .then(data => {
      assert.equal(data.valueOf(), 50, 'employees rate was not stored correctly');
    })
  })

  it('should log hours to an employee', () => {
    return Payroll.deployed().then(instance => {
      return instance.logHours.call(8, { from: accounts[0] });
    })
    .then(data => {
      assert.equal(data.valueOf(), 8, 'employees hours was not logged correctly');
    })
  })

  it('should add to existing hours', () => {
    let inst;
    return Payroll.deployed().then(instance => {
      inst = instance;
      return inst.logHours(8, { from: accounts[0] });
    })
    .then(data => inst.logHours.call(8, { from: accounts[0] }))
    .then(data => {
      assert.equal(data.valueOf(), 16, 'employees hours was not logged correctly');
    })
  })

  it('should return the hours of an employee', () => {
    return Payroll.deployed().then(instance => {
      return instance.getHours.call(accounts[0]);
    })
    .then(data => {
      assert.equal(data.valueOf(), 8, 'employees rate was not stored correctly');
    })
  })

  it('should be able to set rate if owner', () => {
    return Payroll.deployed().then(instance => {
      return instance.setRate.call(accounts[0], 100);
    })
    .then(rate => {
      assert.equal(rate.valueOf(), 100, 'rate was not set correctly');
    })
  })

  it('should be able to pay an employee', () => {
    return Payroll.deployed().then(instance => {
      return instance.payEmployee.call(accounts[0]);
    })
    .then(amount => {
      assert.equal(amount, 400, 'amount paid was not correct');
    })
  })

  it('should return employee list', () => {
    return Payroll.deployed().then(instance => {
      return instance.getEmployeeList.call();
    })
    .then(list => {
      const emplLen = list.length;
      assert.equal(emplLen, 1, 'wrong number of employees returned from contract');
    })
  })

});
