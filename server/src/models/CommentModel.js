const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      required: true,
    },
    replies: [
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
        commentId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        reply: {
          type: String,
          trim: true,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'replies',
    populate: {
      path: 'user',
      model: 'User',
    },
  });
  next();
});
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
