/* eslint-disable func-names */
const mongoose = require('mongoose');

const refundReturnSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Order',
  },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  totalAmount: {
    type: Number,
    default: 0.0,
  },
  image: {
    type: String,
  },
  reason: {
    type: String,
    required: [true, 'A refund/return must have a valid reason!'],
  },
  status: {
    type: String,
    enum: ['processing', 'approved', 'completed', 'rejected'],
    default: 'processing',
  },
  isRefund: {
    type: Boolean,
    default: false,
  },
  isReturn: {
    type: Boolean,
    default: false,
  },
});

refundReturnSchema.index({ status: 'text' });

refundReturnSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'order',
    model: 'Order',
    select: 'fromShop paymentMethod status createdAt',
  }).populate({
    path: 'product',
    model: 'Product',
    select: 'name price email description ratingAverage createdAt',
  });
  next();
});

const RefundReturn = mongoose.model('RefundReturn', refundReturnSchema);

module.exports = RefundReturn;
