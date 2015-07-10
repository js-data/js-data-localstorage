// Setup global test variables
var dsLocalStorageAdapter, Profile, User, Post, Comment, datastore;

assert.equalObjects = function (a, b, m) {
  assert.deepEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)), m || 'Objects should be equal!');
};

// Helper globals
var fail = function (msg) {
  if (msg instanceof Error) {
    console.log(msg.stack);
  } else {
    assert.equal('should not reach this!: ' + msg, 'failure');
  }
};
var TYPES_EXCEPT_STRING = [123, 123.123, null, undefined, {}, [], true, false, function () {
}];
var TYPES_EXCEPT_STRING_OR_ARRAY = [123, 123.123, null, undefined, {}, true, false, function () {
}];
var TYPES_EXCEPT_STRING_OR_OBJECT = [123, 123.123, null, undefined, [], true, false, function () {
}];
var TYPES_EXCEPT_STRING_OR_NUMBER_OBJECT = [null, undefined, [], true, false, function () {
}];
var TYPES_EXCEPT_ARRAY = ['string', 123, 123.123, null, undefined, {}, true, false, function () {
}];
var TYPES_EXCEPT_STRING_OR_NUMBER = [null, undefined, {}, [], true, false, function () {
}];
var TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER = [null, undefined, {}, true, false, function () {
}];
var TYPES_EXCEPT_NUMBER = ['string', null, undefined, {}, [], true, false, function () {
}];
var TYPES_EXCEPT_OBJECT = ['string', 123, 123.123, null, undefined, true, false, function () {
}];
var TYPES_EXCEPT_BOOLEAN = ['string', 123, 123.123, null, undefined, {}, [], function () {
}];
var TYPES_EXCEPT_FUNCTION = ['string', 123, 123.123, null, undefined, {}, [], true, false];

// Setup before each test
beforeEach(function () {
  localStorage.clear();
  var JSData;
  if (!window && typeof module !== 'undefined' && module.exports) {
    JSData = require('js-data');
  } else {
    JSData = window.JSData;
  }

  datastore = new JSData.DS();

  Profile = datastore.defineResource({
    name: 'profile'
  });
  User = datastore.defineResource({
    name: 'user',
    relations: {
      hasMany: {
        post: {
          localField: 'posts',
          foreignKey: 'post'
        }
      },
      hasOne: {
        profile: {
          localField: 'profile',
          localKey: 'profileId'
        }
      }
    }
  });
  Post = datastore.defineResource({
    name: 'post',
    relations: {
      belongsTo: {
        user: {
          localField: 'user',
          localKey: 'userId'
        }
      },
      hasMany: {
        comment: {
          localField: 'comments',
          foreignKey: 'postId'
        }
      }
    }
  });
  Comment = datastore.defineResource({
    name: 'comment',
    relations: {
      belongsTo: {
        post: {
          localField: 'post',
          localKey: 'postId'
        },
        user: {
          localField: 'user',
          localKey: 'userId'
        }
      }
    }
  });
  dsLocalStorageAdapter = new DSLocalStorageAdapter();
});
