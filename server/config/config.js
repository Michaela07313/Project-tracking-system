const path = require('path');

module.exports = {
    developement: {
        port: 7313,
        db: 'mongodb://localhost:27017/projectTrackingSystemDB_2',
        rootDir: path.normalize(path.join(__dirname, '/../../'))
    },
    production: {
        port: process.env.port,
        db: process.env.MONGO_DB_CONNECT,
        rootDir: path.normalize(path.join(__dirname, '/../../'))
    }
}