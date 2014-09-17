describe('dsLocalStorageAdapter#find', function () {
  it('should find a user in localStorage', function (done) {
    var id;
    dsLocalStorageAdapter.create(User, { name: 'John' })
      .then(function (user) {
        id = user.id;
        assert.equal(user.name, 'John');
        assert.isString(user.id);
        return dsLocalStorageAdapter.find(User, user.id);
      })
      .then(function (user) {
        assert.equal(user.name, 'John');
        assert.isString(user.id);
        assert.deepEqual(user, { id: id, name: 'John' });
        return dsLocalStorageAdapter.destroy(User, id);
      })
      .then(function (destroyedUser) {
        assert.isFalse(!!destroyedUser);
        done();
      })
      .catch(done);
  });
});
