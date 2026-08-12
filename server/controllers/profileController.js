import Profile from '../models/Profile.js';
import { uploadToCloudinary } from '../services/uploadService.js';

// @desc    Get portfolio profile data
// @route   GET /api/profile
// @access  Public
export const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      res.status(404);
      return next(new Error('Profile configurations not found. Seed database first.'));
    }
    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Update portfolio profile text details
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  const { name, title, bio, about, socialLinks } = req.body;

  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }

    profile.name = name || profile.name;
    profile.title = title || profile.title;
    profile.bio = bio || profile.bio;
    profile.about = about || profile.about;
    
    if (socialLinks) {
      profile.socialLinks = {
        github: socialLinks.github ?? profile.socialLinks.github,
        linkedin: socialLinks.linkedin ?? profile.socialLinks.linkedin,
        email: socialLinks.email ?? profile.socialLinks.email,
        twitter: socialLinks.twitter ?? profile.socialLinks.twitter
      };
    }

    await profile.save();
    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload profile avatar image
// @route   POST /api/profile/upload-avatar
// @access  Private
export const uploadAvatar = async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    return next(new Error('Please select an image file to upload.'));
  }

  try {
    let profile = await Profile.findOne();
    if (!profile) {
      res.status(404);
      return next(new Error('Profile configurations not found.'));
    }

    // Upload buffer to Cloudinary
    const avatarUrl = await uploadToCloudinary(req.file.buffer, 'portfolio/avatar');
    
    profile.avatar = avatarUrl;
    await profile.save();

    res.status(200).json({ success: true, avatarUrl });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload profile resume PDF document
// @route   POST /api/profile/upload-resume
// @access  Private
export const uploadResume = async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    return next(new Error('Please select a PDF document to upload.'));
  }

  if (!req.file.originalname.toLowerCase().endsWith('.pdf') || req.file.buffer.subarray(0, 4).toString() !== '%PDF') {
    res.status(400);
    return next(new Error('Only valid PDF documents are allowed for resume attachments.'));
  }

  try {
    let profile = await Profile.findOne();
    if (!profile) {
      res.status(404);
      return next(new Error('Profile configurations not found.'));
    }

    // PDFs must use Cloudinary's raw delivery type. Uploading them as auto/image
    // resources can result in a delivery 401 when PDF delivery is restricted.
    const resumeUrl = await uploadToCloudinary(req.file.buffer, 'portfolio/resume', {
      resource_type: 'raw'
    });
    
    profile.resume = resumeUrl;
    await profile.save();

    res.status(200).json({ success: true, resumeUrl });
  } catch (err) {
    next(err);
  }
};
