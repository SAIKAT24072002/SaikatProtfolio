import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  subject: {
    type: String,
    required: [true, 'Subject line is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message body is required'],
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['New', 'Read', 'Replied'],
    default: 'New'
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
