beforeEach(function () {
  localStorage.clear()
})

TestRunner.init({
  debug: false,
  features: [
    'findHasManyLocalKeys',
    'findHasManyForeignKeys'
  ],
  JSData: JSData,
  Adapter: LocalStorageAdapter,
  adapterConfig: {
    debug: false
  }
})

describe('relation functionality', function () {
  // will be available in js-data 3.0.0-alpha.15
  it.skip('nested create', function () {
    return this.$$container.create('user', {
      name: 'John',
      profile: {
        email: 'john@test.com'
      },
      organization: {
        name: 'Company Inc'
      },
      posts: [
        {
          content: 'foo'
        }
      ]
    }, { with: ['profile', 'post', 'organization'] }).then(function (user) {
      console.log(JSON.stringify(user, null, 2))
      assert.isDefined(user)
      assert.isDefined(user.id)
      assert.isDefined(user.organization)
      assert.isDefined(user.organization.id)
      assert.equal(user.organizationId, user.organization.id)
      assert.isDefined(user.profile)
      assert.isDefined(user.profile.id)
      assert.isDefined(user.posts)
      assert.equal(user.posts.length, 1)
      assert.isDefined(user.posts[0].id)
    })
  })
  it.skip('nested create many', function () {
    return this.$$container.create('user', [{
      name: 'John',
      profile: {
        email: 'john@test.com'
      },
      organization: {
        name: 'Company Inc'
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
      organization: {
        name: 'Company Inc'
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
      assert.isDefined(users[0].organization)
      assert.isDefined(users[0].organization.id)
      assert.equal(users[0].organizationId, users[0].organization.id)
      assert.isDefined(users[0].profile)
      assert.isDefined(users[0].profile.id)
      assert.isDefined(users[0].posts)
      assert.equal(users[0].posts.length, 1)
      assert.isDefined(users[0].posts[0].id)
      assert.isDefined(users[1])
      assert.isDefined(users[1].id)
      assert.isDefined(users[1].organization)
      assert.isDefined(users[1].organization.id)
      assert.equal(users[1].organizationId, users[1].organization.id)
      assert.isDefined(users[1].profile)
      assert.isDefined(users[1].profile.id)
      assert.isDefined(users[1].posts)
      assert.equal(users[1].posts.length, 1)
      assert.isDefined(users[1].posts[0].id)
    })
  })
})
