describe('dsLocalStorageAdapter#destroy', function () {
  it('should destroy a user from localStorage', function (done) {
    var id;
    dsLocalStorageAdapter.create(User, { name: 'John' })
      .then(function (user) {
        id = user.id;
        return dsLocalStorageAdapter.destroy(User, user.id);
      })
      .then(function () {
        return dsLocalStorageAdapter.find(User, id);
      })
      .then(function (destroyedUser) {
        assert.isFalse(!!destroyedUser);
        done();
      })
      .catch(done);
  });
});
