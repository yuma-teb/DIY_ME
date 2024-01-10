// const mongoose = require('mongoose');
const Variation = require('../models/VariationModel');
// const ErrorHandler = require('../utils/ErrorHandler');
// const catchError = require('../middleware/CatchError');
const factoryHandler = require('./FactoryHandler');

module.exports = {
  // create variation
  createVariation: factoryHandler.createOneDoc(Variation),
  // createVariation: catchError(async (req, res, next) => {
  //   const newVariation = await Variation.create(req.body);
  //   res.status(201).json({
  //     status: 'success',
  //     data: {
  //       variation: newVariation,
  //     },
  //   });
  // }),
  // get all variation
  getAllVariation: factoryHandler.getAll(Variation),
  // getAllVariation: catchError(async (req, res, next) => {
  //   const variations = await Variation.find();
  //   if (variations.length === 0) {
  //     return next(new ErrorHandler('Variations not found.', 404));
  //   }
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       variations,
  //     },
  //   });
  // }),
  getVariation: factoryHandler.getOnebyId(Variation),
  // getVariation: catchError(async (req, res, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //     return next(new ErrorHandler('Invalid variation ID.', 404));
  //   }
  //   const variation = await Variation.findById(req.params.id);
  //   if (!variation) {
  //     return next(new ErrorHandler('Variation not found', 404));
  //   }
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       variation,
  //     },
  //   });
  // }),
  // update product by id
  updateVariation: factoryHandler.updateOneById(Variation),
  // updateVariation: catchError(async (req, res, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //     return next(new ErrorHandler('Invalid variation ID.', 404));
  //   }
  //   const variation = await Variation.findByIdAndUpdate(req.params.id, req.body);
  //   if (!variation) {
  //     return next(new ErrorHandler('Variation not found', 404));
  //   }
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       variation,
  //     },
  //   });
  // }),
  // delete product by id
  deleteVariation: factoryHandler.deleteOnebyId(Variation),
  // deleteVariation: catchError(async (req, res, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //     return next(new ErrorHandler('Invalid variation ID.', 404));
  //   }

  //   const deleteVar = await Variation.findByIdAndDelete(req.params.id);
  //   if (!deleteVar) {
  //     return next(new ErrorHandler('Variation not found', 404));
  //   }
  //   res.status(204).json({
  //     status: 'success',
  //     data: null,
  //   });
  // }),
};
