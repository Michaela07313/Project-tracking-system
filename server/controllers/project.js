let Project = require('mongoose').model('Project')
let User = require('mongoose').model('User')
const passport = require('passport');
const LocalPassport = require('passport-local');

module.exports = {
    createGet: (req, res) => {
        User
        .find({})
        .exec((err, users) => {
            if (err) console.log(err)
            
            res.render('projects/create', {
                users: users
            })
        })
    },
    createPost: (req, res) => {
    let projctData = req.body
    let projectId = ''

    //check if the JN already exists
    Project.findOne({jobNumber: projctData.jobNumber})
    .then(existingJN => {
      if(existingJN) {
        projctData.errorMessage = 'A project with this job number already exists.'
        res.render('projects/create', projctData)
      } else {
          //search user by email
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
}