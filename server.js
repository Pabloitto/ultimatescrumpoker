var http = require('http'),
	path = require('path'),
	socketio = require('socket.io'),
	express = require('express'),
	router = express(),
	server = http.createServer(router),
	io = socketio.listen(server),
	rooms = {};


router.use(express.static(path.resolve(__dirname, 'client')));

io.on('connection', function (client) {
  
  client.on('start', function (roomId) {
  	
  	var room = rooms[roomId];
  	
  	if(!room){
	  	room = {
	  		roomId : roomId,
	  		users : {}
	  	};
	  	rooms[roomId]= room;
  	};
  	client.join(roomId);
  	client.emit('update', JSON.stringify(room));
  });

  client.on('joined', function (roomId , data) {
  	
 	var room = rooms[roomId];

	room.users[client.id] = {
		name : data.name,
		estimation : data.estimation,
		fliped : data.fliped
	};
		
	client.emit('update', JSON.stringify(room));
	client.broadcast.to(room.roomId).emit('update',JSON.stringify(room));
	
  });

  client.on('estimate',function(roomId , points){
	var room = rooms[roomId];

	room.users[client.id].estimation = points;
	room.users[client.id].fliped = false;
		
	client.emit('update', JSON.stringify(room));
	client.broadcast.to(room.roomId).emit('update',JSON.stringify(room));
  });

  client.on('flipCards',function(roomId){
	var room = rooms[roomId];
  	
  	for (var u in room.users) {
  		if(room.users[u]){
	 		room.users[u].fliped = true;
  		}
  	};
	
	client.emit('update', JSON.stringify(room));
	client.broadcast.to(room.roomId).emit('update',JSON.stringify(room));
  });

  client.on('cleanEstimations',function(roomId){
	var room = rooms[roomId];
  	
  	for (var u in room.users) {
  		if(room.users[u]){
	 		room.users[u].fliped = false;
	 		room.users[u].estimation = '';
	 	}
  	};
		
	client.emit('update', JSON.stringify(room));
	client.broadcast.to(room.roomId).emit('update',JSON.stringify(room));
  });

  client.on('disconnect', function(){
	var room = {};
  	for (var r in rooms) {
  		if(rooms[r].users){
	  		if(rooms[r].users[client.id]){
				rooms[r].users[client.id] = null;
				room = rooms[r];
	  		}
  		}
  	};

    client.emit('update', JSON.stringify(room));
  	client.broadcast.to(room.roomId).emit('update',JSON.stringify(room));
  });

});

server.listen(process.env.PORT || 8081, process.env.IP || "127.0.0.1", function(){
  var addr = server.address();
  console.log("Server is listening at", addr.address + ":" + addr.port);
});