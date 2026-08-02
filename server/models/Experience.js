import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  position: {
    type: String,
    required: [true, 'Position role title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company / Organization name is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  currentStatus: {
    type: Boolean,
    default: false
  },
  description: {
    type: [String],
    required: [true, 'At least one bullet description is required']
  },
  technologies: {
    type: [String],
    default: []
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
