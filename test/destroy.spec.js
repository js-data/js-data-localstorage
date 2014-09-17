describe('localStorageAdapter#destroy', function () {
  it('should destroy a user from localStorage', function (done) {
    var id;
    localStorageAdapter.create(User, { name: 'John' })
      .then(function (user) {
        id = user.id;
        return localStorageAdapter.destroy(User, user.id);
      })
      .then(function () {
        return localStorageAdapter.find(User, id);
      })
      .then(function (destroyedUser) {
        assert.isFalse(!!destroyedUser);
        done();
      })
      .catch(done);
  });
});
