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
      User.findAll().then(function () {
        $scope.$apply();
      });
      $scope.add = function (user) {
        $scope.creating = true;
        User.create(user).then(function () {
          $scope.creating = false;
          lsCtrl.name = '';
          $timeout();
        }, function () {
          $scope.creating = false;
        });
      };
      $scope.remove = function (user) {
        $scope.destroying = user.id;
        User.destroy(user.id).then(function () {
          delete $scope.destroying;
          $timeout();
        }, function () {
          delete $scope.destroying;
        });
      };
      $scope.$watch(function () {
        return User.lastModified();
      }, function () {
        $scope.users = User.filter();
      });
    });
})();
