describe('dsLocalStorageAdapter#update', function () {
  it('should update a user in localStorage', function (done) {
    var id;
    dsLocalStorageAdapter.create(User, { name: 'John' })
      .then(function (user) {
        id = user.id;
        assert.equal(user.name, 'John');
        assert.isString(user.id);
        return dsLocalStorageAdapter.find(User, user.id);
      })
      .then(function (foundUser) {
        assert.equal(foundUser.name, 'John');
        assert.isString(foundUser.id);
        assert.deepEqual(foundUser, { id: id, name: 'John' });
        return dsLocalStorageAdapter.update(User, foundUser.id, { name: 'Johnny' });
      })
      .then(function (updatedUser) {
        assert.equal(updatedUser.name, 'Johnny');
        assert.isString(updatedUser.id);
        assert.deepEqual(updatedUser, { id: id, name: 'Johnny' });
        return dsLocalStorageAdapter.find(User, updatedUser.id);
      })
      .then(function (foundUser) {
        assert.equal(foundUser.name, 'Johnny');
        assert.isString(foundUser.id);
        assert.deepEqual(foundUser, { id: id, name: 'Johnny' });
        return dsLocalStorageAdapter.destroy(User, foundUser.id);
      })
      .then(function (destroyedUser) {
        assert.isFalse(!!destroyedUser);
        done();
      })
      .catch(done);
  });
});
