(function () {
  $.App.ScrumPoker.controller('HomeController', function ($scope) {
    $scope.roomName = ''

    $scope.getRoom = function () {
      return '#/estimation/room?' + $scope.roomName
    }
  })
}())
