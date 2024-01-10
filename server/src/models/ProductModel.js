const mongoose = require('mongoose');
const { getImage } = require('../utils/GetImageLink');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Product must have a name'],
    trim: true,
  },
  images: [
    {
      type: String,
      default: '',
    },
  ],
  imagesLink: [
    {
      type: String,
      default: '',
    },
  ],
  price: {
    type: Number,
    // required: [true, 'Product must have a price'],
  },
  stock: {
    type: Number,
    // required: [true, 'Product must have stock'],
  },
  sold: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  productSummary: {
    type: String,
    // required: [true, 'Product must have a summary'],
    trim: true,
  },
  description: {
    type: String,
    // required: [true, 'Product must have a description'],
    trim: true,
  },
  tutorial: {
    type: String,
    trim: true,
  },
  ratingAverage: {
    type: Number,
    default: 3.0,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
  },
  variations: [
    {
      name: {
        type: String,
        required: true,
      },
      attribute: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
      _id: {
        type: String,
        default: '',
      },
    },
  ],

  isActive: {
    type: Boolean,
    default: false,
  },
  update: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

productSchema.index({ name: 'text', description: 'text' });

productSchema.index({ price: 1, sold: -1, ratingAverage: -1 });

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name',
  });
  next();
});

// get all image link
productSchema.post(/^find/, async (doc, next) => {
  // check if findBYID or find all

  if (!Array.isArray(doc)) {
    console.log('IN IF');
    const oneDocImages = await Promise.all(
      doc.images.map(async (image) => {
        const singleImage = await getImage(image);
        return singleImage;
      }),
    );
    doc.imagesLink = oneDocImages;
    console.log(doc);
    return doc;
  }

  await Promise.all(
    doc.map(async (product) => {
      console.log('Product', product);
      let imageUrls = [];
      if (product.images) {
        imageUrls = await Promise.all(
          product.images.map(async (imageName) => {
            const url = await getImage(imageName);
            return url;
          }),
        );
      }
      console.log('Image urls', imageUrls);
      product.imagesLink = imageUrls;
      return product;
    }),
  );
  next();
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
