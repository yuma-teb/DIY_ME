const mongoose = require('mongoose');
// const APIFeatures = require('../utils/ApiFeatures');
const RefundReturn = require('../models/RefundReturnModel');
const OrderProducts = require('../models/OrderModel');
// const Order = require('../models/OrderModel');
const CatchError = require('../middleware/CatchError');
const ErrorHandler = require('../utils/ErrorHandler');
const factoryHanlder = require('./FactoryHandler');

module.exports = {
  // Posting the refund/return request
  createRefundReturnReq: CatchError(async (req, res, next) => {
    const orderId = req.params.id;
    const returnProduct = req.body.product;

    const order = await OrderProducts.findOne({ _id: orderId });
    // return res.send(order)
    const { reason } = req.body;
    // ----------checking order status ---------//
    function isRefundStatus(status) {
      return status === 'pending';
    }
    function isReturnStatus(status) {
      return status === 'on the way' || status === 'shipped' || status === 'delivered';
    }
    // -----------changing and update order status -------//
    // if (isRefundStatus(order.status) || isReturnStatus(order.status)) {
    //   if (isRefundStatus(order.status)) {
    //     await Order.findOneAndUpdate(
    //       { _id: orderId },
    //       {
    //         status: 'Not yet Refund',
    //       },
    //     );
    //   } else {
    //     await Order.findOneAndUpdate(
    //       { _id: orderId },
    //       {
    //         status: 'Not yet Return',
    //       },
    //     );
    //   }
    // }
    // product.product._id.toString()
    // eslint-disable-next-line no-restricted-syntax
    for (const productId of returnProduct) {
      order.orderItems.forEach(async (product) => {
        if (productId === product.product._id.toString()) {
          const refundReturnInstance = new RefundReturn({
            product: productId,
            order: orderId,
            user: order.user,
            reason,
            isRefund: isRefundStatus(order.status),
            isReturn: isReturnStatus(order.status),
          });

          await refundReturnInstance.save(); // Save the instance to the database
        }
      });
    }
    // console.log('Wkkkkkk');

    // returnProduct.forEach((productId) => {
    //   // Find product
    //   order.orderItems.forEach(async (product) => {
    //     if (productId === product.product._id.toString()) {
    //       const refundReturnInstance = new RefundReturn({
    //         product: productId,
    //         order: orderId,
    //         user: order.user,
    //         reason,
    //         isRefund: isRefundStatus(order.status),
    //         isReturn: isReturnStatus(order.status),
    //       });
    //       await refundReturnInstance.save(); // Save the instance to the database
    //     }
    //   });
    // });

    return res.status(201).json({
      status: 'success',
      data: {
        orderId,
        returnProduct,
      },
    });
  }),
  getAllRequests: factoryHanlder.getAll(RefundReturn),
  // getAllRequests: CatchError(async (req, res, next) => {
  //   const features = new APIFeatures(RefundReturn.find(), req.query)
  //     .filter()
  //     .sort()
  //     .limitFields()
  //     .paginate();
  //   const refundReturns = await features.query;
  //   if (!refundReturns) {
  //     return next(new ErrorHandler('return and refund not found', 404));
  //   }

  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       results: refundReturns.length,
  //       newData: refundReturns,
  //     },
  //   });
  // }),
  getReqbyId: CatchError(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorHandler('Invalid request ID.', 404));
    }
    const request = await RefundReturn.findById(req.params.id);

    const populateOptions = [];
    // if (request.user) {
    //   populateOptions.push({
    //     path: 'user',
    //     model: 'User',
    //   });
    // }
    // console.log(request);
    if (request.order) {
      populateOptions.push({
        path: 'order',
        model: 'Order',
      });
    }
    if (request.product) {
      populateOptions.push({
        path: 'product',
        model: 'Product',
      });
    }
    const populatedRequest = await RefundReturn.findById(req.params.id).populate(populateOptions);
    if (!populatedRequest) {
      return next(new ErrorHandler('return and refund not found', 404));
    }
    res.status(200).json({
      status: 'Success',
      data: {
        data: populatedRequest,
      },
    });
  }),
  updateReq: factoryHanlder.updateOneById(RefundReturn),
  // updateReq: CatchError(async (req, res, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //     return next(new ErrorHandler('Invalid return and refund ID.', 404));
  //   }
  //   const updateReq = await RefundReturn.findByIdAndUpdate(req.params.id, req.body, {
  //     new: true,
  //     runValidators: true,
  //   });
  // if (updateReq.status === "complete") {
  //   await OrderProducts.findByIdAndUpdate({
  //     _id: updateReq.order,
  //   },
  //   {
  //     status: updateReq.isRefund?"refunded"
  //   })
  // }
  //   if (!updateReq) {
  //     return next(new ErrorHandler('return and refund not found', 404));
  //   }
  //   res.status(201).json({
  //     status: 'Success',
  //     data: {
  //       updateData: updateReq,
  //     },
  //   });
  // }),
  deleteReq: factoryHanlder.deleteOnebyId(RefundReturn),
  // deleteReq: CatchError(async (req, res, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //     return next(new ErrorHandler('Invalid request ID.', 404));
  //   }
  //   const deleteReq = await RefundReturn.findByIdAndDelete(req.params.id);
  //   if (!deleteReq) {
  //     return next(new ErrorHandler('Request not found', 404));
  //   }
  //   res.status(204).json({
  //     status: 'success',
  //     data: null,
  //   });
  // }),
};
