const path = require('path')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const RoomController = require('./server/roomController')

app.use(express.static(path.resolve(__dirname, 'client')))

io.on('connection', function (client) {
  console.log('Connected')

  const roomController = new RoomController()

  roomController.connect(client)

  client.on('start', function (roomId) {
    roomController.init(roomId)
  })
  client.on('joined', function (roomId, clientJoined) {
    roomController.join(roomId, clientJoined)
  })
  client.on('estimate', function (roomId, points) {
    roomController.estimate(roomId, points)
  })
  client.on('flipCards', function (roomId) {
    roomController.flipCards(roomId)
  })
  client.on('cleanEstimations', function (roomId) {
    roomController.cleanEstimations(roomId)
  })
  client.on('disconnect', function () {
    roomController.leaveRoom()
  })
  client.on('setDeckInRoom', function (roomId, deck) {
    roomController.setDeckInRoom(roomId, deck)
  })
})

http.listen(process.env.PORT || 5000, () => {
  console.log('Scrum Poker is listening on 5000')
})
