const restrictTo =
  (...roles) =>
  (req, res, next) => {
    console.log('Roles, ', ...roles);
    console.log('@@@ ROLE @@@', req.user.role, roles.includes(req.user.role));
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You has no permission to acess this route',
      });
    }
    // if user has roles has the permission
    next();
  };

module.exports = { restrictTo };
