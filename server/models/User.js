const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
        userName: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        roles: [String],
        salt: {type: String, required: true}
})

const User = mongoose.model('User', userSchema);
module.exports = User;