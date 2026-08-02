import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true
  },
  fullDescription: {
    type: String,
    required: [true, 'Full description is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Project image screenshot URL is required']
  },
  technologies: {
    type: [String],
    required: [true, 'At least one technology tag is required']
  },
  features: {
    type: [String],
    default: []
  },
  challenges: {
    type: String,
    default: ''
  },
  solutions: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  liveUrl: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
