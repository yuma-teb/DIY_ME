const mongoose = require('mongoose');
const ProductReview = require('../models/ProductReview');
const APIFeatures = require('../utils/ApiFeatures');
const { randomImagesName, uploadMultipleImageToS3 } = require('../utils/SendFile');
const { getImage } = require('../utils/GetImageLink');
const ErrorHandler = require('../utils/ErrorHandler');
const catchError = require('../middleware/CatchError');
const factoryHandler = require('./FactoryHandler');

module.exports = {
  /// /// ------ Create post ------ //////
  createReview: catchError(async (req, res) => {
    const imageNames = req.files.map((file) => randomImagesName());
    /// /////////////////////// Upload Multiple Images  //////////////////////////
    await Promise.all(
      imageNames.map((imageName, index) => uploadMultipleImageToS3(req, imageName, index)),
    );
    const review = await ProductReview.create({ images: imageNames, ...req.body });

    res.status(200).json({
      status: 'success',
      data: {
        review,
      },
    });
  }),

  /// /// ------ Get Posts ------ //////
  getAllReview: catchError(async (req, res, next) => {
    const features = new APIFeatures(ProductReview.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const reviews = await features.query;
    if (!reviews) {
      return next(new ErrorHandler('reviews not found.', 404));
    }
    /// ///////// Get signed URLs for each profile image  ////////////
    const signedUrls = await Promise.all(
      reviews.map(async (p) => {
        const imageUrls = await Promise.all(
          p.images.map(async (imageName) => {
            const url = await getImage(imageName);
            return url;
          }),
        );
        return imageUrls;
      }),
    );
    console.log(signedUrls);
    res.status(200).json({
      status: 'success',
      result: reviews.length,
      data: {
        reviews,
        img: signedUrls,
      },
    });
  }),

  // get single data by id
  getReview: catchError(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler('Invalid review ID.', 404));
    }
    const review = await ProductReview.findById(id);
    if (!review) {
      return next(new ErrorHandler('No review found', 404));
      // eslint-disable-next-line no-else-return
    } else if (review.images.length === 0) {
      console.error('No images to display');
    }

    // get all images of the post
    const PostImages = await Promise.all(
      review.images.map(async (image) => {
        if (image) {
          const imageUrl = await getImage(image);
          return imageUrl;
        }
      }),
    );

    res.status(200).json({
      status: 'success',
      data: {
        review,
        img: PostImages,
      },
    });
  }),

  // delete data
  deleteReview: factoryHandler.deleteOnebyId(ProductReview),
  // deleteReview: catchError(async (req, res, next) => {
  //   const { id } = req.params;
  //   console.log(id);
  //   if (!mongoose.Types.ObjectId.isValid(id)) {
  //     return next(new ErrorHandler('Invalid review ID.', 404));
  //   }
  //   const review = await ProductReview.findOneAndDelete({ _id: id });
  //   if (!review) {
  //     return next(new ErrorHandler('Cannot delete review.', 404));
  //   }
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       review,
  //     },
  //   });
  // }),

  // update or edit data
  updateReview: catchError(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler('Invalid review ID.', 404));
    }

    if (req.files && req.files.length > 0) {
      // Generate new image names for the updated images
      const newImageNames = req.files.map(() => randomImagesName());

      // Upload each new image to S3
      await Promise.all(
        req.files.map((file, index) => uploadMultipleImageToS3(req, newImageNames[index], index)),
      );

      // Update product with new image names
      req.body.images = newImageNames;
    }

    const review = await ProductReview.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
    );

    if (!review) {
      return next(new ErrorHandler('review not found.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        review,
      },
    });
  }),
};
