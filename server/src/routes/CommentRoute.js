const express = require('express');
const CommentController = require('../controller/CommentController');

const router = express.Router();
router
  .route('/:postId/comments')
  .post(CommentController.createComment)
  .get(CommentController.getComments);

router.delete('/:commentId', CommentController.deleteComment);
router.patch('/:commentId', CommentController.updateComment);

router.post('/:commentId/reply', CommentController.addReply);

router.delete('/:commentId/replies/:replyId', CommentController.deleteReply);

router.patch('/:commentId/replies/:replyId', CommentController.updateReply);

module.exports = router;
