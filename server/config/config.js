module.exports = {
    developement: {
        port: 7313,
        db: 'mongodb://localhost:27017/projectTrackingSystemDB'
    },
    production: {
        port: process.env.port,
        db: process.env.MONGO_DB_CONNECT
    }
}