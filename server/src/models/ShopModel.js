const mongoose = require('mongoose');
const { getImage } = require('../utils/GetImageLink');

const shopSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Shop must have a name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Shop must have a description'],
      trim: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    imageCoverLink: {
      type: String,
    },
    email: {
      type: String,
    },
    phonenumber: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

shopSchema.index({ name: 'text', description: 'text' });
// Virtual Populate for products
shopSchema.virtual('products', {
  ref: 'Product',
  foreignField: 'shop',
  localField: '_id',
});
// remove all product when shop is deleted
shopSchema.pre('remove', async function (next) {
  await this.model('Product').deleteMany({ shop: this._id });
  next();
});
// populating products everytime findbyId query is made
// eslint-disable-next-line func-names
shopSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'products',
    model: 'Product',
  }).populate({
    path: 'user',
    model: 'User',
    select: 'username',
  });

  next();
});

// create a post middleware for the getting all image
shopSchema.post(/^find/, async (doc, next) => {
  // if a single document, then get only single image
  console.log('Not Done');
  if (!Array.isArray(doc)) {
    if (doc.imageCover) {
      console.log('Doc', doc);
      const imageLink = await getImage(doc.imageCover);
      // add the imageLink to the document
      doc.imageCoverLink = imageLink;
      // then return the doucumnet
    }
    return doc;
  }
  console.log('Done');
  await Promise.all(
    doc.map(async (c) => {
      if (c.imageCover) {
        console.log('Image Link', c.imageCover);
        const imageLink = await getImage(c.imageCover);
        console.log(imageLink);
        // set the link to the imageCoverLink filed
        c.imageCoverLink = imageLink;
        return c;
      }
    }),
  );
  next();
});
const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
