// const express  = require('express');
// const multer = require('multer');
// const PostController = require('../controller/PostController');

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const router = express.Router();

// router
//   .route('/')
//   .post(upload.array('image', 5), PostController.createPosts)
//   .get(PostController.getPosts);
// router
//   .route('/:id')
//   .get(PostController.getPost)
//   .patch(upload.array('image', 5), PostController.updatePost)
//   .delete(PostController.deletePost);

// module.exports = router;

const express = require('express');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const PostController = require('../controller/PostController');

const router = express.Router();

router
  .route('/')
  .post(upload.single('image'), PostController.createPost)
  .get(PostController.getPosts);

router
  .route('/:postId')
  .get(PostController.getPostById)
  .patch(PostController.updatePostById)
  .delete(PostController.deletePostById);

module.exports = router;
