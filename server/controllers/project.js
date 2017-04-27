let Project = require('mongoose').model('Project')
let User = require('mongoose').model('User')
const passport = require('passport');
const LocalPassport = require('passport-local')
const auth = require('../helpFunctions/authentication')

module.exports = {
    createGet: (req, res) => {
        User
        .find({})
        .exec((err, users) => {
            if (err) console.log(err)
            
            res.render('projects/create', {users: users})
        })
    },
    createPost: (req, res) => {
    let projctData = req.body
    let projectId = ''

    //check if the JN already exists
    Project.findOne({jobNumber: projctData.jobNumber})
    .then(existingJN => {
      if(existingJN) {
          User
          .find({})
          .exec((err, users) => {
              if (err) console.log(err)
              
              res.render('projects/create', {users: users, errorMessage: 'A project with this job number already exists.'})
            })
      } else {
          User.findOne({email: projctData.selectWorker})
          .then(existingUser => {

            let projectObject = {
                title: projctData.title,
                jobNumber: projctData.jobNumber,
                creator: req.user.id,
                worker: existingUser._id
            }

              let checkUser = 0
              
              //check if the new project is assigned to the current logged user
              if(projctData.selectWorker === req.user.email) {
                checkUser += 1
              }
              
              //create the new project
              Project.create(projectObject)
              .then(project => {
                  //update the Users table with the id of the created project
                  req.user.createdProjects.push(project._id)
                  req.user.save(err => {
                    if (err) {
                        res.redirect('/', {errorMessage: 'Something went wrong. Please try to create the poject again.'})
                    }
                  })

                  if (checkUser > 0) {
                    User.findByIdAndUpdate({ _id: req.user.id },
                    {
                        $push: { 'projects': project._id},
                        new: true
                    })
                    .exec()
                    .then(
                        res.redirect('/')
                    )

                  } else {
                      User.findOneAndUpdate({email: projctData.selectWorker},
                      {
                          $push: { 'projects': project._id},
                          new: true
                      })
                    .exec()
                    .then(
                        res.redirect('/')
                    )
                  }
              })
           })
        }
    })
  },
  ownProjectsGet: (req, res) => {
      let loggedUser = req.user.id
      
      Project
        .find({ $or: [ { creator: loggedUser }, { worker: loggedUser } ] })
        .exec((err, projects) => {
          if (err) console.log(err)

          res.render('projects/ownProjects', {
              projects: projects
          })
      })
  },
  details: (req, res) => {
    let projectId = req.params.id
    let populateQuery = [{path:'creator'}, {path:'worker'}]
    
    Project.findById(projectId)
    .populate(populateQuery)
    .then(project => {
        res.render('projects/details', {project: project})  
    })
  },
  edit: (req, res) => {
      let projectId = req.params.id
      let populateQuery = [{path:'creator'}, {path:'worker'}]
      
      if (!auth.isAssignedOrCreator(req, res, projectId)) {
          let returnUrl = `/projects/edit/${projectId}`
            req.session.returnUrl = returnUrl

            res.redirect('/users/login')
            return
      }
      
      Project.findById(projectId)
      .populate(populateQuery)
      .then(project => {
          User.findOne({email: project.worker.email})
          .exec((err, foundWorker) => {
              if (err) console.log(err)
              
              User.find({ email: { $nin: foundWorker.email} })
              .exec((err, users) => {
                  if (err) console.log(err)
                  
                  res.render('projects/edit', {
                      foundWorker: foundWorker,
                      users: users,
                      project: project 
                  })
              })
          })
      })
  },
  commentGet: (req, res) => {
    let projectId = req.params.id
    
    Project.findById(projectId)
    .populate('comments.email')
    .then(project => {
        User
        .find({})
        .exec((err, users) => {
            if (err) console.log(err)

            res.render('projects/comments', {
                users: users,
                project: project
            })
        })
    })
  },
  commentPost: (req, res) => {
      req.body.project = {id: req.params.id}
      let commentArgs = req.body
      let projectId = req.params.id
      let currentUserEmail = req.user.email

      if (!auth.isAssignedOrCreator(req, res, projectId)) {
          let returnUrl = `/projects/comments/${projectId}`
            req.session.returnUrl = returnUrl

            res.redirect('/users/login')
            return
      }

     /* User.findOne({email: currentUserEmail})
      .then(currentUser => {
          if(!currentUser || currentUser.email != commentArgs.email) {
              commentArgs.errorMessage = 'Incorrect email address.'
              res.render('projects/comments', commentArgs)
          } else {*/
            Project.findByIdAndUpdate(projectId, {
              $push: {'comments':
                        {   email: req.user.id,
                            content: commentArgs.content,
                            commentDate: new Date()
                        }
                    },
              new: true
            })
            .exec()
            .then(
                res.redirect('/projects/comments/' + projectId)
            )
  },
  update: (req, res) => {
    let updatedProject = req.body
    let projectID = req.params.id
    let populateQuery = [{path:'createdProjects'}, {path:'projects'}]

    Project.findById(projectID)
    .then(foundProject => {
        User.findOneAndUpdate({_id: foundProject.worker}, {
            $pull: {
                projects: projectID
            },
            new: true
        })
        .exec()
    })
    
    
    User.findOne({email: updatedProject.selectWorker})
    .populate(populateQuery)
    .then(existingUser => {

        //update the project
        Project.findByIdAndUpdate(projectID, {
            $set: {
                title: updatedProject.title,
                worker: existingUser._id,
                status: updatedProject.selectStatus,
                updatedDate: new Date()
            },
            new: true
        })
        .exec()
        .then(project => {
            //update the Users table with the id of the worker
            let index = existingUser.projects.indexOf(project._id)
            if (index < 0) {
                existingUser.projects.push(project._id)
                existingUser.save(err => {
                    if (err) {
                        res.redirect('/', {errorMessage: 'Something went wrong. Please try to create the poject again.'})
                    }
                })
            }
            console.log('Successfuly updated')
            res.redirect('/')
        })
    })
  },
  deleteGet: (req, res) => {
      let projectId = req.params.id
      let populateQuery = [{path:'creator'}, {path:'worker'}]

      if (!auth.isCreatorOrAdmin(req, res, projectId)) {
          let returnUrl = `/projects/delete/${projectId}`
            req.session.returnUrl = returnUrl

            res.redirect('/users/login')
            return
      }
      
      Project.findById(projectId)
      .populate(populateQuery)
      .then(project => {
          res.render('projects/delete', { project: project })
    })
  },
  deletePost: (req, res) => {
      let projectId = req.params.id
      let populateQuery = [{path:'creator'}, {path:'worker'}]

      Project.findOneAndRemove({_id: projectId})
        .populate(populateQuery)
        .then(projectToDelete => {
            User.findOneAndUpdate({_id: projectToDelete.worker}, {
            $pull: {
                projects: projectId
            },
            new: true
        })
        .exec()
        
        User.findOneAndUpdate({_id: projectToDelete.creator}, {
            $pull: {
                createdProjects: projectId
            },
            new: true
        })
        .exec()

        res.redirect('/')
    }) 
  }
}