const express = require('express');

const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const ShopController = require('../controller/ShopController');
const ProductController = require('../controller/ProductController');

router
  .route('/')
  .get(ShopController.getAllShops)
  .post(upload.single('image'), ShopController.createShop);

router
  .route('/:id')
  .get(ShopController.getShop)
  .delete(ShopController.deleteShop)
  .patch(upload.single('image'), ShopController.updateShop);
router
  .route('/:id/products')
  .get(ProductController.getShopProducts)
  .post(ProductController.createShopProduct);

module.exports = router;
