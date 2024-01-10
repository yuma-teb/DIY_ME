/* eslint-disable import/no-extraneous-dependencies */
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { S3ClientData } = require('./SendFile');
require('dotenv').config();

module.exports = {
  getImage: async (fileName) => {
    try {
      const getObjectParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(S3ClientData, command, { expiresIn: 3600 });

      return url;
    } catch (err) {
      console.error('Error generating signed URL:', err);
      // throw err; // Rethrow the error for further handling
    }
  },
};
