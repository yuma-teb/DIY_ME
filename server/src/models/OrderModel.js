/* eslint-disable arrow-body-style */
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectID,
      required: true,
      ref: 'User',
    },
    fromShop: {
      type: mongoose.Schema.Types.ObjectID,
      required: true,
      ref: 'Shop',
    },
    paymentMethod: {
      type: String,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        qty: {
          type: Number,
          default: 1,
        },
      },
    ],
    status: {
      type: String,
      default: 'pending',
      enum: [
        'pending',
        'on the way',
        'shipped',
        'delivered',
        'canceled',
        'Not yet Refund',
        'refunded',
        'Not yet Return',
        'returned',
      ],
    },
    orderCompleted: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

orderSchema.index({ status: 'text' });

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    model: 'User',
    select: 'username phone address email',
  })
    .populate({
      path: 'fromShop',
      model: 'Shop',
      select: 'name phonenumber',
    })
    .populate({
      path: 'orderItems',
      populate: {
        path: 'product',
        model: 'Product',
        select: 'name images price productSummary ratingAverage',
      },
    });
  next();
});

// eslint-disable-next-line func-names
// orderSchema.virtual('totalAmount').get(function () {
//   const orderTotalAmount = this.orderItems.reduce((total, item) => {
//     return total + item.qty * item.product.price;
//   }, 0);
//   return orderTotalAmount;
// });

orderSchema.pre('save', function (next) {
  if (!this.isModified('status')) {
    return next();
  }

  const isValidStatus = this.schema.path('status').enumValues.includes(this.status);

  if (!isValidStatus) {
    const allowedStatusValues = this.schema.path('status').enumValues.join(', ');
    const errorMessage = `Invalid 'status' value. Allowed values are: ${allowedStatusValues}`;

    return next(new Error(errorMessage));
  }

  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
