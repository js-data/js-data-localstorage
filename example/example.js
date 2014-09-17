(function () {
  var localStorageAdapter = new LocalStorageAdapter();

  var datastore = new JSData.DS();
  datastore.defaults.defaultAdapter = 'localStorageAdapter';
  datastore.adapters.localStorageAdapter = localStorageAdapter;

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
