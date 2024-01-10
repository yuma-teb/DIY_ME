// Importing the Comment model and error handling utilities
const Comment = require('../.././src/models/CommentModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchError = require('../middleware/CatchError');

// Exporting a set of functions related to comment handling
module.exports = {
  /// /// ------ Create Comment ------ //////
  // Handling the creation of a new comment
  createComment: catchError(async (req, res, next) => {
    // Extracting the post ID from the request parameters
    let id = req.params?.postId;
    if (id) {
      // Creating a new comment using the Comment model
      const comments = await Comment.create({
        user: req.body?.user,
        postId: id,
        username: req.body?.username,
        comment: req.body?.comment,
      });
      // Sending a successful response with the created comment
      res.status(201).json({
        status: 'success',
        data: {
          comments,
        },
      });
    } else {
      // Handling the case where no post ID is provided
      return next(new ErrorHandler('No post found', 404));
    }
  }),

  /// /// ------ Get Comments ------ //////
  // Handling the retrieval of comments for a specific post
  getComments: catchError(async (req, res, next) => {
    // Extracting the post ID from the request parameters
    const id = req.params.postId;
    if (id) {
      // Fetching comments for the specified post and sorting them by creation date
      let comments = await Comment.find({ postId: id }).sort({
        createdAt: 'desc',
      });

      // Extracting and reversing replies for each comment
      let replies = comments?.map((comment) => {
        return comment?.replies?.length >= 0 ? comment?.replies?.reverse() : [];
      });

      // Combining comments and replies, then sending a successful response
      let newcomments = [...comments, replies].slice(0, replies?.length);
      res.status(200).json({
        status: 'success',
        data: {
          newcomments,
        },
      });
    } else {
      // Handling the case where no post ID is provided
      return next(new ErrorHandler('There is no Post there to get all comments', 404));
    }
  }),

  /// /// ------ Add Reply ------ //////
  // Handling the addition of a reply to a comment
  addReply: catchError(async (req, res, next) => {
    // Extracting the comment ID from the request parameters
    let id = req.params?.commentId;
    if (id) {
      // Creating a reply object with the provided details
      const reply = {
        commentId: id,
        username: req.body?.username,
        reply: req.body?.reply,
        user: req.body?.user,
      };

      // Updating the comment by pushing the new reply
      let comment = await Comment.findByIdAndUpdate(
        { _id: id },
        { $push: { replies: reply } },
        { new: true },
      );
      // Sending a successful response with the updated comment
      res.status(201).json({
        status: 'success',
        data: {
          comment,
        },
      });
    } else {
      // Handling the case where no comment ID is provided
      return next(new ErrorHandler('Comment with this id not found', 404));
    }
  }),

  /// /// ------ Delete Reply ------ //////
  // Handling the deletion of a reply from a comment
  deleteReply: catchError(async (req, res, next) => {
    // Extracting the comment ID and reply ID from the request parameters
    let id = req.params?.commentId;
    let replyId = req.params?.replyId;
    if (id && replyId) {
      // Updating the comment by pulling the specified reply
      let comment = await Comment.findByIdAndUpdate(
        { _id: id },
        { $pull: { replies: { _id: replyId } } },
        { new: true },
      );
      // Sending a successful response with the updated comment
      res.status(204).json({
        status: 'success',
        data: {
          comment,
        },
      });
    } else {
      // Handling the case where either comment ID or reply ID is missing
      return next(new ErrorHandler('Post with this id not found', 404));
    }
  }),

  /// /// ------ Upadate Reply ------ //////
  updateReply: catchError(async (req, res, next) => {
    let id = req.params?.commentId;
    let replyId = req.params?.replyId;
    console.log(req.body);
    if (id && replyId) {
      const comment = await Comment.findByIdAndUpdate(
        { _id: id, 'replies._id': replyId },
        // { $pull: { replies: { _id: replyId } } },
        { new: true },
      );
      res.status(200).json({
        status: 'success',
        data: {
          comment,
        },
      });
    } else {
      return next(new ErrorHandler('Comment with this id not found', 404));
    }
  }),


  /// /// ------ Delete Comment By Id ------ //////
  deleteComment: catchError(async (req, res, next) => {
    const id = req.params?.commentId;
    if (id) {
      const comment = await Comment.findByIdAndDelete(id);
      await Comment.deleteOne({ commentId: id });

      res.status(204).json({
        status: 'success',
        data: {
          comment,
        },
      });
    } else {
      return next(new ErrorHandler('Invalid comment ID.', 400));
    }
  }),
  /// /// ------ Update Comment By Id ------ //////
  updateComment: catchError(async (req, res, next) => {
    const id = req.params?.commentId;
    if (!id) {
      return next(new ErrorHandler('Invalid comment ID.', 404));
    }
    const comment = await Comment.findByIdAndUpdate(
      {
        _id: id,

        ...req.body,
      },

      { new: true },
    );
    if (!comment) {
      return next(new ErrorHandler('No post found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        comment,
      },
    });
  }),
};
