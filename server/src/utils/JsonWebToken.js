// import json web token
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // convert callback to promise
const User = require('../models/UserModel');
const ErrorHandler = require('./ErrorHandler');
const catchError = require('../middleware/CatchError');

function tokenPasswordChecking(tokenIssued, passwordChangeAt) {
  if (passwordChangeAt) {
    return tokenIssued < new Date(passwordChangeAt).getTime() / 1000;
  }

  return false;
}
function generateRefreshToken(userID) {
  return jwt.sign({ data: userID }, process.env.REFRESH_TOKEN_SECRETE, {
    expiresIn: '90d',
    algorithm: process.env.ECRYPT_ALGORITHM,
  });
}
function generateToken(userID) {
  return jwt.sign({ data: userID }, process.env.ACCESS_TOKEN_SECRETE, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
    algorithm: process.env.ECRYPT_ALGORITHM,
  });
}

module.exports = {
  tokenChecking: catchError(async (req, res, next) => {
    // 1, check if token exist
    if (!req.headers.authorization) {
      return next(new ErrorHandler('There is not token in header', 404));
    }
    const token = req.headers.authorization.split(' ')[1];

    // 2. return error if we cannot find token
    if (!token) {
      return next(new ErrorHandler('Token is not exist!!', 401));
    }
    let decodedData;
    try {
      decodedData = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRETE);
      // Rest of your token verification logic
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new ErrorHandler('Token has expired', 403));
      }
      // Handle other errors if needed
      return next(new ErrorHandler('Token vercifiation failed', 401));
    }

    // get refersh User by id, becuase we used id to encode
    const refreshUser = await User.findById(decodedData.data);
    if (!refreshUser) {
      return next(new ErrorHandler('Token is not found', 404));
    }
    console.log('Checking Token');
    // check token expiration
    if (decodedData.iat > new Date().getTime()) {
      return next(new ErrorHandler('Token is expired!', 403));
    }

    // 4) Checking Token expiration because user may have change password, so new token must generate
    if (tokenPasswordChecking(decodedData.iat, refreshUser.passwordChangeAt)) {
      return next(
        new ErrorHandler('The account has changed password please login to continue', 403),
      );
    }

    // set user to the new refreshUser
    req.user = refreshUser;
    console.log(req.user);
    next();
  }),

  createSendToken: (user, statusCode, res) => {
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    console.log('Refres≈', refreshToken);

    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    console.log(cookieOptions);

    res.cookie('refreshToken', refreshToken, cookieOptions);

    // // Remove password from output
    // user.password = undefined;

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  },
  generateToken,
};
