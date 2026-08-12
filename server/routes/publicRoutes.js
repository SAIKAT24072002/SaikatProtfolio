import express from 'express';
import { getProfile, downloadResume } from '../controllers/profileController.js';
import { getProjects, getProjectBySlug } from '../controllers/projectController.js';
import { getSkills } from '../controllers/skillController.js';
import { getExperiences } from '../controllers/experienceController.js';
import { getEducation } from '../controllers/educationController.js';
import { sendMessage } from '../controllers/messageController.js';
import { validateMessage } from '../validators/inputValidator.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Message rate-limiter for contact forms: Max 3 submissions per hour from an IP
const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: 'Too many message submissions from this IP. Please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// GET endpoints
router.get('/profile', getProfile);
router.get('/profile/resume/download', downloadResume);
router.get('/projects', getProjects);
router.get('/projects/:slug', getProjectBySlug);
router.get('/skills', getSkills);
router.get('/experiences', getExperiences);
router.get('/education', getEducation);

// POST contact message inquiry (with rate limiting and validators)
router.post('/messages', messageLimiter, validateMessage, sendMessage);

export default router;
