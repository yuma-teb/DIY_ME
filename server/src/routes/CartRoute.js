const express = require('express');
const CartController = require('../controller/CartController');

const router = express.Router();

router.route('/').post(CartController.addProductToCart);
router.route('/:userId').get(CartController.getCartByUser);
router
  .route('/:itemId')
  .patch(CartController.updateQuantityItem)
  .delete(CartController.removeItemFromCart);
// router.route('/removeItemFromCart').post(CartController.removeItemFromCart);
module.exports = router;
