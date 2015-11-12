(function () {
  angular.module('localStorage-example', ['js-data'])
    .run(function (DS, DSLocalStorageAdapter) {
      DS.registerAdapter('ls', DSLocalStorageAdapter, { default: true });
    })
    .factory('User', function (DS) {
      return DS.defineResource('user');
    })
    .controller('localStorageCtrl', function ($scope, $timeout, User) {
      var lsCtrl = this;

      User.findAll();

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
