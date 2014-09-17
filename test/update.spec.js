describe('localStorageAdapter#update', function () {
  it('should update a user in localStorage', function (done) {
    var id;
    localStorageAdapter.create(User, { name: 'John' })
      .then(function (user) {
        id = user.id;
        assert.equal(user.name, 'John');
        assert.isString(user.id);
        return localStorageAdapter.find(User, user.id);
      })
      .then(function (foundUser) {
        assert.equal(foundUser.name, 'John');
        assert.isString(foundUser.id);
        assert.deepEqual(foundUser, { id: id, name: 'John' });
        return localStorageAdapter.update(User, foundUser.id, { name: 'Johnny' });
      })
      .then(function (updatedUser) {
        assert.equal(updatedUser.name, 'Johnny');
        assert.isString(updatedUser.id);
        assert.deepEqual(updatedUser, { id: id, name: 'Johnny' });
        return localStorageAdapter.find(User, updatedUser.id);
      })
      .then(function (foundUser) {
        assert.equal(foundUser.name, 'Johnny');
        assert.isString(foundUser.id);
        assert.deepEqual(foundUser, { id: id, name: 'Johnny' });
        return localStorageAdapter.destroy(User, foundUser.id);
      })
      .then(function (destroyedUser) {
        assert.isFalse(!!destroyedUser);
        done();
      })
      .catch(done);
  });
});
