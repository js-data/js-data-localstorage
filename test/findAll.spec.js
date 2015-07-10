describe('dsLocalStorageAdapter#findAll', function () {
  it('should filter users', function (done) {
    var id;

    dsLocalStorageAdapter.findAll(User, {
      age: 30
    }).then(function (users) {
      assert.equal(users.length, 0);
      return dsLocalStorageAdapter.create(User, {name: 'John'});
    }).then(function (user) {
      id = user.id;
      return dsLocalStorageAdapter.findAll(User, {
        name: 'John'
      });
    }).then(function (users) {
      assert.equal(users.length, 1);
      assert.deepEqual(users[0], {id: id, name: 'John'});
      return dsLocalStorageAdapter.destroy(User, id);
    }).then(function (destroyedUser) {
      assert.isFalse(!!destroyedUser);
      done();
    }).catch(done);
  });
  it('should load belongsTo relations', function () {
    return dsLocalStorageAdapter.create(Profile, {
      email: 'foo@test.com'
    }).then(function (profile) {
      return Promise.all([
        dsLocalStorageAdapter.create(User, {name: 'John', profileId: profile.id}).then(function (user) {
          return dsLocalStorageAdapter.create(Post, {content: 'foo', userId: user.id});
        }),
        dsLocalStorageAdapter.create(User, {name: 'Sally'}).then(function (user) {
          return dsLocalStorageAdapter.create(Post, {content: 'bar', userId: user.id});
        })
      ])
    })
      .spread(function (post1, post2) {
        return Promise.all([
          dsLocalStorageAdapter.create(Comment, {
            content: 'test2',
            postId: post1.id,
            userId: post1.userId
          }),
          dsLocalStorageAdapter.create(Comment, {
            content: 'test3',
            postId: post2.id,
            userId: post2.userId
          })
        ]);
      })
      .then(function () {
        return dsLocalStorageAdapter.findAll(Comment, {}, {'with': ['user', 'user.profile', 'post', 'post.user']});
      })
      .then(function (comments) {
        assert.isDefined(comments[0].post);
        assert.isDefined(comments[0].post.user);
        assert.isDefined(comments[0].user);
        assert.isDefined(comments[0].user.profile || comments[1].user.profile);
        assert.isDefined(comments[1].post);
        assert.isDefined(comments[1].post.user);
        assert.isDefined(comments[1].user);
      });
  });
  it('should load hasMany and belongsTo relations', function () {
    return dsLocalStorageAdapter.create(Profile, {
      email: 'foo@test.com'
    }).then(function (profile) {
      return Promise.all([
        dsLocalStorageAdapter.create(User, {name: 'John', profileId: profile.id}).then(function (user) {
          return dsLocalStorageAdapter.create(Post, {content: 'foo', userId: user.id});
        }),
        dsLocalStorageAdapter.create(User, {name: 'Sally'}).then(function (user) {
          return dsLocalStorageAdapter.create(Post, {content: 'bar', userId: user.id});
        })
      ]);
    })
      .spread(function (post1, post2) {
        return Promise.all([
          dsLocalStorageAdapter.create(Comment, {
            content: 'test2',
            postId: post1.id,
            userId: post1.userId
          }),
          dsLocalStorageAdapter.create(Comment, {
            content: 'test3',
            postId: post2.id,
            userId: post2.userId
          })
        ]);
      })
      .then(function () {
        return dsLocalStorageAdapter.findAll(Post, {}, {'with': ['user', 'comment', 'comment.user', 'comment.user.profile']});
      })
      .then(function (posts) {
        assert.isDefined(posts[0].comments);
        assert.isDefined(posts[0].comments[0].user);
        assert.isDefined(posts[0].comments[0].user.profile || posts[1].comments[0].user.profile);
        assert.isDefined(posts[0].user);
        assert.isDefined(posts[1].comments);
        assert.isDefined(posts[1].comments[0].user);
        assert.isDefined(posts[1].user);
      });
  });
});
