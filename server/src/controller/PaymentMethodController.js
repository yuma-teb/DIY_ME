/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable max-len */

const Order = require('../models/OrderModel');
// const user = require('../models/UserModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchError = require('../middleware/CatchError');

const STRIPE_API_KEY = `sk_test_51OEnp7DdclPQkXYXpCZtmpLPn406qQ1Xwlb5G2Qd1Kg9UA1zOeRdz57ZSPvTPcY151D0BLusmF8Y1KM7JUFPTd3300a9XklhrK`;
const stripe = require('stripe')(STRIPE_API_KEY);

module.exports = {
  getCheckoutSession: catchError(async (req, res, next) => {
    // 1) Get the currently booked order
    const order = await Order.findById(req.params.id);
    // mapping orderItems
    const storeItems = order.orderItems.map((data) => ({
      name: `${data.product.name} Product`,
      description: data.product.productSummary,
      images: [data.product.images],
      price: data.product.price,
      currency: 'usd',
      quantity: data.qty,
    }));

    // 2) Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/success`, // Update success URL
      cancel_url: `${req.protocol}://${req.get('host')}/cancel`, // Update cancel URL
      // customer_email: req,
      client_reference_id: req.params.id, // Update to use the order ID
      line_items: storeItems,
    });
    // Handle errors
    if (!session) {
      return next(new ErrorHandler('Failed, Internal Server Error', 500));
    }

    // 3) Send the session ID as a response
    res.status(200).json({
      status: 'success',
      sessionId: session.id,
    });
  }),
};
