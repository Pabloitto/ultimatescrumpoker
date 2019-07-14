const EstimationRoomService = ({
  io,
  client,
  RoomModel
}) => {
  const cleanUp = (room) => {
    room.users = room.users.filter(user => {
      return !!io.sockets.sockets[user.clientId]
    })
    return room.save()
  }

  const init = async roomId => {
    let room = await RoomModel.findOne({ roomId })
    if (room) {
      await cleanUp(room)
    } else {
      room = await RoomModel.create({ roomId })
    }

    client.join(roomId)
    client.emit('update', JSON.stringify(room))
  }

  const join = async (roomId, clientJoined) => {
    const room = await RoomModel.findOne({ roomId })

    const user = room.users.find(user => user.name === clientJoined.name)

    if (!user) {
      room.users.push({
        name: clientJoined.name,
        estimation: clientJoined.estimation,
        flipped: clientJoined.flipped,
        clientId: client.id
      })
    } else {
      user.estimation = clientJoined.estimation
      user.flipped = clientJoined.flipped
      user.clientId = client.id
    }

    await room.save()

    const roomPayload = JSON.stringify(room)

    client.emit('update', roomPayload)
    client.broadcast.to(room.roomId).emit('update', roomPayload)
  }

  const estimate = async (roomId, points) => {
    const room = await RoomModel.findOne({ roomId })

    const user = room.users.find((user) => user.clientId === client.id)

    user.estimation = points
    user.flipped = false

    await room.save()

    const roomPayload = JSON.stringify(room)

    client.emit('update', roomPayload)
    client.broadcast.to(room.roomId).emit('update', roomPayload)
  }

  const flipCards = async roomId => {
    const room = await RoomModel.findOne({ roomId })

    room.users.forEach((user) => {
      user.flipped = true
    })

    await room.save()

    const roomPayload = JSON.stringify(room)

    client.emit('update', roomPayload)
    client.broadcast.to(room.roomId).emit('update', roomPayload)
  }

  const cleanEstimations = async roomId => {
    const room = await RoomModel.findOne({ roomId })

    room.users.forEach((user) => {
      user.flipped = false
      user.estimation = ''
    })

    await room.save()

    const roomPayload = JSON.stringify(room)

    client.emit('update', roomPayload)
    client.broadcast.to(room.roomId).emit('update', roomPayload, true)
  }

  const leaveRoom = async () => {
    const room = await RoomModel.findOne({
      'users.clientId': client.id
    })

    room.users = room.users.filter(user => user.clientId !== client.id)

    await room.save()

    const roomPayload = JSON.stringify(room)

    client.emit('update', roomPayload)
    client.broadcast.to(room.roomId).emit('update', roomPayload)
  }

  const setDeckInRoom = async (roomId, deck) => {
    client.emit('removeDeckSelection', deck)
    client.broadcast.to(roomId).emit('removeDeckSelection', deck)
  }

  const syncConnection = async (roomId, userName) => {
    const room = await RoomModel.findOne({ roomId })
    if (!room) return
    const user = room.users.find(user => user.name === userName)
    if (user && user.clientId !== client.id) {
      console.log(`Reconnecting client from ${user.clientId} to ${client.id}`)
      user.clientId = client.id
      client.join(roomId)
      await room.save()
    }
  }

  return {
    init,
    join,
    estimate,
    flipCards,
    cleanEstimations,
    leaveRoom,
    setDeckInRoom,
    syncConnection
  }
}

module.exports = {
  EstimationRoomService
}
