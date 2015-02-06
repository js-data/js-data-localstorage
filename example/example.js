(function () {
  angular.module('localStorage-example', ['js-data'])
    .factory('store', function () {
      var store = new JSData.DS();

      store.registerAdapter('localstorage', new DSLocalStorageAdapter(), { default: true });

      return store;
    })
    .factory('User', function (store) {
      return store.defineResource('user');
    })
    .controller('localStorageCtrl', function ($scope, $timeout, User) {
      var lsCtrl = this;

      User.findAll().then(function (users) {
        $scope.users = users;
      });

      User.bindAll({}, $scope, 'users');

      $scope.add = function (user) {
        return User.create(user).then(function () {
          lsCtrl.name = '';
        });
      };

      $scope.remove = function (user) {
        return User.destroy(user.id);
      };
    });
})();
