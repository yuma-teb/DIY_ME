const mongoose = require('mongoose');
const Category = require('../models/Category');
const APIFeatures = require('../utils/ApiFeature');
const { uploadSingleImageToS3, randomImagesName } = require('../utils/SendFile');
// const { getImage } = require('../utils/GetImageLink');
// const ErrorHandler = require('../utils/ErrorHandler');
const catchError = require('../middleware/CatchError');
const factoryHandler = require('./FactoryHandler');

module.exports = {
  // create category
  createCategory: catchError(async (req, res) => {
    // create a session
    const session = await mongoose.startSession();

    session.startTransaction();
    // genereate the name for the files
    const imageName = randomImagesName();

    const newCategory = await Category.create({ image: imageName, ...req.body });

    // store the image on the amazon S3
    await uploadSingleImageToS3(req, imageName);
    res.status(201).json({
      status: 'success',
      data: {
        category: newCategory,
      },
    });
  }),
  // get all category
  getAllCategory: factoryHandler.getAll(Category),
  // getAllCategory: catchError(async (req, res, next) => {
  //   const features = new APIFeatures(Category.find(), req.query)
  //     .filter()
  //     .sort()
  //     .limitFields()
  //     .paginate();
  //   const categories = await features.query;
  //   if (!categories) {
  //     return next(new ErrorHandler('Category not found', 404));
  //   }
  // get all images of the category
  //   const categoryImageList = await Promise.all(
  //     categories.map(async (c) => {
  //       if (c.image) {
  //         const imageUrl = await getImage(c.image);
  //         return imageUrl;
  //       }
  //     }),
  //   );

  //   if (!categoryImageList) {
  //     return next(new ErrorHandler('Category not found', 404));
  //   }

  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       categories,
  //       img: categoryImageList,
  //     },
  //   });
  // }),
  getCategory: factoryHandler.getOnebyId(Category, '', 'products'),
  // getCategory: catchError(async (req, res, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //     return next(new ErrorHandler('Invalid category ID.', 404));
  //   }

  //   const category = await Category.findById(req.params.id);
  //   // const imgUrl = await getImage(category.image);

  //   if (!category) {
  //     return next(new ErrorHandler('Category not found', 404));
  //   }
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       category,
  //       // img: imgUrl,
  //     },
  //   });
  // }),
  // update product by id
  updateCategory: factoryHandler.updateOneById(Category),
  // updateCategory: catchError(async (req, res, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //     return next(new ErrorHandler('Invalid category ID.', 404));
  //   }
  //   let newImagesName = ' ';
  //   if (req.file) {
  //     newImagesName = randomImagesName();
  //     await uploadSingleImageToS3(req, newImagesName);
  //   }

  //   const category = await Category.findByIdAndUpdate(
  //     req.body.id,
  //     { image: newImagesName, ...req.body },
  //     {
  //       new: true,
  //       runValidators: true,
  //     },
  //   );
  //   if (!category) {
  //     return next(new ErrorHandler('Category not found', 404));
  //   }
  //   res.status(200).json({
  //     status: 'success',
  //     category,
  //   });
  // }),
  // delete product by id
  deleteCategory: factoryHandler.deleteOnebyId(Category),
  // deleteCategory: catchError(async (req, res, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //     return next(new ErrorHandler('Invalid category ID.', 404));
  //   }

  //   const category = await Category.findByIdAndDelete(req.params.id);
  //   if (!category) {
  //     return next(new ErrorHandler('Category not found', 404));
  //   }
  //   res.status(204).json({
  //     status: 'success',
  //     data: null,
  //   });
  // }),
};
