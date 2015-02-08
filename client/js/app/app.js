(function($){

	$.App = {};

	$.App.ScrumPoker = angular.module('ScrumPoker', ['ngRoute']);

	$.App.ScrumPoker.config(function($routeProvider){
		        $routeProvider.when('/', {
                        templateUrl : '/views/home.html',
                        controller  : 'HomeController'
                });
        

                $routeProvider.when('/estimation_room/', {
                        templateUrl : '/views/estimation_room.html',
                        controller  : 'EstimationController'
                });

                $routeProvider.otherwise({
                    redirectTo: '/'
                });
	});

    $.roomNumber = function(){
        return Math.floor(Math.random() * 5000);
    };

    $.getRoom = function(){
        var url = window.location.href,
            index = null;
        if(url.lastIndexOf('?') != -1) {
            index = url.split('?')[1];
        }
        return index;
    };

}(jQuery));