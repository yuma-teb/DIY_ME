const mongoose = require('mongoose');
const Product = require('../models/ProductModel');
const APIFeatures = require('../utils/ApiFeatures');
const { randomImagesName, uploadMultipleImageToS3 } = require('../utils/SendFile');
const { getImage } = require('../utils/GetImageLink');
const ErrorHandler = require('../utils/ErrorHandler');
const CatchError = require('../middleware/CatchError');
const factoryHandler = require('./FactoryHandler');

module.exports = {
  // create product
  createProduct: CatchError(async (req, res) => {
    // initializ session
    const session = await mongoose.startSession();
    /// ///////////////////////// Generate files name ////////////////////////////
    session.startTransaction();
    try {
      let imageNames = [];
     
      let categoryId = null;
      if (req.body.category) {
        categoryId = `${req.body.category}`.replace(/"/g, '');
        console.log(categoryId);
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          return res.status(400).json({
            status: 'fail',
            message: 'Invalid category ID',
          });
        }
      }

      const newProductData = {
        images: imageNames,
        category: categoryId,
        description: req.body.description,
        name: req.body.name,
        productSummary: req.body.productSummary,
        tutorial: req.body.tutorial,
        price: req.body.price,
        stock: req.body.stock,
        shop: req.body.shop,
        variations: req.body.variations
          ? JSON.parse(req.body.variations).map((variation) => ({
              ...variation,
              stock: Number(variation.stock),
            }))
          : [],
      };

      const newProduct = await Product.create(newProductData, { session });
      /// /////////////////////// Upload Multiple Images  //////////////////////////
      await Promise.all(
        imageNames.map((imageName, index) => uploadMultipleImageToS3(req, imageName, index)),
      );
      // nicely done the transaction
      await session.commitTransaction();
      res.status(201).json({
        status: 'success',
        data: {
          product: newProduct,
        },
      });
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }),

  // get all product
  getAllProducts: CatchError(async (req, res, next) => {
    const allProducts = await Product.find();
    // checking if shop user
    const features = new APIFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const products = await features.query;
    // const products = await Product.find()
    if (!products) {
      return next(new ErrorHandler('Product not found', 404));
    }

    // /// ///////// Get signed URLs for each profile image  ////////////
    // const signedUrls = await Promise.all(
    //   products.map(async (product) => {
    //     const imageUrls = await Promise.all(
    //       product.images.map(async (imageName) => {
    //         const url = await getImage(imageName);
    //         return url;
    //       }),
    //     );
    //     return imageUrls;
    //   }),
    // );

    // if (!signedUrls) {
    //   return next(new ErrorHandler('Product not found', 404));
    // }

    res.status(200).json({
      status: 'success',
      result: products.length,
      all_products: allProducts.length,
      data: {
        myProd: 'Love',
        products,
        // img: signedUrls,
      },
    });
  }),
  // get product by id
  getProduct: CatchError(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorHandler('Invalid product ID.', 404));
    }

    const product = await Product.findById(req.params.id)
      .populate({
        path: 'shop',
        select: 'name',
      })
      .exec();
    // check if the product has the image

    const productImages = await Promise.all(
      product.images.map(async (image) => {
        if (image) {
          const imageUrl = await getImage(image);
          return imageUrl;
        }
      }),
    );

    if (!productImages) {
      return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
        img: productImages,
      },
    });
  }),
  // update product by id
  updateProduct: async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      let updatedProduct = null;

      let categoryId = null;

      if (req.body.category) {
        categoryId = `${req.body.category}`.replace(/"/g, '');
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          return res.status(400).json({
            status: 'fail',
            message: 'Invalid category ID',
            id: categoryId,
          });
        }
      }
      console.log('FILESS UPLAODING');
      const oldProduct = await Product.findOne({ _id: req.body.id });
      let newImageNames = [];

      if (req.files) {
        console.log('FILES', req.files);

        // Generate new image names for the updated images
        newImageNames = req.files.map(() => randomImagesName());

        // Upload each new image to S3
        await Promise.all(
          req.files.map((file, index) => uploadMultipleImageToS3(req, newImageNames[index], index)),
        );
      }
      console.log('Done UPLAODING');

      // Parse variations from the request body
      const variations = req.body.variations.slice(0, -1).map((variation) => JSON.parse(variation));
      // Update the product

      req.body.images = oldProduct.images.concat(newImageNames);
      req.body.variations = variations;
      req.body.category = categoryId;

      updatedProduct = await Product.findByIdAndUpdate(
        { _id: req.body.id },
        { $set: { ...req.body } },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!updatedProduct) {
        return next(new ErrorHandler('Product not found', 404));
      }

      await session.commitTransaction();
      res.status(200).json({
        status: 'success',
        data: {
          product: updatedProduct,
        },
      });
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  },
  updateRequestingProduct: async (req, res, next) => {
    // get the body=
    console.log('Data', req.body);
    const { id, isActive } = req.body;
    const active = isActive;
    const updateData = await Product.findByIdAndUpdate({ _id: id }, { isActive: active });
    console.log('DONEclear');
    // checking if update success
    if (!updateData) {
      return next(new ErrorHandler('cannot update the product ', 403));
    }
    return res.status(200).json({
      status: 'success',
      data: {
        product: updateData,
      },
    });
  },
  // delete product by id
  deleteProduct: factoryHandler.deleteOnebyId(Product),
  // deleteProduct: async (req, res, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //     return next(new ErrorHandler('Invalid product ID.', 404));
  //   }

  //   const product = await Product.findByIdAndDelete(req.params.id);

  //   if (!product) {
  //     return next(new ErrorHandler('Product not found', 404));
  //   }

  //   res.status(204).json({
  //     status: 'success',
  //     data: null,
  //   });
  // },
  getProductByName: factoryHandler.getProductByNameInclude(Product, 'name'),

  // get seller product
  getShopProducts: CatchError(async (req, res, next) => {
    // destruct the id front the request
    const shopID = req.params.id;

    // find all the prodouct that has belong to the shop
    const shopProducts = await Product.find({ shop: shopID });

    if (!shopProducts) {
      return next(new ErrorHandler('Error getting the product', 400));
    }

    // return the respone
    return res.status(200).json({
      status: 'success',
      data: {
        data: shopProducts,
      },
    });
  }),
  createShopProduct: CatchError(async (req, res) => {
    // initializ session
    const session = await mongoose.startSession();
    /// ///////////////////////// Generate files name ////////////////////////////
    session.startTransaction();
    try {
      const shopID = req.params.id;
      console.log(shopID);

      let imageNames = [];
      if (req.files) {
        imageNames = req.files.map((file) => randomImagesName());
        await Promise.all(
          imageNames.map((imageName, index) => uploadMultipleImageToS3(req, imageName, index)),
        );
      }

      let categoryId = null;
      if (req.body.category) {
        categoryId = `${req.body.category}`.replace(/"/g, '');
        console.log(categoryId);
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          return res.status(400).json({
            status: 'fail',
            message: 'Invalid category ID',
          });
        }
      }

      const newProductData = {
        images: imageNames,
        category: categoryId,
        description: req.body.description,
        name: req.body.name,
        productSummary: req.body.productSummary,
        tutorial: req.body.tutorial,
        price: req.body.price,
        stock: req.body.stock,
        shop: shopID,
        variations: req.body.variations
          ? JSON.parse(req.body.variations).map((variation) => ({
              ...variation,
              stock: Number(variation.stock),
            }))
          : [],
      };

      const newProduct = await Product.create(newProductData, { session });
      /// /////////////////////// Upload Multiple Images  //////////////////////////

      // nicely done the transaction
      await session.commitTransaction();
      res.status(201).json({
        status: 'success',
        data: {
          product: newProduct,
        },
      });
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }),
};
