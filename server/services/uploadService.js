import cloudinary from '../config/cloudinary.js';

/**
 * Streams file buffers from RAM directly into Cloudinary folders.
 * @param {Buffer} fileBuffer - Express multer file buffer
 * @param {String} folder - Target Cloudinary folder location
 * @param {Object} options - Cloudinary upload options for the file type
 * @returns {Promise<String>} - Secure URL of uploaded resource
 */
export const uploadToCloudinary = (fileBuffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder,
        resource_type: 'auto', // Autodetects images by default
        ...options
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result?.secure_url) {
          return reject(new Error('Cloudinary did not return a secure file URL.'));
        }
        resolve(result.secure_url);
      }
    );
    
    // Close stream write pipelines
    uploadStream.end(fileBuffer);
  });
};
