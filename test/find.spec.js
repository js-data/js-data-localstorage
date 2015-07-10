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
  it('should find a user with relations', function () {
    var id, id2, _user, _post, _comments;
    return dsLocalStorageAdapter.create(User, {name: 'John'})
      .then(function (user) {
        _user = user;
        id = user.id;
        assert.equal(user.name, 'John');
        assert.isDefined(user.id);
        return dsLocalStorageAdapter.find(User, user.id);
      })
      .then(function (user) {
        assert.equal(user.name, 'John');
        assert.isDefined(user.id);
        assert.equalObjects(user, {id: id, name: 'John'});
        return dsLocalStorageAdapter.create(Post, {
          content: 'test',
          userId: user.id
        });
      })
      .then(function (post) {
        _post = post;
        id2 = post.id;
        assert.equal(post.content, 'test');
        assert.isDefined(post.id);
        assert.isDefined(post.userId);
        return Promise.all([
          dsLocalStorageAdapter.create(Comment, {
            content: 'test2',
            postId: post.id,
            userId: _user.id
          }),
          dsLocalStorageAdapter.create(Comment, {
            content: 'test3',
            postId: post.id,
            userId: _user.id
          })
        ]);
      })
      .then(function (comments) {
        _comments = comments;
        _comments.sort(function (a, b) {
          return a.content > b.content;
        });
        return dsLocalStorageAdapter.find(Post, _post.id, {'with': ['user', 'comment']});
      })
      .then(function (post) {
        post.comments.sort(function (a, b) {
          return a.content > b.content;
        });
        assert.equalObjects(post.user, _user, 'post.user should equal _user');
        assert.equalObjects(post.comments, _comments, 'post.comments should equal _comments');
        return dsLocalStorageAdapter.destroyAll(Comment);
      })
      .then(function () {
        return dsLocalStorageAdapter.destroy(Post, id2);
      })
      .then(function () {
        return dsLocalStorageAdapter.destroy(User, id);
      })
      .then(function (user) {
        assert.isFalse(!!user);
        return dsLocalStorageAdapter.find(User, id);
      })
      .then(function () {
        throw new Error('Should not have reached here!');
      })
      .catch(function (err) {
        assert.equal(err.message, 'Not Found!');
      });
  });
});
