const mongoose = require('mongoose')

const DataBaseConnector = () => {
  const connect = (connectionString) => {
    return new Promise((resolve, reject) => {
      mongoose.connect(connectionString, (error) => {
        if (error) {
          reject(error)
          return
        }
        console.log('Connected to MongoDB')
        resolve()
      })
    })
  }

  const disconnect = () => {
    return new Promise((resolve, reject) => {
      mongoose.disconnect(error => {
        if (error) {
          reject(error)
          return
        }
        console.log('Disconnected to MongoDB')
        resolve()
      })
    })
  }

  return {
    connect,
    disconnect
  }
}

const getInstance = () => DataBaseConnector()

module.exports = {
  DataBaseConnector: getInstance(),
  getInstance
}
