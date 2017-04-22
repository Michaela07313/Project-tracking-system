const express = require('express')

module.exports = (app, config) => {

  // enable view engine - handlebars
  app.set('view engine', 'hbs')
  app.set('views', config.rootDir + '/server/views')
  
  // enable static files
  app.use(express.static(config.rootDir + '/public'))

}