const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Shop = require('../models/ShopModel');
const User = require('../models/UserModel');
// const APIFeatures = require('../utils/ApiFeatures');
const ErrorHandler = require('../utils/ErrorHandler');
const catchError = require('../middleware/CatchError');
const { getImage } = require('../utils/GetImageLink');
const { uploadSingleImageToS3, randomImagesName } = require('../utils/SendFile');
const factoryHandler = require('./FactoryHandler');
const replaceContent = require('../view/ReplaceScript');
const { sendEmail } = require('../utils/Mailing');

const htmlPath = path.join(__dirname, '../view/VerificationTemplate.html');
const htmlFiles = fs.readFileSync(htmlPath, 'utf-8');
const MessageObjective = (targetEmail, data) => ({
  from: 'diymaterial3@gmail.com', // Sender's email address (your Gmail email)
  to: targetEmail,
  subject: 'Creating Shop Verification',
  html: replaceContent(htmlFiles, data),
});

module.exports = {
  // Get all shops: GET /api/v1/shops
  getAllShops: factoryHandler.getAll(Shop),
  // getAllShops: catchError(async (req, res, next) => {
  //   const features = new APIFeatures(Shop.find({}), req.query)
  //     .filter()
  //     .sort()
  //     .limitFields()
  //     .paginate();
  //   const shops = await features.query.populate({
  //     path: 'products',
  //     model: 'Product',
  //   });
  //   if (!shops) {
  //     return next(new ErrorHandler('Shops not found', 404));
  //   }

  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       shops,
  //     },
  //   });
  // }),

  // Get single shop by id: GET /api/v1/shops/:id
  getShop: catchError(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorHandler('Invalid shop ID.', 404));
    }
    const shop = await Shop.findById(req.params.id).populate({
      path: 'products',
      model: 'Product',
    });
    if (!shop) {
      return next(new ErrorHandler('Shops not found', 404));
    }

    // find image from the shop
    const imgUrl = await getImage(shop.imageCover);
    res.status(200).json({
      status: 'success',
      data: {
        shop,
        img: imgUrl,
      },
    });
  }),

  // Create shop: POST /api/v1/shops
  createShop: catchError(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const emailVerifiedToken = crypto.randomBytes(20).toString('hex');
      const image = randomImagesName();
      console.log(req.body);
      const newShopUser = new User({
        username: req.body.name,
        email: req.body.email,
        password: '123456789',
        confirmPassword: '123456789',
        role: 'Shop',
      });
      console.log('CHECKING GMAIL', newShopUser);
      // save the new shop user
      const shopUser = await newShopUser.save();
      console.log(shopUser);

      const newShop = new Shop({
        user: shopUser.id,
        name: req.body.name,
        description: req.body.description,
        imageCover: image,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
      });
      console.log(newShop);
      uploadSingleImageToS3(req, image);
      await newShop.save();
      const verifiedlink = `${process.env.BACKEND_URL}/api/v1/users/verify/${emailVerifiedToken}`;
      const data = {
        VERIFYLINK: verifiedlink,
        NAME: shopUser.username,
      };
      await sendEmail(MessageObjective(shopUser.email, data));
      console.log('DONE');
      res.status(201).json({
        status: 'success',
        data: {
          shop: newShop,
        },
      });
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }),

  // Update shop by id: PATCH /api/v1/shops/:id
  updateShop: catchError(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new ErrorHandler('Invalid shop ID.', 404));
      }
      const shop = await Shop.findByIdAndUpdate(req.params.id, {
        imageCover: randomImagesName(),
        ...req.body,
      });
      if (!shop) {
        return next(new ErrorHandler('Shop not found', 404));
      }
      if (req.file) {
        uploadSingleImageToS3(req, shop.imageCover);
      }

      const imgUrl = await getImage(shop.imageCover);

      return res.status(200).json({
        status: 'success',
        data: {
          shop,
          img: imgUrl,
        },
      });
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }),

  // Delete shop by id: DELETE /api/v1/shops/:id
  deleteShop: factoryHandler.deleteOnebyId(Shop),
  // deleteShop: catchError(async (req, res, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //     return next(new ErrorHandler('Invalid shop ID.', 404));
  //   }
  //   const shop = await Shop.findByIdAndDelete(req.params.id);
  //   if (!shop) {
  //     return next(new ErrorHandler('Shop not found', 404));
  //   }
  //   res.status(204).json({
  //     status: 'success',
  //     data: null,
  //   });
  // }),
};
