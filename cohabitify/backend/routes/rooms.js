const express = require('express');

const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Room = require('../models/Room');
const router = express.Router();

// @route   POST /api/rooms/:id/regenerate-code
// @desc    Regenerate join code (owner only)
// @access  Private
router.post('/:id/regenerate-code', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only room owner can regenerate code' });
    }

    room.code = await generateUniqueCode();
    await room.save();

    const populated = await Room.findById(room._id)
      .populate('owner', 'username email')
      .populate('members', 'username email');

    res.json({ message: 'Code regenerated', room: populated });
  } catch (err) {
    console.error('Regenerate code error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Helper to generate a simple alphanumeric room code
function generateCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // avoid ambiguous chars
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Ensure unique code
async function generateUniqueCode() {
  for (let i = 0; i < 5; i++) {
    const code = generateCode();
    const exists = await Room.findOne({ code });
    if (!exists) return code;
  }
  // Fallback longer code
  return generateCode(8);
}

// @route   GET /api/rooms/me
// @desc    Get the room the current user belongs to
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const room = await Room.findOne({ members: req.user._id })
      .populate('owner', 'username email')
      .populate('members', 'username email');
    if (!room) return res.json({ room: null });
    res.json({ room });
  } catch (err) {
    console.error('Get my room error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/rooms/create
// @desc    Create a room (2-5 max members), creator becomes owner & member
// @access  Private
router.post(
  '/create',
  auth,
  [
    body('name').optional().isString().isLength({ min: 1, max: 50 }).withMessage('Name must be 1-50 chars'),
    body('maxSize')
      .isInt({ min: 2, max: 5 })
      .withMessage('maxSize must be between 2 and 5'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }

      // Prevent creating multiple rooms per user
      const existing = await Room.findOne({ members: req.user._id });
      if (existing) {
        return res.status(400).json({ message: 'You already belong to a room' });
      }

      const { name = 'My Room', maxSize } = req.body;
      const code = await generateUniqueCode();

      const room = new Room({
        name,
        code,
        owner: req.user._id,
        members: [req.user._id],
        maxSize,
      });
      await room.save();

      const populated = await Room.findById(room._id)
        .populate('owner', 'username email')
        .populate('members', 'username email');

      res.status(201).json({ message: 'Room created', room: populated });
    } catch (err) {
      console.error('Create room error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST /api/rooms/join
// @desc    Join a room by code
// @access  Private
router.post(
  '/join',
  auth,
  [body('code').isString().isLength({ min: 4, max: 10 }).withMessage('Invalid code')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }

      // user must not already be in a room
      const already = await Room.findOne({ members: req.user._id });
      if (already) {
        return res.status(400).json({ message: 'You already belong to a room' });
      }

      const { code } = req.body;
      const room = await Room.findOne({ code });
      if (!room) return res.status(404).json({ message: 'Room not found' });

      if (room.members.length >= room.maxSize) {
        return res.status(400).json({ message: 'Room is full' });
      }

      if (room.members.some(m => m.toString() === req.user._id.toString())) {
        return res.status(400).json({ message: 'You are already in this room' });
      }

      room.members.push(req.user._id);
      await room.save();

      const populated = await Room.findById(room._id)
        .populate('owner', 'username email')
        .populate('members', 'username email');

      res.json({ message: 'Joined room', room: populated });
    } catch (err) {
      console.error('Join room error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST /api/rooms/leave
// @desc    Leave current room (owner leaves as member; if owner leaves and no members remain, delete room)
// @access  Private
router.post('/leave', auth, async (req, res) => {
  try {
    const room = await Room.findOne({ members: req.user._id });
    if (!room) return res.status(400).json({ message: 'You are not in a room' });

    room.members = room.members.filter(m => m.toString() !== req.user._id.toString());

    if (room.members.length === 0) {
      await Room.deleteOne({ _id: room._id });
      return res.json({ message: 'Left room and room deleted (no members left)' });
    }

    // If owner left, assign new owner (first member)
    if (room.owner.toString() === req.user._id.toString()) {
      room.owner = room.members[0];
    }

    await room.save();

    const populated = await Room.findById(room._id)
      .populate('owner', 'username email')
      .populate('members', 'username email');

    res.json({ message: 'Left room', room: populated });
  } catch (err) {
    console.error('Leave room error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Owner-only: update room name and/or maxSize
// @route   PUT /api/rooms/:id
// @desc    Update room settings (owner only)
// @access  Private
router.put(
  '/:id',
  auth,
  [
    body('name').optional().isString().isLength({ min: 1, max: 50 }).withMessage('Name must be 1-50 chars'),
    body('maxSize').optional().isInt({ min: 2, max: 5 }).withMessage('maxSize must be between 2 and 5'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }

      const room = await Room.findById(req.params.id);
      if (!room) return res.status(404).json({ message: 'Room not found' });

      if (room.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only room owner can update settings' });
      }

      const { name, maxSize } = req.body;
      if (typeof name === 'string') room.name = name;

      if (typeof maxSize === 'number') {
        if (maxSize < room.members.length) {
          return res.status(400).json({ message: `maxSize cannot be less than current member count (${room.members.length})` });
        }
        room.maxSize = maxSize;
      }

      await room.save();

      const populated = await Room.findById(room._id)
        .populate('owner', 'username email')
        .populate('members', 'username email');

      res.json({ message: 'Room updated', room: populated });
    } catch (err) {
      console.error('Update room error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
