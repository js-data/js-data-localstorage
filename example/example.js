(function () {
  var dsLocalStorageAdapter = new DSLocalStorageAdapter();

  var datastore = new JSData.DS();
  datastore.defaults.defaultAdapter = 'dsLocalStorageAdapter';
  datastore.adapters.dsLocalStorageAdapter = dsLocalStorageAdapter;

  var User = datastore.defineResource('user');

  angular.module('localStorage-example', [])
    .controller('localStorageCtrl', function ($scope, $timeout) {
      $scope.add = function (user) {
        $scope.creating = true;
        User.create(user).then(function () {
          $scope.creating = false;
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
