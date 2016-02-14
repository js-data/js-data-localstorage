beforeEach(function () {
  localStorage.clear()
})

window.assert = TestRunner.assert

TestRunner.init({
  features: [],
  JSData: JSData,
  Adapter: LocalStorageAdapter,
  adapterConfig: {
    debug: false
  }
})

describe('relation functionality', function () {
  it('nested create', function () {
    var adapter = this.$$adapter
    var User = this.$$User
    return adapter.create(User, {
      name: 'John',
      profile: {
        email: 'john@test.com'
      },
      posts: [
        {
          content: 'foo'
        }
      ]
    }, { with: ['profile', 'post'] }).then(function (user) {
      // console.log(JSON.stringify(user, null, 2))
      assert.isDefined(user)
      assert.isDefined(user.id)
      assert.isDefined(user.profile)
      assert.isDefined(user.profile.id)
      assert.isDefined(user.posts)
      assert.equal(user.posts.length, 1)
      assert.isDefined(user.posts[0].id)
    })
  })
  it('nested create many', function () {
    var adapter = this.$$adapter
    var User = this.$$User
    return adapter.createMany(User, [{
      name: 'John',
      profile: {
        email: 'john@test.com'
      },
      posts: [
        {
          content: 'foo'
        }
      ]
    }, {
      name: 'Sally',
      profile: {
        email: 'sally@test.com'
      },
      posts: [
        {
          content: 'foo'
        }
      ]
    }], { with: ['profile', 'post'] }).then(function (users) {
      // console.log(JSON.stringify(users, null, 2))
      assert.isDefined(users[0])
      assert.isDefined(users[0].id)
      assert.isDefined(users[0].profile)
      assert.isDefined(users[0].profile.id)
      assert.isDefined(users[0].posts)
      assert.equal(users[0].posts.length, 1)
      assert.isDefined(users[0].posts[0].id)
      assert.isDefined(users[1])
      assert.isDefined(users[1].id)
      assert.isDefined(users[1].profile)
      assert.isDefined(users[1].profile.id)
      assert.isDefined(users[1].posts)
      assert.equal(users[1].posts.length, 1)
      assert.isDefined(users[1].posts[0].id)
    })
  })
})
