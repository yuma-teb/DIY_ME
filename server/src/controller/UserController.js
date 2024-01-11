const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const User = require('../models/UserModel');
const token = require('../utils/JsonWebToken');
// const APIFeatures = require('../utils/ApiFeatures');
const { sendEmail } = require('../utils/Mailing');
const { uploadSingleImageToS3, randomImagesName } = require('../utils/SendFile');
const { getImage } = require('../utils/GetImageLink');
const replaceContent = require('../view/ReplaceScript');
const factoryHandler = require('./FactoryHandler');
const ErrorHandler = require('../utils/ErrorHandler');
const catchError = require('../middleware/CatchError');

const htmlPath = path.join(__dirname, '../view/VerificationTemplate.html');
const htmlFiles = fs.readFileSync(htmlPath, 'utf-8');
const MessageObjective = (targetEmail, data) => ({
  from: 'diymaterial3@gmail.com', // Sender's email address (your Gmail email)
  to: targetEmail,
  subject: 'SignUp Email Verification',
  html: replaceContent(htmlFiles, data),
});

module.exports = {
  signup: catchError(async (req, res, next) => {
    try {
      const emailVerifiedToken = crypto.randomBytes(20).toString('hex');
      const newUser = await User.create({
        username: `${req.body.firstName} ${req.body.lastName}$`,
        firstName: req.body.firstname,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        signUpVerifiedToken: emailVerifiedToken,
      });
      const verifiedlink = `${process.env.BACKEND_URL}/api/v1/users/verify/${newUser.signUpVerifiedToken}`;
      const data = {
        VERIFYLINK: verifiedlink,
        NAME: newUser.username,
      };
      await sendEmail(MessageObjective(newUser.email, data));

      // send the token
      token.createSendToken(newUser, 200, res);
    } catch (error) {
      // Check if the error is a duplicate key violation for username
      if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
        // Username already exists, handle accordingly
        return res.status(400).json({ status: 'error', message: 'Username already exists.' });
      }

      // Check if the error is a duplicate key violation for email
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        // Email already exists, handle accordingly
        return res.status(400).json({ status: 'error', message: 'Email already exists.' });
      }

      // Handle other errors
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
  }),
  getAllUsers: factoryHandler.getAll(User, '+isActive'),
  // getAllUsers: catchError(async (req, res, next) => {
  //   const features = new APIFeatures(User.find(), req.query)
  //     .filter()
  //     .sort()
  //     .limitFields()
  //     .paginate();
  //   const users = await features.query.select('+isActive');
  //   if (!users) {
  //     return next(new ErrorHandler('Users not found', 404));
  //   }
  //   return res.status(200).json({
  //     status: 'success',
  //     results: users.length,
  //     data: {
  //       users,
  //     },
  //   });
  // }),
  getUserbyId: factoryHandler.getOnebyId(User, '+password', 'orders'),
  // getUserbyId: catchError(async (req, res, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //     return next(new ErrorHandler('Invalid user ID.', 404));
  //   }
  //   const user = await User.findById(req.params.id).select('+password').populate('orders');
  //   // console.log(user);
  //   if (!user) {
  //     return next(new ErrorHandler('Users not found', 404));
  //   }
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       user,
  //     },
  //   });
  // }),
  login: catchError(async (req, res, next) => {
    // get email and password from the user login
    const { email, password } = req.body;

    const findUser = await User.findOne({ email }).select('+password');
    console.log(findUser.password);
    // if we cannot find user
    if (!findUser) {
      return next(new ErrorHandler('User with this email is not found', 404));
    }
    let imgUrl = '';
    if (findUser.avatar) {
      imgUrl = await getImage(findUser.avatar);
    }
    console.log(password, findUser.password); // check if password is not match
    const passwordChecking = await bcrypt.compare(password, findUser.password);
    console.log(passwordChecking);
    // const passwordChecking = await bcrypt.compare(password.trim(), findUser.password.trim());

    // console.log(passwordChecking);
    // if passwrod is not matched
    if (!passwordChecking) {
      return next(new ErrorHandler('Wrong Password!', 401));
    }
    // if success send the the toke to user
    token.createSendToken(findUser, 200, res);
  }),

  verifiedSignUp: catchError(async (req, res, next) => {
    // get the verificationToken from the parame
    const { verifiedToken } = req.params;

    console.log(verifiedToken);

    // check if token exist with the user
    const findUser = await User.findOne({ signUpVerifiedToken: verifiedToken }).select('+password');

    // if user not  found so invalid token
    if (!findUser) {
      return next(new ErrorHandler('Invalid Access Token.', 401));
    }

    console.log('Before saving:', findUser);
    const updateResult = await User.updateOne(
      { _id: findUser._id }, // Specify the document to update based on _id
      {
        $set: {
          verification: true,
          signUpVerifiedToken: null,
        },
      },
    );
    console.log('Before saving:', updateResult);
    // return message as html form
    return res.status(200).send(`
  <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          text-align: center;
          background-color: #f0f0f0;
          padding: 20px;
        }
        h2 {
          color: #4CAF50;
          border-bottom: 2px solid #4CAF50;
          padding-bottom: 10px;
        }
        p {
          margin: 20px 0;
          color: #333;
        }
        img {
          width: 90%;
          height: auto;
          max-width: 100%;
          margin-top: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      </style>
    </head>
    <body>
      <h2>Email Verification</h2>
      <p>Success! Your email has been verified.</p>
      <img src="https://scontent.fpnh19-1.fna.fbcdn.net/v/t39.30808-1/332755289_1600364610480218_4839988145237924946_n.jpg?stp=dst-jpg_p200x200&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeF8A7P0-OTX0sFZM21Y_dT42uKDnN8sLCLa4oOc3ywsIoGzIdXrVlo3TrbhNC4NybSrzHUns8YpZOl8hXLH4h1W&_nc_ohc=QmZvPNVjNKQAX8EXpzB&_nc_ht=scontent.fpnh19-1.fna&oh=00_AfAXMTzctxKOA5czPfvMvEcP0g6Hhgd-wIYWbqrjAFlp9g&oe=6558DE6B" alt="Your Image">
    </body>
  </html>
`);
  }),

  updateUserSelf: catchError(async (req, res, next) => {
    // if (req.body.password || req.body.confirmPassword) {
    //   // eslint-disable-next-line no-console
    //   console.log('This route cannot be used to update password!');
    //   return next();
    // }
    let imageName = '';

    if (req.file) {
      // generate filesName for the user images
      imageName = randomImagesName();
      await uploadSingleImageToS3(req, imageName);
    }

    console.log('sendAlready');
    console.log('Save Already');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorHandler('Invalid user ID.', 404));
    }
    // console.log(req.body);
    let updatedMe;

    if (req.file) {
      updatedMe = await User.findByIdAndUpdate(
        req.params.id,
        { avatar: imageName, ...req.body },
        {
          new: true,
          runValidators: true,
        },
      );
      // get the image link
      const imgUrl = await getImage(imageName);

      updatedMe.imgUrl = imgUrl;

      if (!updatedMe) {
        return next(new ErrorHandler('User not found', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          updatedMe,
          img: imgUrl,
        },
      });
    } else {
      updatedMe = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        {
          new: true,
          runValidators: true,
        },
      );
      console.log('updated:', updatedMe);
      if (!updatedMe) {
        return next(new ErrorHandler('User not found', 404));
      }
      res.status(200).json({
        status: 'success',
        data: updatedMe,
      });
    }
  }),
  deleteSelfbyId: catchError(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorHandler('Invalid user ID.', 404));
    }
    // need to verify user with password
    // if user entered password not the same as user password in DB => not valid
    const updatedMe = await User.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!updatedMe) {
      return next(new ErrorHandler('User not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        updatedMe,
      },
    });
  }),
  // updateUserbyId: catchError(async (req, res, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //     return next(new ErrorHandler('Invalid user ID.', 404));
  //   }
  //   const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
  //     new: true,
  //     runValidators: true,
  //   });
  //   if (!updatedUser) {
  //     return next(new ErrorHandler('Failed to update user', 404));
  //   }
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       updatedUser,
  //     },
  //   });
  // }),
  updateUserbyId: factoryHandler.updateOneById(User),
  deleteUserbyId: factoryHandler.deleteOnebyId(User),
  // deleteUserbyId: catchError(async (req, res, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //     return next(new ErrorHandler('Invalid user ID.', 404));
  //   }
  //   const user = await User.findByIdAndDelete(req.params.id);

  //   if (!user) {
  //     return next(new ErrorHandler('User not found', 404));
  //   }
  //   res.status(204).json({
  //     status: 'success',
  //     data: null,
  //   });
  // }),
  getUserbyName: factoryHandler.getByName(User, 'username'),
  // getUserbyName: catchError(async (req, res, next) => {
  //   const query = {
  //     // eslint-disable-next-line prefer-template
  //     username: { $regex: new RegExp('^' + req.params.username, 'i') },
  //   };
  //   console.log(query);
  //   const user = await User.find(query);
  //   // const user = await User.find({
  //   //   // eslint-disable-next-line prefer-template
  //   // username: { $regex: new RegExp('^' + req.params.username, 'i') },
  //   // });
  //   if (user.length === 0) {
  //     // eslint-disable-next-line no-console
  //     console.log('User not found!');
  //     return next(new ErrorHandler('User not found', 404));
  //   }

  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       user,
  //     },
  //   });
  // }),
  getUserToCreateShop: catchError(async (req, res, next) => {
    // find user
    const shopsOwner = await User.find({ role: 'Member' })
      .select('username') // Select only id and username fields
      .sort({ username: 'asc' }) // Sort by username in ascending order
      .exec();

    if (!shopsOwner) {
      return next(new ErrorHandler('No user found '), 404);
    }

    return res.status(200).json({
      status: 'success',
      data: {
        shopsOwner,
      },
    });
  }),
};
