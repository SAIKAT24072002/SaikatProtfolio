import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: [true, 'Degree name is required'],
    trim: true
  },
  institution: {
    type: String,
    required: [true, 'Institution / University is required'],
    trim: true
  },
  startYear: {
    type: String,
    required: [true, 'Start year is required'],
    trim: true
  },
  endYear: {
    type: String,
    required: [true, 'End year is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Education = mongoose.model('Education', educationSchema);
export default Education;
