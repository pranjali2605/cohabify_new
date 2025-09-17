const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// For now, we'll use mock data for roommate functionality
// This can be expanded later with proper models

// @route   GET /api/roommates
// @desc    Get roommates and household data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Mock data - replace with actual database queries
    const mockData = {
      roommates: [
        {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex@example.com',
          avatar: null,
          joinedAt: new Date('2024-01-15'),
          isActive: true
        },
        {
          id: '2',
          name: 'Sarah Chen',
          email: 'sarah@example.com',
          avatar: null,
          joinedAt: new Date('2024-02-01'),
          isActive: true
        }
      ],
      chores: [
        {
          id: '1',
          title: 'Clean Kitchen',
          assignedTo: 'Alex Johnson',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          completed: false,
          priority: 'high'
        },
        {
          id: '2',
          title: 'Take Out Trash',
          assignedTo: 'Sarah Chen',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          completed: false,
          priority: 'medium'
        }
      ],
      expenses: [
        {
          id: '1',
          description: 'Groceries',
          amount: 85.50,
          paidBy: 'Alex Johnson',
          splitBetween: ['Alex Johnson', 'Sarah Chen'],
          date: new Date('2024-01-20'),
          category: 'food'
        },
        {
          id: '2',
          description: 'Internet Bill',
          amount: 60.00,
          paidBy: 'Sarah Chen',
          splitBetween: ['Alex Johnson', 'Sarah Chen'],
          date: new Date('2024-01-15'),
          category: 'utilities'
        }
      ]
    };

    res.json(mockData);
  } catch (error) {
    console.error('Get roommates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/roommates/invite
// @desc    Invite new roommate
// @access  Private
router.post('/invite', auth, [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Mock response - implement actual invitation logic
    res.status(201).json({
      message: `Invitation sent to ${email}`,
      invitation: {
        email,
        sentAt: new Date(),
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Invite roommate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/roommates/analytics
// @desc    Get household analytics
// @access  Private
router.get('/analytics', auth, async (req, res) => {
  try {
    // Mock analytics data
    const analytics = {
      totalRoommates: 2,
      activeChores: 2,
      completedChores: 8,
      totalExpenses: 145.50,
      averageExpensePerPerson: 72.75,
      monthlyExpenses: [
        { month: 'Jan', amount: 145.50 },
        { month: 'Dec', amount: 230.20 },
        { month: 'Nov', amount: 180.75 }
      ]
    };

    res.json({ analytics });
  } catch (error) {
    console.error('Get roommate analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
