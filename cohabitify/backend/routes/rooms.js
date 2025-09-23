const express = require('express');

const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Room = require('../models/Room');
const {
  regenerateCode,
  getMyRoom,
  createRoom,
  joinRoom,
  leaveRoom,
  updateRoom,
} = require('../controllers/roomsController');
const router = express.Router();

// @route   POST /api/rooms/:id/regenerate-code
// @desc    Regenerate join code (owner only)
// @access  Private
router.post('/:id/regenerate-code', auth, regenerateCode);

// @route   GET /api/rooms/me
// @desc    Get the room the current user belongs to
// @access  Private
router.get('/me', auth, getMyRoom);

// @route   POST /api/rooms/create
// @desc    Create a room (2-5 max members), creator becomes owner & member
// @access  Private
router.post('/create', auth, [
  body('name').optional().isString().isLength({ min: 1, max: 50 }).withMessage('Name must be 1-50 chars'),
  body('maxSize').isInt({ min: 2, max: 5 }).withMessage('maxSize must be between 2 and 5'),
], createRoom);

// @route   POST /api/rooms/join
// @desc    Join a room by code
// @access  Private
router.post('/join', auth, [
  body('code').isString().isLength({ min: 4, max: 10 }).withMessage('Invalid code')
], joinRoom);

// @route   POST /api/rooms/leave
// @desc    Leave current room (owner leaves as member; if owner leaves and no members remain, delete room)
// @access  Private
router.post('/leave', auth, leaveRoom);
// Owner-only: update room name and/or maxSize
// @route   PUT /api/rooms/:id
// @desc    Update room settings (owner only)
// @access  Private
router.put('/:id', auth, [
  body('name').optional().isString().isLength({ min: 1, max: 50 }).withMessage('Name must be 1-50 chars'),
  body('maxSize').optional().isInt({ min: 2, max: 5 }).withMessage('maxSize must be between 2 and 5'),
], updateRoom);

module.exports = router;
