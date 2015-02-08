(function(){
	$.App.ScrumPoker.controller('HomeController',function($scope){
		
		$scope.roomId = $.roomNumber();

		$scope.getRoom = function(){
			return "#/estimation_room?" + ($scope.roomId);
		};

	});
}());
