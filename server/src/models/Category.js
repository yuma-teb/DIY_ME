const mongoose = require('mongoose');
const { getImage } = require('../utils/GetImageLink');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      default: '',
    },
    imageLink: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

categorySchema.virtual('products', {
  ref: 'Product',
  foreignField: 'category',
  localField: '_id',
});

// create a function which is used to get image link from s3
categorySchema.post(/^find/, async (doc, next) => {
  if (!Array.isArray(doc)) {
    const oneDocImage = await getImage(doc.image);
    doc.imageLink = oneDocImage;
    return doc;
  }
  await Promise.all(
    doc.map(async (c) => {
      if (c.image) {
        const imageUrl = await getImage(c.image);

        c.imageLink = imageUrl;
        return c;
      }
    }),
  );
  next();
});
categorySchema.index({ name: 'text', description: 'text' });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
