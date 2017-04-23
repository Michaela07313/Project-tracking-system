const homeController = require('./controllers/home')
const userController = require('./controllers/user')

module.exports = (app) => {

  app.get('/', homeController.index)

  //registration
  app.get('/users/register', userController.registerGet)
  app.post('/users/register', userController.registerPost)

 //login / logout
  app.get('/users/login', userController.loginGet)
  app.post('/users/login', userController.loginPost)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('NOT FOUND')
    res.end()
  })
}