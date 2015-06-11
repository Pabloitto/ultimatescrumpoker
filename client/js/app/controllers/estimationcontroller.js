(function(){
	var EstimationController = function($scope){
		var socket = null;

		function init(){
			$scope.users = [];
			$scope.decks = getDecks();
			$scope.selectedDeck = 'TShirt';
			$scope.cards = [];
			$scope.joined = false;
			$scope.currentEstimation = '';
			$scope.roomId = $.getRoom();
			socket.emit('start',$scope.roomId);
			bindEvents();
		}

		function join(){
			var userToJoin = {
				name : $scope.name,
				estimation : '',
				flipped : false
			};
			$scope.cards = getCardsByDeck($scope.selectedDeck);
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
			$scope.currentEstimation = '';
			socket.emit('cleanEstimations',$scope.roomId);
		}

		function changeDeck(){
			$scope.cards = getCardsByDeck($scope.selectedDeck);
			socket.emit('setDeckInRoom',$scope.roomId,$scope.selectedDeck);
			cleanEstimations();
		}

		function onJoinUser(data,cleanEstimation){
			var room = $.parseJSON(data),
				users = room.users;

			if(room.deck){
				onRemoveDeck(room.deck);
			}

			$scope.$apply(function() {
				var result = [], est = '';
				for(var user in users){
					if(users[user]){
						if(!users[user].flipped && users[user].estimation != ''){
							est = '?';
						}else{
							est = users[user].estimation;
						}
						result.push({
							name : users[user].name,
							estimation : est,
							flipped : users[user].flipped
						});
					}
				}
		    	$scope.users = result;

				if(cleanEstimation === true){
					$scope.currentEstimation = '';
				}

		    });
		}

		function onRemoveDeck(deck){
			if(deck) {
				$scope.selectedDeck = deck;
				$scope.cards = getCardsByDeck(deck);
			}
		}

		function bindEvents(){
			$scope.join = join;
			$scope.estimate = estimate;
			$scope.flipCards = flipCards;
			$scope.cleanEstimations = cleanEstimations;
			$scope.changeDeck = changeDeck;

			socket.on('update',onJoinUser);
			socket.on('onStart',onJoinUser);
			socket.on('removeDeckSelection',onRemoveDeck);
		}

		function getDecks(){
			var decksArray = []
			for(var p in $.App.Deck){
				decksArray.push(p);
			}
			return decksArray;
		}

		function getCardsByDeck(deck){
			return $.App.Deck[deck].Cards;
		}

		$.get("/api/root",function(data){
			debugger;
			socket = io.connect(data);
			init();
		});
	};

	$.App.ScrumPoker.controller('EstimationController',EstimationController);

}());
