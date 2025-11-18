import express from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import { getRoommates, inviteRoommate, getRoommateAnalytics } from '../controllers/roommateController.js';

const router = express.Router();

// For now, we'll use mock data for roommate functionality
// This can be expanded later with proper models

// @route   GET /api/roommates
// @desc    Get roommates and household data
// @access  Private
router.get('/', auth, getRoommates);

// @route   POST /api/roommates/invite
// @desc    Invite new roommate
// @access  Private
router.post('/invite', auth, [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
], inviteRoommate);

// @route   GET /api/roommates/analytics
// @desc    Get household analytics
// @access  Private
router.get('/analytics', auth, getRoommateAnalytics);

export default router;
