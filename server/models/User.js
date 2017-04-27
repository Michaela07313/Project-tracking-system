const mongoose = require('mongoose')
let encryption = require('../helpFunctions/encryption')

let userSchema = mongoose.Schema({
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        type: {type: Boolean, default: false},
        createdProjects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],
        projects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],
        roles: [String],
        salt: {type: String, required: true},
        image: { type: String, requred: false }
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
//module.exports = User
//User.find({}).exec().then(user => console.log(user))

module.exports.seedAdminUser = () => {
  User
  .find({})
  .then(users => {
    if (users.length === 0) {
      let salt = encryption.generateSalt()
      let hashedPassword = encryption.generateHashedPassword(salt, '123')
      console.log(users)
      User
      .create({
        email: 'admin@gmail.com',
        password: hashedPassword,
        firstName: 'Michaela',
        lastName: 'Lukanova',
        roles: ['Admin'],
        salt: salt
      })
    }
  })
}