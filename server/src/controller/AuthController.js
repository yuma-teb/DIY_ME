const fs = require('fs');
const path = require('path');
const User = require('../models/UserModel');
const { sendEmail } = require('../utils/Mailing');
const catchError = require('../middleware/CatchError');
const ErrorHandler = require('../utils/ErrorHandler');
const replaceContent = require('../view/ReplaceScript');
const tokenFuc = require('../utils/JsonWebToken');

const htmlPath = path.join(__dirname, '../view/ResetPassword.html');
const htmlFiles = fs.readFileSync(htmlPath, 'utf-8');
// create mail objective for reset user password
const MessageObjective = (targetEmail, data) => ({
  from: process.env.SENDER_MAIL, // Sender's email address (your Gmail email)
  to: targetEmail,
  subject: 'Reset Password',
  html: replaceContent(htmlFiles, data),
});

module.exports = {
  resetPassword: catchError(async (req, res, next) => {
    // first check if the email that user want to reset the password exist or not
    const findUser = await User.findOne({ email: req.body.email });

    // if user with the email not found
    if (!findUser) {
      return next(new ErrorHandler('User with this email not exist', 404));
    }

    // update users
    await findUser.save({ validateBeforeSave: false });
    const verifiedlink = `${process.env.FRONT_END_URL}/resetPassword/updateForgetPassword/${findUser.resetPasswordToken}`;
    console.log('User from controller: ', findUser);
    const data = {
      VERIFYLINK: verifiedlink,
      NAME: findUser.username,
    };
    const emailMessage = await sendEmail(MessageObjective(findUser.email, data));

    if (!emailMessage) {
      return next(new ErrorHandler('Failed to send the reset link. Please try again later.', 500));
    }
    console.log('User Token', findUser.resetPasswordToken);
    return res.status(200).json({
      status: 'success',
      data: {
        user: findUser,
        message: `Successful send reset link to ${findUser.email}`,
      },
    });
  }),
  upadateResetPassword: catchError(async (req, res, next) => {
    const { token } = req.params;

    // find the user
    const findUser = await User.findOne({ resetPasswordToken: token });
    //  check if there is user exist with the password
    console.log(findUser);
    if (!findUser) {
      return next(new ErrorHandler('User is not found.', 404));
    }

    // check if token expire or not
    if (!findUser.checkResetPasswordTokenExpiration(findUser.resetPasswordExpires)) {
      return next(new ErrorHandler('Token is expired.', 403));
    }
    console.log(req.body);

    // starting update user
    findUser.password = req.body.password;
    findUser.confirmPassword = req.body.confirmPassword;
    findUser.resetPasswordToken = undefined;
    findUser.resetPasswordExpires = undefined;

    // save the user
    await findUser.save();

    //  send the respond to user
    tokenFuc.createSendToken(findUser, 200, res);
  }),
};
