const express = require('express');
const RefundReturnController = require('../controller/RefundReturnController');

const router = express.Router();
router
  .route('/')
  .get(RefundReturnController.getAllRequests)
  .post(RefundReturnController.createRefundReturnReq);
router
  .route('/:id')
  .get(RefundReturnController.getReqbyId)
  .patch(RefundReturnController.updateReq)
  .delete(RefundReturnController.deleteReq);

module.exports = router;
