let Project = require('mongoose').model('Project')

module.exports = {
  index: (req, res) => {
      Project
        .find({})
        .limit(8)
        .exec((err, projects) => {
            if (err) console.log(err)
            
            res.render('home/index', {
                projects: projects
            })
        })
    }
}