(function ($) {
  $.App = {}

  $.App.ScrumPoker = angular.module('ScrumPoker', ['ngRoute'])

  $.App.ScrumPoker.config(function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: '/views/home.html',
      controller: 'HomeController'
    })

    $routeProvider.when('/estimation/room/', {
      templateUrl: '/views/estimation.room.html',
      controller: 'EstimationController'
    })

    $routeProvider.otherwise({
      redirectTo: '/'
    })
  })

  $.getRoom = function () {
    const url = window.location.href
    let index = null
    if (url.lastIndexOf('?') > -1) {
      index = url.split('?')[1]
    }
    return index
  }
}(jQuery))
