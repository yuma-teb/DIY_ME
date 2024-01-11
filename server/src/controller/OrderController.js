const Order = require('../models/OrderModel');
// const Product = require('../models/ProductModel');
// const APIFeatures = require('../utils/ApiFeatures');
// const ErrorHandler = require('../utils/ErrorHandler');
const CatchError = require('../middleware/CatchError');
const factoryHandler = require('./FactoryHandler');
const Cart = require('../models/Cart')

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
  createOrder: CatchError(async (req, res, next) => {
    try {
      const { user, fromShop, paymentMethod, selectedItem, orderCompleted, deliveredAt } = req.body;
      const cart = await Cart.findOne({ user });
      // console.log(cart);
      if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        throw new ErrorHandler(404, 'Cart is empty');
      }

      const order = new Order({
        user,
        fromShop,
        paymentMethod,
        orderItems: selectedItem,
        orderCompleted,
        deliveredAt,
      });

      // // If order is successfully created
      // if (order) {
      //   // Prepare bulk write operations to update variation stock
      //   const bulkOptions = order.orderItems.map((item) => ({
      //     updateOne: {
      //       filter: {
      //         _id: item.variations,
      //       },
      //       update: { $inc: { sold: item.quantity, stock: -item.quantity } },
      //     },
      //   }));
      //   console.log(bulkOptions);

      //   // Execute the bulk write operation
      //   await Product.bulkWrite(bulkOptions);
      // }

      await order.save();
      res.status(201).json({
        status: 'success',
        data: order,
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  }),
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
