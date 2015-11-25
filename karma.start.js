beforeEach(function () {
  localStorage.clear();
});

window.assert = TestRunner.assert;

TestRunner.init({
  features: [],
  DS: JSData.DS,
  Adapter: DSLocalStorageAdapter
});

// TODO: Move this into js-data-adapter-tests
describe('DSLocalStorageAdapter#createMany', function () {
  it('should create many items at once', function () {
    var adapter = this.$$adapter
    var User = this.$$User
    return adapter.createMany(User, [
      {name: 'John'},
      {name: 'Sally'}
    ]).then(function (users) {
      assert.equal(users[0].name, 'John');
      assert.isDefined(users[0].id);
      assert.equal(users[1].name, 'Sally');
      assert.isDefined(users[1].id);
      return adapter.findAll(User);
    }).then(function (users) {
      assert.equal(users[0].name, 'John');
      assert.isDefined(users[0].id);
      assert.equal(users[1].name, 'Sally');
      assert.isDefined(users[1].id);
    });
  });
});
