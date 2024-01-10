const { S3Client, PutObjectCommand, S3 } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const sharp = require('sharp');
const path = require('path');
const ErrorHandler = require('./ErrorHandler');
const catchError = require('../middleware/CatchError');
require('dotenv').config();

const S3ClientData = new S3Client({
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_ID,
    secretAccessKey: process.env.BUCKET_SECRETE_ACCESS,
  },
  region: process.env.BUCKET_REGION,
});
console.log('Region: ', process.env.BUCKET_REGION);

const randomImagesName = () => crypto.randomBytes(16).toString('hex');

const uploadMultipleImageToS3 = catchError(async (req, fileName, index, next) => {
  // sharp image
  const fileBuffer = await sharp(req.files[index].buffer)
    .resize({ height: 375, width: 306, fit: 'contain' })
    .toBuffer();

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: req.files[index].mimetype,
  };

  const command = new PutObjectCommand(params);
  if (command) {
    await S3ClientData.send(command);
  } else {
    return next(new ErrorHandler('Command not found.', 404));
  }
  // return true;
});

const uploadSingleImageToS3 = catchError(async (req, fileName, next) => {
  let fileBuffer = '';

  // sharp image
  if ('.mp4'.includes(path.extname(req.file.originalname).toLowerCase())) {
    console.log('pass');
  } else {
    fileBuffer = await sharp(req.file.buffer)
      .resize({ height: 1920, width: 1080, fit: 'contain' })
      .toBuffer();
  }
  console.log(fileBuffer);

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: req.file.mimetype,
  };

  console.log(req.file.mimetype);
  const command = new PutObjectCommand(params);
  if (command) {
    await S3ClientData.send(command);
  } else {
    return next(new ErrorHandler('Command not found.', 404));
  }
  await S3ClientData.send(command);
});

module.exports = {
  S3ClientData,
  uploadMultipleImageToS3,
  uploadSingleImageToS3,
  randomImagesName,
};
