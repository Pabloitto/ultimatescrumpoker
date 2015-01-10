(function() {
	var http = require('http'),
		path = require('path'),
		socket = require('socket.io'),
		express = require('express'),
		router = express(),
		server = http.createServer(router),
		io = socket.listen(server),
		roomController = require('roomController');


	router.use(express.static(path.resolve(__dirname, 'client')));

	io.on('connection', function (client) {
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
	});

	server.listen(process.env.PORT || 8081, process.env.IP || "127.0.0.1", function(){
	  var address = server.address();
	  console.log("Server is listening at", address.address + ":" + address.port);
	});

}());