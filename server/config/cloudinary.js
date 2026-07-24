import { v2 as cloudinary } from 'cloudinary';
import env from './env.js';

const configureCloudinary = () => {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    if (env.NODE_ENV === 'development') {
      console.warn('Cloudinary is not configured. Image uploads will be disabled.');
      return null;
    }
    throw new Error('Cloudinary configuration is missing.');
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  
  return cloudinary;
};

export default configureCloudinary;
export { cloudinary };
