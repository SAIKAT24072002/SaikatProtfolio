import multer from 'multer';

// Use memory storage to handle file buffers in RAM instead of local disk
const storage = multer.memoryStorage();

// File filter to restrict uploads to images and PDFs
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are allowed for resume attachments.'), false);
    }
  } else {
    // Avatar and Project images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'), false);
    }
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB maximum limit
  }
});

export default upload;
