/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
/* eslint-disable arrow-body-style */
const mongoose = require('mongoose');
const Product = require('./ProductModel');

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
    shippingAddress: {
      address: {
        type: String,
        require: [true, 'Delivery address must provide'],
      },
      city: {
        type: String,
        require: [true, 'City must provide'],
      },
    },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
        variations: {
          name: String,
          attribute: String,
          price: Number,
          stock: Number,
          _id: mongoose.Schema.Types.ObjectId,
        },
        variationIndex: { type: Number },
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
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
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
      select: 'name',
    })
    .populate({
      path: 'orderItems',
      model: 'Cart',
      select: '-user',
    });
  next();
});
orderSchema.virtual('totalAmount').get(function () {
  // // Check if orderItems is defined
  // if (!this.orderItems || !Array.isArray(this.orderItems)) {
  //   return 0; // or handle the case when orderItems or cartItems is not defined
  // }

  const orderTotal = this.orderItems.reduce((total, item) => {
    // Check if item is defined and has the expected properties
    if (item && item.quantity && item.variations && item.variations.price) {
      return total + item.quantity * item.variations.price;
    }
    return total;
  }, 0);

  return orderTotal.toFixed(2);
});
orderSchema.pre('save', async function (next) {
  try {
    // Iterate through orderItems and update product stock
    for (const orderItem of this.orderItems) {
      const product = await Product.findById(orderItem.product);

      if (!product) {
        throw new Error('Product not found');
      }

      // Check if there is enough stock for the order
      if (orderItem.quantity > product.variations.stock) {
        throw new Error('Insufficient stock for the product');
      }

      // Update product stock
      product.variations.stock -= orderItem.quantity;
      await product.save();
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
