// models/User.js
const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
const WishList = mongoose.model('WishList', wishListSchema);
module.exports = WishList;
