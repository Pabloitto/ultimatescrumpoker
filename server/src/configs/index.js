const defaults = require('./defaults')

const env = process.env.NODE_ENV

const config = require(`./${env}.js`)

module.exports = Object.assign({}, defaults, config)
