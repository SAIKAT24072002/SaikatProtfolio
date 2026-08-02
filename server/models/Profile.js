import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Developer name is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Professional title is required'],
    trim: true
  },
  bio: {
    type: String,
    required: [true, 'Biography summary is required'],
    trim: true
  },
  about: {
    type: String,
    required: [true, 'Detailed about description is required'],
    trim: true
  },
  avatar: {
    type: String,
    required: [true, 'Avatar URL is required']
  },
  resume: {
    type: String,
    required: [true, 'Resume file URL is required']
  },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    email: { type: String, default: '' },
    twitter: { type: String, default: '' }
  }
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
