const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
// const APIFeatures = require('../utils/ApiFeatures');
// const ErrorHandler = require('../utils/ErrorHandler');
const CatchError = require("../middleware/CatchError");
const factoryHandler = require("./FactoryHandler");
const Cart = require("../models/Cart");
const ErrorHandler = require("../utils/ErrorHandler");

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
      const {
        user,
        fromShop,
        paymentMethod,
        selectedItem,
        orderCompleted,
        deliveredAt,
        isPaid,
        paidAt,
      } = req.body;
      const cart = await Cart.findOne({ user });
      // console.log(cart)

      const order = new Order({
        user,
        fromShop,
        paymentMethod,
        orderItems: selectedItem,
        isPaid,
        paidAt,
        orderCompleted,
        deliveredAt,
      });

      await order.save();

      // Remove items from the cart
      for (const item of selectedItem) {
        console.log(item);
        const itemIndex = cart.cartItems.findIndex(
          (cartItem) =>
            cartItem.product.toString() === item.product.toString() &&
            cartItem.variationIndex === item.variationIndex
        );
        console.log("Item Index:", itemIndex);
        console.log("Cart Item:", cart.cartItems[itemIndex]);

        if (itemIndex !== -1) {
          cart.cartItems.splice(itemIndex, 1);
        }
      }

      // Save the updated cart
      await cart.save();
      res.status(201).json({
        status: "success",
        data: order,
      });
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err,
      });
    }
  }),
  updateOrder: factoryHandler.updateOneById(Order),

  getUserOrder: CatchError(async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const order = await Order.find({ user: userId });
      console.log(order);

      if (!order || order.length === 0) {
        throw new ErrorHandler(404, "User doesn't have any order history");
      }
      res.status(200).json({
        status: "success",
        data: order,
      });
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err,
      });
    }
  }),
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
