let Project = require('mongoose').model('Project')

module.exports = {
    createGet: (req, res) => {
      res.render('projects/create')
  }
}