import cloudinary from '../config/cloudinary.js';

/**
 * Streams file buffers from RAM directly into Cloudinary folders.
 * @param {Buffer} fileBuffer - Express multer file buffer
 * @param {String} folder - Target Cloudinary folder location
 * @returns {Promise<String>} - Secure URL of uploaded resource
 */
export const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder,
        resource_type: 'auto' // Autodetects PDF or Image types
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    
    // Close stream write pipelines
    uploadStream.end(fileBuffer);
  });
};
