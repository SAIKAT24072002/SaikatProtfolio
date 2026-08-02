import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  icon: {
    type: String,
    required: [true, 'Icon identifier is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Frontend', 'Backend', 'Database', 'Tools'],
      message: 'Category must be Frontend, Backend, Database, or Tools'
    }
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
