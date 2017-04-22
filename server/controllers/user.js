let User = require('mongoose').model('User')

module.exports = {
  registerGet: (req, res) => {
      res.render('users/register'); 
  },
  registerPost: (req, res) => {
    let userData = req.body

    if (userData.email && userData.firstName && userData.lastName && userData.password && userData.repeatedPassword) {
      if (userData.password !== userData.repeatedPassword) {
        userData.errorMessage = 'Your passwords do not match.'
        console.log(userData)
        res.render('users/register', userData)
      } 
        
        //userData.salt = encryption.generateSalt()
        //userData.password = encryption.generateHashedPassword(user.salt, user.password)
      } else {
      userData.errorMessage = 'Please enter all fields.'
      res.render('users/register', userData)
    }
  }
}