const mongoose = require('mongoose')
mongoose.Promise = global.Promise

module.exports = (config) => {

    //connect to the database, based on the environment
    let connection = config.db
    mongoose.connect(connection)

    let dbConnection = mongoose.connection

    dbConnection.once('open', (err) => {
        if(err) {
            console.log(err)
        }
        console.log('Mongo DB is runing!')
    })

    dbConnection.on('error', (err) => {
        console.log(err)
    })

    
    require('../models/User').seedAdminUser()
    require('../models/Project')
}