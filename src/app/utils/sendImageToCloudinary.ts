import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import fs from 'fs';
import config from '../config';

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
) => {
  // Configuration
  cloudinary.config({
    cloud_name: config.cloudinary_image_cloud_name,
    api_key: config.cloudinary_image_api_key,
    api_secret: config.cloudinary_image_api_secret, // Click 'View Credentials' below to copy your API secret
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: imageName,
    })
    .catch((error: any) => {
      throw new AppError(httpStatus.FORBIDDEN, error.message);
    });

  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    // console.log('file removed');
  });
  return uploadResult;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
