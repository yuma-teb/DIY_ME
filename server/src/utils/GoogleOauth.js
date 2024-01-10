const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRETE,
      scope: ['email', 'profile', 'openid'],
      callbackURL: 'http://localhost:3000/api/v1/auth/google/callback',
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        const findUser = await User.findOne({ email: profile.email });
        // if user is login then we just add new user and return token
        profile.accessToken = accessToken;
        if (findUser) {
          console.log('@@@ LOGIN @@@');
          console.log(findUser);

          profile.isNewUser = false;
          profile.userID = findUser._id;

          return done(null, profile);
        }
        // create a new object for user
        const newUser = new User({
          username: profile._json.name,
          email: profile._json.given_name,
          firstName: profile._json.sub,
          lastName: profile._json.family_name,
          imgLink: profile._json.picture,
        });

        // save the new user
        await newUser.save({ validateBeforeSave: false });
        console.log('@@@ SING UP @@@');
        return done(null, profile);
      } catch (e) {
        console.log('@@@@@@@@', e);
      }
    },
  ),
);
