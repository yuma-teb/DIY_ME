// models/User.js
const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
// eslint-disable-next-line import/no-unresolved
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'user must have username'],
      unique: [true, 'Username must be unique'],
    },
    email: {
      type: String,
      required: [true, 'user must have an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide your email.'],
    },
    password: {
      type: String,
      required: [true, 'user must have a password'],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please make sure to confirm your password'],
      // validate: {
      //   // eslint-disable-next-line func-names, object-shorthand
      //   validator: function (el) {
      //     console.log(this.password, el);
      //     return el === this.password;
      //   },
      //   message: 'Passwords are not the same!',
      // },
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    avatar: {
      type: String,
    },
    phone: Number,
    role: {
      type: String,
      default: 'Member',
      enum: ['Admin', 'Member', 'Shop'],
    },
    updatedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      default: null,
    },
    address: {
      type: String,
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    signUpVerifiedToken: String,
    verification: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PaymentMethod',
      default: null,
    },
    imgLink: String,

    // order: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Order',
    //   },
    // ],
    // cart: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Cart',
    // },
    // wishList: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Wishlist',
    // },
    // post: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Post',
    //   },
    // ],
    // Define other user properties as needed
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual Populate for Orders
userSchema.virtual('orders', {
  ref: 'Order',
  foreignField: 'user',
  localField: '_id',
});

userSchema.index({ username: 'text' });

// eslint-disable-next-line func-names
userSchema.pre('save', async function (next) {
  // Only run this function only if function was modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// eslint-disable-next-line func-names
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  // console.log(update.password);
  // Only run this function only if function was modified
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 12);
    console.log('Updasted Passwod', update.password);
    update.confirmPassword = undefined;
  }
  next();
});

// create a function which is used to create reset password
userSchema.methods.creatResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // update the reset password token
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log('Token from model', this.resetPasswordToken);
  this.resetPasswordExpires = Date.now() + 10 * 1000 * 60;

  return resetToken;
};

// create a function which is used for changedPassword validation
userSchema.methods.checkResetPasswordTokenExpiration = function (token) {
  return token - new Date().getTime() / 1000 > 0;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
