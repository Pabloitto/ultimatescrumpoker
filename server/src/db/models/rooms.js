const mongoose = require('mongoose')

const { Schema } = mongoose

const User = new Schema({
  name: { type: String, required: true },
  estimation: { type: String },
  flipped: { type: Boolean, default: false },
  clientId: { type: String }
}, {
  timestamps: true
})

const Room = new Schema({
  roomId: { type: String, required: true },
  deck: { type: String },
  users: [ User ]
}, {
  timestamps: true
})

module.exports = mongoose.model('Room', Room)
