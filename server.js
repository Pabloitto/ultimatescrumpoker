const path = require('path')

const express = require('express')

const app = express()

const http = require('http').Server(app)

const io = require('socket.io')(http)

const { MONGODB_URI, APP_PORT } = require('./server/src/configs')

const { DataBaseConnector } = require('./server/src/db')

const RoomModel = require('./server/src/db/models/rooms')

const { EstimationRoomService } = require('./server/src/services/estimation-room')

app.use(express.static(path.resolve(__dirname, 'client')))

io.on('connection', async client => {
  const estimationRoom = EstimationRoomService({
    io,
    client,
    RoomModel
  })
  client.on('start', estimationRoom.init)
  client.on('joined', estimationRoom.join)
  client.on('estimate', estimationRoom.estimate)
  client.on('flipCards', estimationRoom.flipCards)
  client.on('cleanEstimations', estimationRoom.cleanEstimations)
  client.on('setDeckInRoom', estimationRoom.setDeckInRoom)
  client.on('syncConnection', estimationRoom.syncConnection)
  client.on('disconnect', async () => {
    await estimationRoom.leaveRoom()
    console.info('Client disconnected', client.id)
  })
})

http.listen(APP_PORT, async () => {
  console.info(`Scrum Poker is listening on ${APP_PORT}`)
  await DataBaseConnector.connect(MONGODB_URI)
})
