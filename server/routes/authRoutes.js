import express from 'express';
import { 
  login, 
  logout, 
  getMe, 
  updateCredentials, 
  getDashboardStats 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateLogin } from '../validators/inputValidator.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter for admin login (Max 5 login requests per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication endpoints
router.post('/login', loginLimiter, validateLogin, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/update-credentials', protect, updateCredentials);
router.get('/dashboard-stats', protect, getDashboardStats);

export default router;
