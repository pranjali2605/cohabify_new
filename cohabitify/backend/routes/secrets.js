const express = require('express');
const { body, validationResult } = require('express-validator');
const Secret = require('../models/Secret');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/secrets
// @desc    Get all secrets
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const secrets = await Secret.find({ isActive: true })
      .populate('author', 'username')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 })
      .limit(50);

    // Remove author info for anonymous secrets
    const processedSecrets = secrets.map(secret => {
      const secretObj = secret.toObject();
      if (secret.isAnonymous) {
        secretObj.author = null;
      }
      
      secretObj.comments = secretObj.comments.map(comment => {
        if (comment.isAnonymous) {
          comment.author = null;
        }
        return comment;
      });
      
      return secretObj;
    });

    res.json({ secrets: processedSecrets });
  } catch (error) {
    console.error('Get secrets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { content, isAnonymous = true } = req.body;

    const secret = new Secret({
      content,
      author: req.user._id,
      isAnonymous
    });

    await secret.save();
    await secret.populate('author', 'username');

    const secretObj = secret.toObject();
    if (secret.isAnonymous) {
      secretObj.author = null;
    }

    res.status(201).json({
      message: 'Secret shared successfully',
      secret: secretObj
    });
  } catch (error) {
    console.error('Create secret error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/secrets/:id/like
// @desc    Like/unlike a secret
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const secret = await Secret.findById(req.params.id);

    if (!secret) {
      return res.status(404).json({ message: 'Secret not found' });
    }

    const existingLike = secret.likes.find(
      like => like.user.toString() === req.user._id.toString()
    );

    if (existingLike) {
      // Unlike
      secret.likes = secret.likes.filter(
        like => like.user.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      secret.likes.push({ user: req.user._id });
    }

    await secret.save();

    res.json({
      message: existingLike ? 'Secret unliked' : 'Secret liked',
      likesCount: secret.likes.length,
      isLiked: !existingLike
    });
  } catch (error) {
    console.error('Like secret error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const secret = await Secret.findById(req.params.id);

    if (!secret) {
      return res.status(404).json({ message: 'Secret not found' });
    }

    const { content, isAnonymous = true } = req.body;

    const comment = {
      content,
      author: req.user._id,
      isAnonymous
    };

    secret.comments.push(comment);
    await secret.save();
    await secret.populate('comments.author', 'username');

    const addedComment = secret.comments[secret.comments.length - 1].toObject();
    if (addedComment.isAnonymous) {
      addedComment.author = null;
    }

    res.status(201).json({
      message: 'Comment added successfully',
      comment: addedComment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/secrets/:id
// @desc    Delete secret (soft delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const secret = await Secret.findOne({
      _id: req.params.id,
      author: req.user._id
    });

    if (!secret) {
      return res.status(404).json({ message: 'Secret not found or unauthorized' });
    }

    secret.isActive = false;
    await secret.save();

    res.json({ message: 'Secret deleted successfully' });
  } catch (error) {
    console.error('Delete secret error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
