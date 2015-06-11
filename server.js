(function() {


	var http = require('http'),
		path = require('path'),
		socket = require('socket.io'),
		express = require('express'),
		router = express(),
		server = http.createServer(router),
		io = socket.listen(server),
		RoomController = require('roomController');


	router.use(express.static(path.resolve(__dirname, 'client')));

	router.get("/api/root",function(request,response){
		var address = request.get('host');
		console.log(address);
		response.send(address);
	});

	io.on('connection', function (client) {

		var roomController = new RoomController();

		roomController.connect(client);

		client.on('start', function(roomId){
			roomController.init(roomId);
		});
		client.on('joined', function(roomId,clientJoined){
			roomController.join(roomId,clientJoined);
		});
		client.on('estimate',function(roomId,points) {
			roomController.estimate(roomId,points);
		});
		client.on('flipCards',function(roomId){
			roomController.flipCards(roomId);
		});
		client.on('cleanEstimations',function(roomId){
			roomController.cleanEstimations(roomId);
		});
		client.on('disconnect', function() {
			roomController.leaveRoom();
		});
		client.on('setDeckInRoom', function(roomId,deck) {
			roomController.setDeckInRoom(roomId,deck);
		});
	});

	/*server.listen(process.env.PORT || 8081, process.env.IP || "127.0.0.1", function(){
	  var address = server.address();
	  console.log("Server is listening at", address.address + ":" + address.port);
	});*/

	 router.set('port', (process.env.PORT || 5000));
     router.listen(router.get('port'), function() {
          console.log('Node app is running on port', router.get('port'));
     });

}());