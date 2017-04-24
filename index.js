const express = require('express')
const hbs = require('hbs')

let app = express()


//set the environment
let environment = process.env.NODE_ENV || 'developement'

// require the information from config.js, based on the current environment - developemnt or production
let config = require('./server/config/config')[environment]

//require the database
require('./server/config/database')(config)

require('./server/config/express')(app,config)

//require all routes
require('./server/routes')(app)


// require passport to authenticate the user
require('./server/config/passport')()

//format the date of the projects
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));



app.listen(config.port)
console.log('Express app is running!')




