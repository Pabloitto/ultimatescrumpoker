(function(){
	var EstimationController = function($scope){
		var socket = null;

		function init(){
			$scope.users = [];
			$scope.joined = false;
			$scope.currentEstimation = '';
			$scope.roomId = $.getRoom();
			socket = io.connect("http:127.0.0.1:8081");
			socket.emit('start',$scope.roomId);
			bindEvents();
		}

		function join(){
			var userToJoin = {
				name : $scope.name,
				estimation : '',
				fliped : false
			};

			$scope.joined = true;
			$scope.users.push(userToJoin);
			socket.emit('joined',$scope.roomId, userToJoin);
		}

		function estimate(points){
			socket.emit('estimate',$scope.roomId, points);
			$scope.currentEstimation = points;
		}

		function flipCards(){
			socket.emit('flipCards',$scope.roomId);
		}

		function cleanEstimations(){
			socket.emit('cleanEstimations',$scope.roomId);
			$scope.currentEstimation = '';
		}

		function onJoinUser(data){
			var room = $.parseJSON(data),
				users = room.users;
			$scope.$apply(function() {
				var result = [], est = '';
				for(var user in users){
					if(users[user]){
						if(!users[user].fliped && users[user].estimation != ''){
							est = '?';
						}else{
							est = users[user].estimation;
						}
						result.push({
							name : users[user].name,
							estimation : est,
							fliped : users[user].fliped
						});
					}
				}
		    	$scope.users = result;
		    });
		}

		function bindEvents(){
			$scope.join = join;
			$scope.estimate = estimate;
			$scope.flipCards = flipCards;
			$scope.cleanEstimations = cleanEstimations;

			socket.on('update',onJoinUser);
			socket.on('onStart',onJoinUser);
		}


		init();
	};

	$.App.ScrumPoker.controller('EstimationController',EstimationController);

}());
