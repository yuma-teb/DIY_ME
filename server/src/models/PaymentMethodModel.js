const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();
const lastTwoDigitsOfYear = currentYear % 100;

const paymentMethodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  cardNumber: {
    type: Number,
    required: [true, 'Please enter a 16-digit valid card number'],
  },
  expirationDate: {
    required: [true, 'Please enter a valid expiration date'],
    month: {
      type: Number,
      default: 12,
    },
    year: {
      type: Number,
      default: `${lastTwoDigitsOfYear}`,
      min: [`${lastTwoDigitsOfYear}`, 'Invalid year'],
    },
  },
  cvv: {
    type: Number,
    required: [true, 'Please enter a 3-digit valid CVV/CVC number'],
  },
  cardHolder: {
    type: String,
    required: [true, 'Please enter name on card'],
  },
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;
