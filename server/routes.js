const homeController = require('./controllers/home')
const userController = require('./controllers/user')

module.exports = (app) => {

  app.get('/', homeController.index)

  app.get('/users/register', userController.registerGet)
  app.post('/users/register', userController.registerPost)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('NOT FOUND')
    res.end()
  })
}