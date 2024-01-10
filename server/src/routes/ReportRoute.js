const express = require('express');

const router = express.Router();

const ReportController = require('../controller/ReportController');

router.route('/').get(ReportController.getAllReports).post(ReportController.createReport);

router
  .route('/:reportId')
  .get(ReportController.getReportById)
  .delete(ReportController.deleteReportById);

module.exports = router;
