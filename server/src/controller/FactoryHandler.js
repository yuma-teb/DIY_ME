const mongoose = require('mongoose');
const catchError = require('../middleware/CatchError');
const ErrorHandler = require('../utils/ErrorHandler');
const APIFeatures = require('../utils/ApiFeatures');

module.exports = {
  deleteOnebyId: (Model) =>
    catchError(async (req, res, next) => {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new ErrorHandler('Invalid Document ID.', 404));
      }
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        return next(new ErrorHandler('Document not found', 404));
      }
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }),
  createOneDoc: (Model) =>
    catchError(async (req, res, next) => {
      const doc = await Model.create(req.body);
      return res.status(201).json({
        status: 'success',
        data: doc,
      });
    }),
  updateOneById: (Model) =>
    catchError(async (req, res, next) => {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new ErrorHandler('Invalid document ID.', 404));
      }
      const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedDoc) {
        return next(new ErrorHandler('Failed to update document', 404));
      }
      res.status(200).json({
        status: 'success',
        data: {
          updatedDoc,
        },
      });
    }),
  getOnebyId: (Model, selectOpt, popOpt) =>
    catchError(async (req, res, next) => {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new ErrorHandler('Invalid document ID.', 404));
      }
      const doc = await Model.findById(req.params.id).select(selectOpt).populate(popOpt);
      // console.log(doc);
      if (!Model) {
        return next(new ErrorHandler('Document not found', 404));
      }
      res.status(200).json({
        status: 'success',
        data: {
          doc,
        },
      });
    }),
  getAll: (Model, selectOpt, popOpt) =>
    catchError(async (req, res, next) => {
      const features = new APIFeatures(Model.find(), req.query).filter().sort().paginate();
      const docs = await features.query.select(selectOpt);
      if (!docs) {
        return next(new ErrorHandler('Documents not found', 404));
      }
      res.status(200).json({
        status: 'success',
        results: docs.length,
        data: {
          docs,
        },
      });
    }),
  getByName: (Model, field) =>
    catchError(async (req, res, next) => {
      // const user = await User.find({ username: { $regex: new RegExp(req.params.username, 'i') } });
      // eslint-disable-next-line prefer-template
      const query = { [field]: { $regex: new RegExp('^' + req.params[field], 'i') } };
      console.log(query);
      const doc = await Model.find(query);
      if (doc.length === 0) {
        // eslint-disable-next-line no-console
        console.log('Document not found!');
        return next(new ErrorHandler('Document not found', 404));
      }

      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          doc,
        },
      });
    }),
  getByNameInclude: (Model, field) =>
    catchError(async (req, res, next) => {
      // Find include in name for example
      // eslint-disable-next-line prefer-template
      const query = { [field]: { $regex: new RegExp(req.params[field], 'i') } };
      console.log(query);
      const doc = await Model.find(query);
      if (doc.length === 0) {
        // eslint-disable-next-line no-console
        console.log('Document not found!');
        return next(new ErrorHandler('Document not found', 404));
      }

      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          doc,
        },
      });
    }),
  getProductByNameInclude: (Model, field) =>
    catchError(async (req, res, next) => {
      // Find include in name for example
      // eslint-disable-next-line prefer-template
      const query = { [field]: { $regex: new RegExp(req.params[field], 'i') } };
      console.log(query);
      const allSearchedProducts = await Model.find(query);
      const features = new APIFeatures(Model.find(query), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const doc = await features.query;
      if (doc.length === 0) {
        // eslint-disable-next-line no-console
        console.log('Document not found!');
        return next(new ErrorHandler('Document not found', 404));
      }

      res.status(200).json({
        status: 'success',
        results: doc.length,
        allSearchedProducts: allSearchedProducts.length,
        data: {
          doc,
        },
      });
    }),
};
