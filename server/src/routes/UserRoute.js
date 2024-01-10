const express = require('express');
const multer = require('multer');
const userController = require('../controller/UserController');
const { restrictTo } = require('../middleware/RestrictRoles');
const { tokenChecking } = require('../utils/JsonWebToken');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// get user
router.route('/signup').post(userController.signup);
router.route('/login').post(userController.login);
router.get('/verify/:verifiedToken', userController.verifiedSignUp);
router.route('/').get(tokenChecking, restrictTo('Admin', 'Shop'), userController.getAllUsers);
router.get('/shop', userController.getUserToCreateShop);

router
  .route('/:id')
  .get(userController.getUserbyId)
  .patch(userController.updateUserbyId)
  .delete(userController.deleteUserbyId);

router.patch('/:id/update', upload.single('image'), userController.updateUserSelf);
router.route('/:id/delete').delete(userController.deleteSelfbyId);
router.route('/search/:username').get(userController.getUserbyName);
module.exports = router;
