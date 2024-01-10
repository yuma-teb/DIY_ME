const express = require('express');

const router = express.Router();
const multer = require('multer');
const VariationController = require('../controller/VariationController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router
  .route('/')
  .get(VariationController.getAllVariation)
  .post(VariationController.createVariation);
router
  .route('/:id')
  .get(VariationController.getVariation)
  .patch(VariationController.updateVariation)
  .delete(VariationController.deleteVariation);

module.exports = router;
