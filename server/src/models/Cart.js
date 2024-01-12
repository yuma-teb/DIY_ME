const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        variations: {
          name: String,
          attribute: String,
          price: Number,
          stock: Number,
        },
        variationIndex: { type: Number },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

// cartSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'user',
//     model: 'User',
//     select: 'username',
//   });
//   next();
// });

cartSchema.virtual('totalPrice').get(function () {
  const cartTotalAmount = this.cartItems.reduce(
    (total, item) => total + item.quantity * item.variations.price,
    0,
  );
  return cartTotalAmount.toFixed(2);
});

cartSchema.virtual('totalQuantity').get(function () {
  const cartTotalQty = this.cartItems.reduce((total, item) => total + item.quantity, 0);
  return cartTotalQty;
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
