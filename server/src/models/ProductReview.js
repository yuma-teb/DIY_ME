// models/VariationModel.js
const mongoose = require('mongoose');
const Product = require('./ProductModel');

const productReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  title: {
    type: String,
    // require: [true, `Please input the title of product reviews`],
  },
  body: {
    type: String,
    // require: [true, `Please input the description of product reviews`],
  },
  images: [
    {
      type: String,
      default: '',
    },
  ],
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5'],
    // require: [true, 'Please rate the product from 1 - 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

productReviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingQuantity: 0,
      ratingAverage: 3.0,
    });
  }
};

productReviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.product);
});

// copy the product to get id for update and delete
productReviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  next();
});

// find the match product to delete and update
productReviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.product);
});

productReviewSchema.index({ rating: -1 });

const ProductReview = mongoose.model('ProductReview', productReviewSchema);
module.exports = ProductReview;
