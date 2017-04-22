const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        type: {type: String, required: true},
        roles: [String],
        salt: {type: String, required: true}
})

const User = mongoose.model('User', userSchema);
module.exports = User;