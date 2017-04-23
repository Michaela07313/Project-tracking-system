let User = require('mongoose').model('User')
let encryption = require('../helpFunctions/encryption')

module.exports = {
  registerGet: (req, res) => {
      res.render('users/register')
  },
  registerPost: (req, res) => {
    let userData = req.body

    //check if the user already exists
    User.findOne({email: userData.email})
    .then(existingUser => {
      if(existingUser) {
        userData.errorMessage = 'This email address is already registered.'
        res.render('users/register', userData)
      } else if (userData.password !== userData.repeatedPassword) {
        userData.errorMessage = 'Your passwords do not match.'
        res.render('users/register', userData)
      } else {
        userData.salt = encryption.generateSalt()
        userData.password = encryption.generateHashedPassword(userData.salt, userData.password)

        if(userData.selectType === 'tl') {
          userData.type = true
        }
        
        User
          .create(userData)
          .then(user => {
            req.logIn(user, (err) => {
              if (err) {
                user.errorMessage = 'Something went wrong. Try to register again.'
                res.render('users/register', user)
                return
              }
              
              res.redirect('/')
            })
          })
        }
    })
  },
  login: (req, res) => {
    res.render('users/login')
  }
}