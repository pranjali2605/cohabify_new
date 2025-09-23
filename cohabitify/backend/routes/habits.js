const express = require('express');
const { body, validationResult } = require('express-validator');
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');
const {
  getHabits,
  createHabit,
  updateHabit,
  completeHabit,
  deleteHabit,
  getAnalytics,
} = require('../controllers/habitController');

const router = express.Router();

// @route   GET /api/habits
// @desc    Get all habits for user
// @access  Private
router.get('/', auth, getHabits);

// @route   POST /api/habits
// @desc    Create new habit
// @access  Private
router.post('/', auth, [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .isIn(['health', 'productivity', 'learning', 'fitness', 'mindfulness', 'social', 'other'])
    .withMessage('Invalid category'),
  body('frequency')
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Invalid frequency')
], createHabit);

// @route   PUT /api/habits/:id
// @desc    Update habit
// @access  Private
router.put('/:id', auth, [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(['health', 'productivity', 'learning', 'fitness', 'mindfulness', 'social', 'other'])
    .withMessage('Invalid category'),
  body('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Invalid frequency')
], updateHabit);

// @route   POST /api/habits/:id/complete
// @desc    Mark habit as completed for today
// @access  Private
router.post('/:id/complete', auth, [
  body('count')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Count must be a positive integer'),
  body('notes')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Notes cannot exceed 200 characters')
], completeHabit);

// @route   DELETE /api/habits/:id
// @desc    Delete habit (soft delete)
// @access  Private
router.delete('/:id', auth, deleteHabit);

// @route   GET /api/habits/analytics
// @desc    Get habit analytics
// @access  Private
router.get('/analytics', auth, getAnalytics);

module.exports = router;
