const path = require('path')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const rooms = {}

const { EstimationRoomService } = require('./server/src/services/estimation-room')

app.use(express.static(path.resolve(__dirname, 'client')))

io.on('connection', client => {
  console.info('Client connected', client.id)
  const estimationRoom = EstimationRoomService({
    client,
    rooms
  })
  client.on('start', estimationRoom.init)
  client.on('joined', estimationRoom.join)
  client.on('estimate', estimationRoom.estimate)
  client.on('flipCards', estimationRoom.flipCards)
  client.on('cleanEstimations', estimationRoom.cleanEstimations)
  client.on('setDeckInRoom', estimationRoom.setDeckInRoom)
  client.on('disconnect', () => {
    estimationRoom.leaveRoom()
    console.info('Client disconnected', client.id)
  })
})

http.listen(process.env.PORT || 5000, () => {
  console.info('Scrum Poker is listening on 5000')
})
