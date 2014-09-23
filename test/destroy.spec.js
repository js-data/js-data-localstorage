describe('dsLocalStorageAdapter#destroy', function () {
  it('should destroy a user from localStorage', function (done) {
    var id;
    dsLocalStorageAdapter.create(User, { name: 'John' })
      .then(function (user) {
        id = user.id;
        return dsLocalStorageAdapter.destroy(User, user.id);
      })
      .then(function (user) {
        assert.isFalse(!!user);
        return dsLocalStorageAdapter.find(User, id);
      })
      .then(function () {
        done('Should not have reached here!');
      })
      .catch(function (err) {
        assert.equal(err.message, 'Not Found!');
        done();
      });
  });
});
