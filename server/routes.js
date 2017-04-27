const homeController = require('./controllers/home')
const userController = require('./controllers/user')
const projectController = require('./controllers/project')
const auth = require('./helpFunctions/authentication')

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
  app.get('/projects/create', auth.isTeamLeader(true), projectController.createGet)
  app.post('/projects/create', projectController.createPost)

  app.get('/projects/ownProjects', projectController.ownProjectsGet)
  app.get('/projects/details/:id', auth.isAuthenticated, projectController.details)

  app.get('/projects/edit/:id', projectController.edit)
  app.post('/projects/edit/:id', projectController.update)

  app.get('/projects/comments/:id', auth.isAuthenticated, projectController.commentGet)
  app.post('/projects/comments/:id', projectController.commentPost)
  
  app.get('/projects/delete/:id', auth.isAuthenticated, projectController.deleteGet)
  app.post('/projects/delete/:id', projectController.deletePost)


  app.all('*', (req, res) => {
    res.status(404)
    res.send('NOT FOUND')
    res.end()
  })
}