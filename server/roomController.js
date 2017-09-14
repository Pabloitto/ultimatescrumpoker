(function () {
  RoomController.prototype.rooms = {}// Static variable

  function RoomController () {
    this.client = null
  }

  RoomController.prototype.connect = function (c) {
    this.client = c
  }

  RoomController.prototype.init = function (roomId) {
    var room = this.rooms[roomId]

    if (!room) {
      room = {
        roomId: roomId,
        users: {}
      }
      this.rooms[roomId] = room
    }

    this.client.join(roomId)
    this.client.emit('update', JSON.stringify(room))
  }

  RoomController.prototype.join = function (roomId, clientJoined) {
    var room = this.rooms[roomId]

    room.users[this.client.id] = {
      name: clientJoined.name,
      estimation: clientJoined.estimation,
      flipped: clientJoined.flipped
    }

    this.client.emit('update', JSON.stringify(room))
    this.client.broadcast.to(room.roomId).emit('update', JSON.stringify(room))
  }

  RoomController.prototype.estimate = function (roomId, points) {
    var room = this.rooms[roomId]

    room.users[this.client.id].estimation = points
    room.users[this.client.id].flipped = false

    this.client.emit('update', JSON.stringify(room))
    this.client.broadcast.to(room.roomId).emit('update', JSON.stringify(room))
  }

  RoomController.prototype.flipCards = function (roomId) {
    var room = this.rooms[roomId]

    for (var u in room.users) {
      if (room.users[u]) {
        room.users[u].flipped = true
      }
    }

    this.client.emit('update', JSON.stringify(room))
    this.client.broadcast.to(room.roomId).emit('update', JSON.stringify(room))
  }

  RoomController.prototype.cleanEstimations = function (roomId) {
    var room = this.rooms[roomId]

    for (var u in room.users) {
      if (room.users[u]) {
        room.users[u].flipped = false
        room.users[u].estimation = ''
      }
    }

    this.client.emit('update', JSON.stringify(room))
    this.client.broadcast.to(room.roomId).emit('update', JSON.stringify(room), true)
  }

  RoomController.prototype.leaveRoom = function () {
    var room = {}
    for (var r in this.rooms) {
      if (this.rooms[r].users) {
        if (this.rooms[r].users[this.client.id]) {
          this.rooms[r].users[this.client.id] = null
          room = this.rooms[r]
        }
      }
    }

    this.client.emit('update', JSON.stringify(room))
    this.client.broadcast.to(room.roomId).emit('update', JSON.stringify(room))
  }

  RoomController.prototype.setDeckInRoom = function (roomId, deck) {
    var room = this.rooms[roomId]
    room.deck = deck
    room.deckAleadySelected = true
    this.client.emit('removeDeckSelection', room.deck)
    this.client.broadcast.to(room.roomId).emit('removeDeckSelection', room.deck)
  }

  module.exports = RoomController
}())
