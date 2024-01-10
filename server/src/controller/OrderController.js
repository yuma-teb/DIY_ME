const Order = require('../models/OrderModel');
// const Product = require('../models/ProductModel');
// const APIFeatures = require('../utils/ApiFeatures');
// const ErrorHandler = require('../utils/ErrorHandler');
// const catchError = require('../middleware/CatchError');
const factoryHandler = require('./FactoryHandler');

module.exports = {
  // Get All order
  getAllOrder: factoryHandler.getAll(Order),
  // getAllOrder: catchError(async (req, res, next) => {
  //   const features = new APIFeatures(Order.find({}), req.query)
  //     .filter()
  //     .sort()
  //     .limitFields()
  //     .paginate();
  //   const order = await features.query;
  //   if (!order || order.length === 0) {
  //     return next(new ErrorHandler('Order not found', 404));
  //   }
  //   res.status(200).json({
  //     status: 'Success',
  //     result: order.length,
  //     data: order,
  //   });
  // }),
  getOrder: factoryHandler.getOnebyId(Order),
  // getOrder: catchError(async (req, res, next) => {
  //   const order = await Order.findById(req.params.id);
  //   if (!order) {
  //     return next(new ErrorHandler('Order not found', 404));
  //   }
  //   res.status(200).json({
  //     status: 'Success',
  //     data: order,
  //   });
  // }),

  // Posting the order
  createOrder: factoryHandler.createOneDoc(Order),
  // createOrder: catchError(async (req, res, next) => {
  //   const createOrder = await Order.create(req.body);
  //   res.status(201).json({
  //     status: 'Order has been created',
  //     newData: createOrder,
  //   });
  // }),
  updateOrder: factoryHandler.updateOneById(Order),
  // updateOrder: catchError(async (req, res, next) => {
  //   const updateOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
  //     new: true,
  //     runValidators: true,
  //   });
  //   if (!updateOrder) {
  //     return next(new ErrorHandler('Order not found', 404));
  //   }
  //   res.status(200).json({
  //     status: 'Success',
  //     updateData: updateOrder,
  //   });
  // }),
  deleteOrder: factoryHandler.deleteOnebyId(Order),
  // deleteOrder: catchError(async (req, res, next) => {
  //   await Order.findByIdAndDelete(req.params.id);
  //   if (!(await Order.findByIdAndDelete(req.params.id))) {
  //     return next(new ErrorHandler('Order not found', 404));
  //   }
  //   res.status(204).json({
  //     status: 'Data has been deleted',
  //     data: null,
  //   });
  // }),
};
