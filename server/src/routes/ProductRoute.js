const express = require('express');
const multer = require('multer');
const { restrictTo } = require('../middleware/RestrictRoles');
const { tokenChecking } = require('../utils/JsonWebToken');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();
const ProductController = require('../controller/ProductController');

router
  .route('/')
  .get(ProductController.getAllProducts)
  .post(upload.array('image', 5), ProductController.createProduct);

router
  .route('/:id')
  .get(ProductController.getProduct)
  .patch(upload.array('image', 5), ProductController.updateProduct)
  .delete(ProductController.deleteProduct);
router.patch('/:id/request', ProductController.updateRequestingProduct);

router.route('/search/:name').get(ProductController.getProductByName);
module.exports = router;
