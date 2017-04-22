const express = require('express')
const bodyParser = require('body-parser')

module.exports = (app, config) => {

  // enable view engine - handlebars
  app.set('view engine', 'hbs')
  app.set('views', config.rootDir + '/server/views')
  
  // enable static files
  app.use(express.static(config.rootDir + '/public'))

  //enable body-parser
  app.use(bodyParser.urlencoded({ extended: true }))

}