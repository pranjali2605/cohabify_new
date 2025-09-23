const { validationResult } = require('express-validator');
const Secret = require('../models/Secret');

// GET /api/secrets
async function getSecrets(req, res) {
  try {
    const secrets = await Secret.find({ isActive: true })
      .populate('author', 'username')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 })
      .limit(50);

    const processedSecrets = secrets.map((secret) => {
      const secretObj = secret.toObject();
      if (secret.isAnonymous) {
        secretObj.author = null;
      }
      secretObj.comments = secretObj.comments.map((comment) => {
        if (comment.isAnonymous) comment.author = null;
        return comment;
      });
      return secretObj;
    });

    res.json({ secrets: processedSecrets });
  } catch (error) {
    console.error('Get secrets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/secrets
async function createSecret(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { content, isAnonymous = true } = req.body;

    const secret = new Secret({ content, author: req.user._id, isAnonymous });
    await secret.save();
    await secret.populate('author', 'username');

    const secretObj = secret.toObject();
    if (secret.isAnonymous) secretObj.author = null;

    res.status(201).json({ message: 'Secret shared successfully', secret: secretObj });
  } catch (error) {
    console.error('Create secret error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/secrets/:id/like
async function toggleLike(req, res) {
  try {
    const secret = await Secret.findById(req.params.id);
    if (!secret) return res.status(404).json({ message: 'Secret not found' });

    const existingLike = secret.likes.find((like) => like.user.toString() === req.user._id.toString());
    if (existingLike) {
      secret.likes = secret.likes.filter((like) => like.user.toString() !== req.user._id.toString());
    } else {
      secret.likes.push({ user: req.user._id });
    }

    await secret.save();

    res.json({
      message: existingLike ? 'Secret unliked' : 'Secret liked',
      likesCount: secret.likes.length,
      isLiked: !existingLike,
    });
  } catch (error) {
    console.error('Like secret error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/secrets/:id/comment
async function addComment(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const secret = await Secret.findById(req.params.id);
    if (!secret) return res.status(404).json({ message: 'Secret not found' });

    const { content, isAnonymous = true } = req.body;
    const comment = { content, author: req.user._id, isAnonymous };

    secret.comments.push(comment);
    await secret.save();
    await secret.populate('comments.author', 'username');

    const addedComment = secret.comments[secret.comments.length - 1].toObject();
    if (addedComment.isAnonymous) addedComment.author = null;

    res.status(201).json({ message: 'Comment added successfully', comment: addedComment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// DELETE /api/secrets/:id
async function deleteSecret(req, res) {
  try {
    const secret = await Secret.findOne({ _id: req.params.id, author: req.user._id });
    if (!secret) return res.status(404).json({ message: 'Secret not found or unauthorized' });

    secret.isActive = false;
    await secret.save();

    res.json({ message: 'Secret deleted successfully' });
  } catch (error) {
    console.error('Delete secret error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getSecrets, createSecret, toggleLike, addComment, deleteSecret };
