const mongoose = require('mongoose')

let projectSchema = mongoose.Schema({
    title: {type: String, required: true},
    jobNumber: {type: Number, required: true, unique: true},
    status: {type: String, required: true, default: 'new'},
    date: {type: Date, default: Date.now()},
    updatedDate: {type: Date},
    creator: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    worker: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    comments: [{
        email: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
        content: {type: String, required: true},
        commentDate: {type: Date, default: Date.now()}
    }]
})


const Project = mongoose.model('Project', projectSchema)
module.exports = Project
//Project.find({}).exec().then(project => console.log(project))