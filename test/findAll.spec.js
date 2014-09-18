describe('dsLocalStorageAdapter#findAll', function () {
  it('should filter users', function (done) {
    var id;

    dsLocalStorageAdapter.findAll(User, {
      age: 30
    }).then(function (users) {
      assert.equal(users.length, 0);
      return dsLocalStorageAdapter.create(User, { name: 'John' });
    }).then(function (user) {
      id = user.id;
      return dsLocalStorageAdapter.findAll(User, {
        name: 'John'
      });
    }).then(function (users) {
      assert.equal(users.length, 1);
      assert.deepEqual(users[0], { id: id, name: 'John' });
      return dsLocalStorageAdapter.destroy(User, id);
    }).then(function (destroyedUser) {
      assert.isFalse(!!destroyedUser);
      done();
    }).catch(done);
  });
});
