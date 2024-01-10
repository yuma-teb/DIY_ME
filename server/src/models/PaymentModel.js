const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    required: [true, 'Please choose a payment method'],
  },
  productSummary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  subTotal: {
    type: Number,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    default: 0.0,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date.now(),
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
