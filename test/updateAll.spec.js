describe('dsLocalStorageAdapter#updateAll', function () {
  it('should update all items', function (done) {
    var id;
    dsLocalStorageAdapter.create(User, { name: 'John' })
      .then(function (user) {
        id = user.id;
        return dsLocalStorageAdapter.findAll(User, {
          name: 'John'
        });
      }).then(function (users) {
        assert.equal(users.length, 1);
        assert.deepEqual(users[0], { id: id, name: 'John' });
        return dsLocalStorageAdapter.updateAll(User, {
          name: 'Johnny'
        }, {
          name: 'John'
        });
      }).then(function (users) {
        assert.equal(users.length, 1);
        assert.deepEqual(users[0], { id: id, name: 'Johnny' });
        return dsLocalStorageAdapter.findAll(User, {
          name: 'John'
        });
      }).then(function (users) {
        assert.equal(users.length, 0);
        return dsLocalStorageAdapter.findAll(User, {
          name: 'Johnny'
        });
      }).then(function (users) {
        assert.equal(users.length, 1);
        assert.deepEqual(users[0], { id: id, name: 'Johnny' });
        return dsLocalStorageAdapter.destroy(User, id);
      }).then(function (destroyedUser) {
        assert.isFalse(!!destroyedUser);
        done();
      }).catch(done);
  });
});
