import { cloudinary } from '../config/cloudinary.js';
import streamifier from 'streamifier';

const uploadBuffer = (fileBuffer, folder = 'inventory-app') => new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });
  streamifier.createReadStream(fileBuffer).pipe(uploadStream);
});

export const uploadImage = async (req, res) => {
  try {
    if (!cloudinary.config().cloud_name) {
      return res.status(503).json({ error: 'Cloudinary is not configured' });
    }
    if (!req.file) return res.status(400).json({ error: 'Image file is required' });

    const result = await uploadBuffer(req.file.buffer, req.body.folder);
    res.status(201).json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};
