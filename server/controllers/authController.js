import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Message from '../models/Message.js';

// Helper to sign JWT and issue HttpOnly cookie response
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };

  res.status(statusCode).cookie('jwt', token, cookieOptions).json({
    success: true,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email
    }
  });
};

// @desc    Admin authentication login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      return next(new Error('Invalid email or security password.'));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Admin session logout / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.cookie('jwt', 'none', {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get currently authenticated admin
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update credentials (email / password)
// @route   PUT /api/auth/update-credentials
// @access  Private
export const updateCredentials = async (req, res, next) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    // Verify current password first
    if (!user || !(await user.matchPassword(currentPassword))) {
      res.status(401);
      return next(new Error('Authentication failed: Current password is incorrect.'));
    }

    if (email && email.trim()) {
      user.email = email;
    }

    if (newPassword && newPassword.trim()) {
      if (newPassword.length < 6) {
        res.status(400);
        return next(new Error('New password must be at least 6 characters long.'));
      }
      user.password = newPassword;
    }

    await user.save();
    res.status(200).json({ success: true, message: 'Settings saved successfully.' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get dashboard metrics stats & feeds
// @route   GET /api/auth/dashboard-stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      projectsCount,
      skillsCount,
      expCount,
      eduCount,
      msgCount,
      recentMessages,
      recentProjects
    ] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Education.countDocuments(),
      Message.countDocuments(),
      Message.find().sort({ createdAt: -1 }).limit(5),
      Project.find({ featured: true }).sort({ displayOrder: 1 }).limit(5)
    ]);

    res.status(200).json({
      success: true,
      stats: {
        projects: projectsCount,
        skills: skillsCount,
        experiences: expCount,
        education: eduCount,
        messages: msgCount
      },
      recentMessages,
      recentProjects
    });
  } catch (err) {
    next(err);
  }
};
