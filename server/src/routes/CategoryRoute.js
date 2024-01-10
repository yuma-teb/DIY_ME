const express = require('express');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();
const CategoryController = require('../controller/CategoryController');

router
  .route('/')
  .get(CategoryController.getAllCategory)
  .post(upload.single('image'), CategoryController.createCategory);

router
  .route('/:id')
  .get(CategoryController.getCategory)
  .patch(upload.single('image'), CategoryController.updateCategory)
  .delete(CategoryController.deleteCategory);

module.exports = router;
