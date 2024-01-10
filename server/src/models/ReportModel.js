const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    replyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
    },
    username: {
      type: String,
      required: true,
    },
    objective: {
      type: String,
      required: [true, 'Report must have an objective'],
      trim: true,
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now(),
    // },
  },
  {
    timestamps: true,
  },
);

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
