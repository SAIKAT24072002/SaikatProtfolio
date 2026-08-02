import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

// Controllers
import { updateProfile, uploadAvatar, uploadResume } from '../controllers/profileController.js';
import { createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { createSkill, updateSkill, deleteSkill } from '../controllers/skillController.js';
import { createExperience, updateExperience, deleteExperience } from '../controllers/experienceController.js';
import { createEducation, updateEducation, deleteEducation } from '../controllers/educationController.js';
import { getMessages, updateMessageStatus, deleteMessage } from '../controllers/messageController.js';

// Validators
import { validateSkill, validateExperience, validateEducation } from '../validators/inputValidator.js';

const router = express.Router();

// Apply auth protect guards globally on all administration endpoints
router.use(protect);

// --- Profile CRUD Operations ---
router.put('/profile', updateProfile);
router.post('/profile/upload-avatar', upload.single('avatar'), uploadAvatar);
router.post('/profile/upload-resume', upload.single('resume'), uploadResume);

// --- Projects CRUD Operations ---
router.post('/projects', upload.single('image'), createProject);
router.put('/projects/:id', upload.single('image'), updateProject);
router.delete('/projects/:id', deleteProject);

// --- Skills CRUD Operations ---
router.post('/skills', validateSkill, createSkill);
router.put('/skills/:id', validateSkill, updateSkill);
router.delete('/skills/:id', deleteSkill);

// --- Experience CRUD Operations ---
router.post('/experiences', validateExperience, createExperience);
router.put('/experiences/:id', validateExperience, updateExperience);
router.delete('/experiences/:id', deleteExperience);

// --- Education CRUD Operations ---
router.post('/education', validateEducation, createEducation);
router.put('/education/:id', validateEducation, updateEducation);
router.delete('/education/:id', deleteEducation);

// --- Messages Inbox Operations ---
router.get('/messages', getMessages);
router.patch('/messages/:id', updateMessageStatus);
router.delete('/messages/:id', deleteMessage);

export default router;
