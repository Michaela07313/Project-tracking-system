const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

module.exports = (app, config) => {

  // enable view engine - handlebars
  app.set('view engine', 'hbs')
  app.set('views', config.rootDir + '/server/views')
  
  // enable static files
  app.use(express.static(config.rootDir + '/public'))

  //enable body-parser
  app.use(bodyParser.urlencoded({ extended: true }))

  //enable cookie-parser
  app.use(cookieParser())

  app.use(session({
    secret: 'neshto-taino!@#$%',
    resave: true,
    saveUninitialized: true
  }))

  app.use(passport.initialize())
  app.use(passport.session())
  app.use((req, res, next) => {
    if (req.user) {
      res.locals.currentUser = req.user
    }

    next()
  })
}