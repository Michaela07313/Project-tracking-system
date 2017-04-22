const express = require('express')

let app = express()

//set the environment
let environment = process.env.NODE_ENV || 'developement'

// require the information from config.js, based on the current environment - developemnt or production
let config = require('./server/config/config')[environment]

//require all routes
require('./server/routes')(app)

app.listen(config.port)
console.log('Express app is running!')




