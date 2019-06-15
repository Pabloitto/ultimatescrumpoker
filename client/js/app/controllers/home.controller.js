(function () {
  $.App.ScrumPoker.controller('HomeController', function ($scope) {
    $scope.roomName = ''

    $scope.getRoom = function () {
      return encodeURI('#/estimation/room?' + $scope.roomName)
    }
  })
}())
