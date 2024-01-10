// models/VariationModel.js
const mongoose = require('mongoose');

const variationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Please input the image cover `],
  },
  imageCover: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  attribute: {
    type: String,
    required: [true, `Please input the attribute`],
  },
  stock: {
    type: Number,
  },
  price: {
    type: Number,
    required: [true, `Please input the price of`],
  },
});

const Variation = mongoose.model('Variation', variationSchema);
module.exports = Variation;
