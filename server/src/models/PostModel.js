const mongoose = require('mongoose');
const { getImage } = require('../utils/GetImageLink');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    imageLink: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

postSchema.index({ title: 'text', postContent: 'text' });

// post middle to get images
postSchema.post(/^find/, async (doc, next) => {
  if (!Array.isArray(doc)) {
    console.log('IN IF');
    const oneDocImages = await getImage(doc.image);
    doc.imageLink = oneDocImages;
    console.log(doc);
    return doc;
  }
  console.log('IN ELESE');
  await Promise.all(
    doc.map(async (c) => {
      const url = await getImage(c.image);
      c.imageLink = url;
      console.log('DATA', c);
      return c;
    }),
  );
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
