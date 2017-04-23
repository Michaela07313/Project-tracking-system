const homeController = require('./controllers/home')
const userController = require('./controllers/user')
const projectController = require('./controllers/project')

module.exports = (app) => {

  app.get('/', homeController.index)

  //registration
  app.get('/users/register', userController.registerGet)
  app.post('/users/register', userController.registerPost)

 //login / logout
  app.get('/users/login', userController.loginGet)
  app.post('/users/login', userController.loginPost)
  app.get('/users/logout', userController.logout)

  //user profile
  app.get('/users/profile', userController.userProfile)

  //projects
  app.get('/projects/create', projectController.createGet)
  app.post('/projects/create', projectController.createPost)


  app.all('*', (req, res) => {
    res.status(404)
    res.send('NOT FOUND')
    res.end()
  })
}