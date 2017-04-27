module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/users/login')
    }
  },
  isInRole: (role) => {
    return (req, res, next) => {
      if (req.user && req.user.roles.indexOf(role) > -1) {
        next()
      } else {
        res.redirect('/users/login')
      }
    }
  },
  isTeamLeader: (type) => {
      return (req, res, next) => {
          if (req.user && (req.user.type || req.user.roles.indexOf('Admin') > -1)) {
              next()
          } else {
              res.redirect('/users/login')
          }
      }
  },
  isAssignedOrCreator: (req, res, projectId) => {
      if (req.user && 
      (req.user.createdProjects.indexOf(projectId) > - 1 || 
      req.user.projects.indexOf(projectId) > - 1 || 
      req.user.roles.indexOf('Admin') > -1)) {
          return true
      } else {
          return false
      }
  },
  isCreatorOrAdmin: (req, res, projectId) => {
    if (req.user && (req.user.createdProjects.indexOf(projectId) > - 1 || req.user.roles.indexOf('Admin') > -1)) {
      return true
    } else {
      return false
    }
  }
}