const express = require('express');
const multer = require('multer');
const ProductReviewController = require('../controller/ProductReviewController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router
  .route('/')
  .post(upload.array('image', 5), ProductReviewController.createReview)
  .get(ProductReviewController.getAllReview);
router
  .route('/:id')
  .get(ProductReviewController.getReview)
  .patch(upload.array('image', 5), ProductReviewController.updateReview)
  .delete(ProductReviewController.deleteReview);

module.exports = router;
