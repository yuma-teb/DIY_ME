// Importing necessary modules and utilities
const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchError = require('../middleware/CatchError');
// eslint-disable-next-line no-unused-vars
const factoryHandler = require('./FactoryHandler');
const APIFeatures = require('../utils/ApiFeatures');

const { randomImagesName, uploadSingleImageToS3 } = require('../utils/SendFile');
const { getImage } = require('../utils/GetImageLink');

// Exporting a set of functions related to post handling
module.exports = {
  /// /// ------ Create Post ------ //////
  // Handling the creation of a new post
  createPost: catchError(async (req, res) => {

    // Destructuring relevant information from the request body
    // const { title, description, user, username } = req.body;
    // Creating a new post using the Post model
    // Retrieve the user and username from the authenticated user
    // const { _id: user, username } = req.user;

    let imageName = '';
    if (req.file) {
      imageName = randomImagesName();
      uploadSingleImageToS3(req, imageName);
    }

    const post = await Post.create({
      ...req.body,
      image: imageName,
    });

    // Sending a successful response with the created post
    res.status(201).json({
      status: 'success',
      data: {
        post,
      },
    });
  }),

  /// /// ------ Get Posts ------ //////
  // Handling the retrieval of all posts
  getPosts: catchError(async (req, res, next) => {
    const features = new APIFeatures(Post.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const posts = await features.query;
    // Checking if posts are found
    if (!posts) {
      return next(new ErrorHandler('Posts not found.', 404));
    }
    // /// ///////// Get signed URLs for each profile image  ////////////

    // Sending a successful response with the retrieved posts
    res.status(200).json({
      status: 'success',
      data: {
        posts,
        // img: signedUrls,
      },
    });
  }),

  /// /// ------ Get Post By Id ------ //////
  // Handling the retrieval of a post by its ID
  getPostById: catchError(async (req, res, next) => {
    // Extracting the post ID from the request parameters
    const id = req.params.postId;
    // Fetching the post from the database using its ID
    const post = await Post.findById(id);
    // // get all images of the post
    // const PostImages = await Promise.all(
    //   post.images.map(async (image) => {
    //     if (image) {
    //       const imageUrl = await getImage(image);
    //       return imageUrl;
    //     }
    //   }),
    // );
    if (id) {
      // Checking if the post is found
      if (post) {
        // Sending a successful response with the retrieved post
        res.status(200).json({
          status: 'success',
          data: {
            post,
            // img: PostImages,
          },
        });
      } else {
        // Handling the case where no post is found with the provided ID
        return next(new ErrorHandler('No post found', 404));
      }
      // } else if (post.images.length === 0) {
      //   console.error('No  images to display');
      // }
    } else {
      // Handling the case where an invalid post ID is provided
      return next(new ErrorHandler('Invalid post ID.', 400));
    }
  }),

  /// /// ------ Delete Post By Id ------ //////
  // Handling the deletion of a post by its ID
  deletePostById: catchError(async (req, res, next) => {
    // Extracting the post ID from the request parameters
    const id = req.params.postId;
    if (id) {
      // Deleting the post from the database
      const post = await Post.findByIdAndDelete(id);

      // Deleting comments associated with the post
      await Comment.deleteMany({ postId: id });

      // Sending a successful response with the deleted post
      res.status(204).json({
        status: 'success',
        data: {
          post,
        },
      });
    } else {
      // Handling the case where an invalid post ID is provided
      return next(new ErrorHandler('Invalid post ID.', 400));
    }
  }),

  /// /// ------ Update Post By Id ------ //////
  // Handling the update of a post by its ID
  updatePostById: catchError(async (req, res, next) => {
    // Extracting the post ID from the request parameters
    const id = req.params.postId;
    // Destructuring relevant information from the request body
    if (!id) {
      return next(new ErrorHandler('Invalid post ID.', 404));
    }
    // Updating the post in the database and returning the updated post
    const post = await Post.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      { new: true },
    );
    // Checking if the post is found and updated
    if (!post) {
      return next(new ErrorHandler('No post found', 404));
    }

    // if (req.files && req.files.length > 0) {
    //   // Generate new image names for the updated images
    //   const newImageNames = req.files.map(() => randomImagesName());

    //   // Upload each new image to S3
    //   await Promise.all(
    //     req.files.map((file, index) => uploadMultipleImageToS3(req, newImageNames[index], index)),
    //   );

    //   // Update product with new image names
    //   req.body.images = newImageNames;
    // }

    if (!post) {
      return next(new ErrorHandler('Post not found.', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        post,
      },
    });
  }),
};
