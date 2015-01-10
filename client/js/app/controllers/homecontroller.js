(function(){
	$.App.ScrumPoker.controller('HomeController',function($scope){
		
		$scope.roomId = '';

		$scope.getRoom = function(){
			return "#/estimation_room?" + ($scope.roomId || $.roomNumber());
		};

	});
}());
