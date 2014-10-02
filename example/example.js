(function () {
  angular.module('localStorage-example', [])
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
        $scope.$apply();
      });

      $scope.add = function (user) {
        User.create(user).then(function () {
          lsCtrl.name = '';
          $scope.$apply();
        });
      };

      $scope.remove = function (user) {
        User.destroy(user.id).then(function () {
          $scope.$apply();
        });
      };
    });
})();
