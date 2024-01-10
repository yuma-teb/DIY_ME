// const mongoose = require('mongoose');
// const Report = require('../models/ReportModel');
// const ErrorHandler = require('../utils/ErrorHandler');
// const catchError = require('../middleware/CatchError');

// module.exports = {
//   // Get all reports: GET /api/v1/reports
//   getAllReports: catchError(async (req, res, next) => {
//     const reports = await Report.find({});
//     if (!reports) {
//       return next(new ErrorHandler('Reports not found', 404));
//     }
//     res.status(200).json({
//       status: 'success',
//       data: {
//         reports,
//       },
//     });
//   }),

//   // Get single report by id: GET /api/v1/reports/:id
//   getReport: catchError(async (req, res, next) => {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return next(new ErrorHandler('Invalid request ID.', 404));
//     }
//     const report = await Report.findById(req.params.id);

//     if (!report) {
//       return next(new ErrorHandler('Report not found', 404));
//     }

//     res.status(200).json({
//       status: 'success',
//       data: {
//         report,
//       },
//     });
//   }),

//   // Create report: POST /api/v1/reports
//   createReport: catchError(async (req, res, next) => {
//     const newReport = await Report.create({
//       user: req.body.user,
//       post: req.body.post,
//       objective: req.body.objective,
//     });

//     res.status(201).json({
//       status: 'success',
//       data: {
//         report: newReport,
//       },
//     });
//   }),

//   // Delete report by id: DELETE /api/v1/reports/:id
//   deleteReport: catchError(async (req, res, next) => {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return next(new ErrorHandler('Invalid request ID.', 404));
//     }
//     const report = await Report.findByIdAndDelete(req.params.id);

//     if (!report) {
//       return next(new ErrorHandler('Report not found', 404));
//     }
//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
//   }),
// };

// Importing necessary modules and utilities
const Report = require('../.././src/models/ReportModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchError = require('../middleware/CatchError');

// Exporting a set of functions related to report handling
module.exports = {
  // Create report: POST /api/v1/reports
  // Handling the creation of a new report
  createReport: catchError(async (req, res) => {
    // Destructuring relevant information from the request body
    const { postId, commentId, replyId, user, objective, username } = req.body;
    // Creating a new report using the Report model
    const report = await Report.create({
      postId,
      commentId,
      replyId,
      user,
      objective,
      username,
    });
    // Sending a successful response with the created report
    res.status(201).json({
      status: 'success',
      data: {
        report,
      },
    });
  }),

  // Get all reports: GET /api/v1/reports
  // Handling the retrieval of all reports
  getAllReports: catchError(async (req, res, next) => {
    // Fetching all reports from the database
    const reports = await Report.find({});
    // Checking if reports are found
    if (!reports) {
      return next(new ErrorHandler('Reports not found', 404));
    }
    // Sending a successful response with the retrieved reports
    res.status(200).json({
      status: 'success',
      data: {
        reports,
      },
    });
  }),

  // Get single report by id: GET /api/v1/reports/:id
  // Handling the retrieval of a report by its ID
  getReportById: catchError(async (req, res, next) => {
    // Extracting the report ID from the request parameters
    const id = req.params?.reportId;
    if (id) {
      // Fetching the report from the database using its ID
      const report = await Report.findById(id);
      // Checking if the report is found
      if (report) {
        // Sending a successful response with the retrieved report
        res.status(200).json({
          status: 'success',
          data: {
            report,
          },
        });
      } else {
        // Handling the case where no report is found with the provided ID
        return next(new ErrorHandler('Report with this id not found', 404));
      }
    } else {
      // Handling the case where an invalid report ID is provided
      return next(new ErrorHandler('Invalid report id', 400));
    }
  }),

  // Delete report by id: DELETE /api/v1/reports/:id
  // Handling the deletion of a report by its ID
  deleteReportById: catchError(async (req, res, next) => {
    // Extracting the report ID from the request parameters
    const id = req.params?.reportId;
    if (id) {
      // Deleting the report from the database
      const deletedReport = await Report.findByIdAndDelete(id);
      // Checking if the report is found and deleted
      if (deletedReport) {
        // Sending a successful response with the deleted report
        res.status(204).json({
          status: 'success',
          data: null,
        });
      } else {
        // Handling the case where no report is found with the provided ID
        return next(new ErrorHandler('Report with this id not found', 404));
      }
    } else {
      // Handling the case where an invalid report ID is provided
      return next(new ErrorHandler('Invalid report id', 400));
    }
  }),
};
