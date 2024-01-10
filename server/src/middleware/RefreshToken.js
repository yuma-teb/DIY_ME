const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const token = require('../utils/JsonWebToken');
require('dotenv').config();

// create a function which is used to refresh a token
const verifyRefreshToken = async (req, res) => {
  try {
    // check if there is any refreshToken in the cookies
    const { refreshToken } = req.cookies;
    console.log('My cookies', refreshToken);
    if (!refreshToken) {
      return res.status(401).json({
        message: 'Refresh Token not signed',
      });
    }
    // 2.  verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRETE);
    console.log('Token', decoded);
    if (!decoded) {
      return res.status(401).json({
        message: 'Invalid Refresh Token!',
      });
    }
    // 3.  check if the refresh token correnct if still user exist with the token
    const findUser = await User.findOne({ _id: decoded.data });
    console.log(findUser);
    if (!findUser) {
      return res.status(404).json({
        message: 'User with the token not found!',
      });
    }

    // generate new access token
    const newAccessToken = token.generateToken(findUser._id);
    console.log(newAccessToken);

    return res.status(201).json({
      token: newAccessToken,
      message: 'Newe access token generated!!',
    });
  } catch (error) {
    return res.status(500).send(error);
  }
  // return the newAccessToken
};

module.exports = { verifyRefreshToken };
