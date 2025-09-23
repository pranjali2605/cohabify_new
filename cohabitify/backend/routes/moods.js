const express = require('express');
const { body, validationResult } = require('express-validator');
const Mood = require('../models/Mood');
const auth = require('../middleware/auth');
const {
  getMoods,
  createMood,
  updateMood,
  deleteMood,
  getMoodAnalytics,
} = require('../controllers/moodController');

const router = express.Router();

// @route   GET /api/moods
// @desc    Get all moods for user
// @access  Private
router.get('/', auth, getMoods);

// @route   POST /api/moods
// @desc    Log new mood
// @access  Private
router.post('/', auth, [
  body('mood')
    .isIn(['very_sad', 'sad', 'neutral', 'happy', 'very_happy'])
    .withMessage('Invalid mood value'),
  body('intensity')
    .isInt({ min: 1, max: 5 })
    .withMessage('Intensity must be between 1 and 5'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Each tag cannot exceed 50 characters')
], createMood);

// @route   PUT /api/moods/:id
// @desc    Update mood entry
// @access  Private
router.put('/:id', auth, [
  body('mood')
    .optional()
    .isIn(['very_sad', 'sad', 'neutral', 'happy', 'very_happy'])
    .withMessage('Invalid mood value'),
  body('intensity')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Intensity must be between 1 and 5'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
], updateMood);

// @route   DELETE /api/moods/:id
// @desc    Delete mood entry
// @access  Private
router.delete('/:id', auth, deleteMood);

// @route   GET /api/moods/analytics
// @desc    Get mood analytics
// @access  Private
router.get('/analytics', auth, getMoodAnalytics);

module.exports = router;
