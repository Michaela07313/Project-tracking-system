const mongoose = require('mongoose')
let encryption = require('../helpFunctions/encryption')

let userSchema = mongoose.Schema({
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        type: {type: Boolean, default: false},
        roles: [String],
        salt: {type: String, required: true}
})


userSchema.method({
  authenticate: function (pass) {
    let inputHashedPassword = encryption.generateHashedPassword(this.salt, pass)
    if (inputHashedPassword === this.password) {
      return true
    } else {
      return false
    }
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User
//User.find({}).exec().then(user => console.log(user))