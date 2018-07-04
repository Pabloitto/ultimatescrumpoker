const EstimationRoomService = ({
  client,
  rooms = {}
}) => {
  const init = roomId => {
    let room = rooms[roomId]
    if (!room) {
      room = {
        roomId: roomId,
        users: {}
      }
      rooms[roomId] = room
    }
    client.join(roomId)
    client.emit('update', JSON.stringify(room))
  }

  const join = (roomId, clientJoined) => {
    const room = rooms[roomId]
    room.users[client.id] = {
      name: clientJoined.name,
      estimation: clientJoined.estimation,
      flipped: clientJoined.flipped
    }
    client.emit('update', JSON.stringify(room))
    client.broadcast.to(room.roomId).emit('update', JSON.stringify(room))
  }

  const estimate = (roomId, points) => {
    const room = rooms[roomId]
    room.users[client.id].estimation = points
    room.users[client.id].flipped = false
    client.emit('update', JSON.stringify(room))
    client.broadcast.to(room.roomId).emit('update', JSON.stringify(room))
  }

  const flipCards = roomId => {
    const room = rooms[roomId]
    for (const u in room.users) {
      if (room.users[u]) {
        room.users[u].flipped = true
      }
    }
    client.emit('update', JSON.stringify(room))
    client.broadcast.to(room.roomId).emit('update', JSON.stringify(room))
  }

  const cleanEstimations = roomId => {
    const room = rooms[roomId]
    for (const u in room.users) {
      if (room.users[u]) {
        room.users[u].flipped = false
        room.users[u].estimation = ''
      }
    }
    client.emit('update', JSON.stringify(room))
    client.broadcast.to(room.roomId).emit('update', JSON.stringify(room), true)
  }

  const leaveRoom = () => {
    let room = {}
    for (var r in rooms) {
      if (rooms[r].users && rooms[r].users[client.id]) {
        rooms[r].users[client.id] = null
        room = rooms[r]
      }
    }
    client.emit('update', JSON.stringify(room))
    client.broadcast.to(room.roomId).emit('update', JSON.stringify(room))
  }

  const setDeckInRoom = (roomId, deck) => {
    const room = rooms[roomId]
    room.deck = deck
    room.deckAleadySelected = true
    client.emit('removeDeckSelection', room.deck)
    client.broadcast.to(room.roomId).emit('removeDeckSelection', room.deck)
  }

  return {
    init,
    join,
    estimate,
    flipCards,
    cleanEstimations,
    leaveRoom,
    setDeckInRoom
  }
}

module.exports = {
  EstimationRoomService
}
