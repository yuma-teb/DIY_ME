const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const PostRoute = require('./src/routes/PostRoute');
const CommentRoute = require('./src/routes/CommentRoute');
const userRoute = require('./src/routes/UserRoute');
const authRoute = require('./src/routes/AuthRoute');
const ProductRoute = require('./src/routes/ProductRoute');
const CategoryRoute = require('./src/routes/CategoryRoute');
const VariationRoute = require('./src/routes/VariationRoute');
const ShopRoute = require('./src/routes/ShopRoute');
const orderRouter = require('./src/routes/OrderRoute');
const RefundRouter = require('./src/routes/RefundReturnRoute');
const ProductReviewRoute = require('./src/routes/ProductReviewRoute');
const restrictRole = require('./src/middleware/RestrictRoles');
// const paymentRoutes = require('./src/routes/paymentRoute');
const ReportRoute = require('./src/routes/ReportRoute');
const ErrorHandler = require('./src/utils/ErrorHandler');
require('dotenv').config();

const app = express();

// user cors
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false })); // Add this line
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONT_END_URL, credentials: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Define your routes here
app.use('/api/v1/posts', PostRoute);
// app.use('/api/v1/comments', postcommentroute);
app.use('/api/v1/comment', CommentRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/orders', orderRouter);
// app.use('/api/v1/', paymentRoutes);
app.use('/api/v1/category', CategoryRoute);
app.use('/api/v1/variation', VariationRoute);
app.use('/api/v1/product', ProductRoute);
app.use('/api/v1/refund', RefundRouter);
app.use('/api/v1/shops', ShopRoute);
app.use('/api/v1/reports', ReportRoute);
app.use('/api/v1/review', ProductReviewRoute);
app.all('*', (req, res, next) => {
  next(new ErrorHandler(`Cannot find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;