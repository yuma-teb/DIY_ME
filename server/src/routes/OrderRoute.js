const express = require('express');
const OrderController = require('../controller/OrderController');
const RefundController = require('../controller/RefundReturnController');
const { restrictTo } = require('../middleware/RestrictRoles');
const { tokenChecking } = require('../utils/JsonWebToken');

const router = express.Router();

router
  .route('/')
  .get(tokenChecking, restrictTo('Admin', 'Shop'), OrderController.getAllOrder)
  .post(OrderController.createOrder);
router
  .route('/:id')
  .get(OrderController.getOrder)
  .post(RefundController.createRefundReturnReq)
  .patch(OrderController.updateOrder)
  .delete(OrderController.deleteOrder);

module.exports = router;
