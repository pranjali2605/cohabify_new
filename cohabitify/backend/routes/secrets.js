import express from 'express';
import { body, validationResult } from 'express-validator';
import Secret from '../models/Secret.js';
import auth from '../middleware/auth.js';
import {
  getSecrets,
  createSecret,
  toggleLike,
  addComment,
  deleteSecret,
} from '../controllers/secretController.js';

const router = express.Router();

// @route   GET /api/secrets
// @desc    Get all secrets
// @access  Private
router.get('/', auth, getSecrets);

// @route   POST /api/secrets
// @desc    Create new secret
// @access  Private
router.post('/', auth, [
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 1000 })
    .withMessage('Content cannot exceed 1000 characters'),
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean')
], createSecret);

// @route   POST /api/secrets/:id/like
// @desc    Like/unlike a secret
// @access  Private
router.post('/:id/like', auth, toggleLike);

// @route   POST /api/secrets/:id/comment
// @desc    Add comment to secret
// @access  Private
router.post('/:id/comment', auth, [
  body('content')
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean')
], addComment);

// @route   DELETE /api/secrets/:id
// @desc    Delete secret (soft delete)
// @access  Private
router.delete('/:id', auth, deleteSecret);

export default router;
