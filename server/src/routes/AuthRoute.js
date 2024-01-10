const express = require('express');
const passport = require('passport');
const { verifyRefreshToken } = require('../middleware/RefreshToken');
const authController = require('../controller/AuthController');
const thirdParty = require('../utils/LoginThridParty');
const { restrictTo } = require('../middleware/RestrictRoles');
require('../utils/GoogleOauth');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile', 'openid'],
  }),
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/v1/auth/failed',
    successRedirect: `${process.env.FRONT_END_URL}`,
  }),
);
router.get('/failed', (req, res) => res.send('Failed'));
router.get('/success', (req, res) => {
  console.log('@@@ Res @@@', req.user);
  return res.status(200).json({
    status: 'success',
    data: req.user,
  });
});
router.get('/refreshToken', verifyRefreshToken);
// router.post('/refreshToken', (req, res) => res.send(' LOve'));
router.post('/resetPassword', authController.resetPassword);
router.patch('/updateResetPassword/:token', authController.upadateResetPassword);

module.exports = router;
