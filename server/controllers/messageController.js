import Message from '../models/Message.js';

// @desc    Submit public contact message
// @route   POST /api/messages
// @access  Public
export const sendMessage = async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  try {
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
      data: newMessage
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all messages (Inbox view)
// @route   GET /api/messages
// @access  Private
export const getMessages = async (req, res, next) => {
  const { search, from, to } = req.query;
  const query = {};

  // 1. Keyword search (case-insensitive on name, email, and subject)
  if (search) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { subject: searchRegex }
    ];
  }

  // 2. Date Filtering (handling inclusive India Standard Time offset UTC+5:30)
  if (from || to) {
    query.createdAt = {};
    if (from) {
      // from date starts at 00:00:00 in IST
      const fromUtc = new Date(`${from}T00:00:00+05:30`);
      if (!isNaN(fromUtc.getTime())) {
        query.createdAt.$gte = fromUtc;
      }
    }
    if (to) {
      // to date ends at 23:59:59.999 in IST
      const toUtc = new Date(`${to}T23:59:59.999+05:30`);
      if (!isNaN(toUtc.getTime())) {
        query.createdAt.$lte = toUtc;
      }
    }
  }

  try {
    const messages = await Message.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    next(err);
  }
};

// @desc    Update message status
// @route   PATCH /api/messages/:id
// @access  Private
export const updateMessageStatus = async (req, res, next) => {
  const { status } = req.body;

  if (!status || !['New', 'Read', 'Replied'].includes(status)) {
    res.status(400);
    return next(new Error('Please provide a valid status: New, Read, or Replied.'));
  }

  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      res.status(404);
      return next(new Error('Message not found.'));
    }

    message.status = status;
    await message.save();

    res.status(200).json({ success: true, message });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      res.status(404);
      return next(new Error('Message not found.'));
    }

    await message.deleteOne();
    res.status(200).json({ success: true, message: 'Message deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
