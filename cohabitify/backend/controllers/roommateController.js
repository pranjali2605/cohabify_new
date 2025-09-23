const { validationResult } = require('express-validator');

// NOTE: Roommates currently use mock data in routes. Keeping same responses here.

// GET /api/roommates
async function getRoommates(req, res) {
  try {
    const mockData = {
      roommates: [
        {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex@example.com',
          avatar: null,
          joinedAt: new Date('2024-01-15'),
          isActive: true,
        },
        {
          id: '2',
          name: 'Sarah Chen',
          email: 'sarah@example.com',
          avatar: null,
          joinedAt: new Date('2024-02-01'),
          isActive: true,
        },
      ],
      chores: [
        {
          id: '1',
          title: 'Clean Kitchen',
          assignedTo: 'Alex Johnson',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          completed: false,
          priority: 'high',
        },
        {
          id: '2',
          title: 'Take Out Trash',
          assignedTo: 'Sarah Chen',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          completed: false,
          priority: 'medium',
        },
      ],
      expenses: [
        {
          id: '1',
          description: 'Groceries',
          amount: 85.5,
          paidBy: 'Alex Johnson',
          splitBetween: ['Alex Johnson', 'Sarah Chen'],
          date: new Date('2024-01-20'),
          category: 'food',
        },
        {
          id: '2',
          description: 'Internet Bill',
          amount: 60.0,
          paidBy: 'Sarah Chen',
          splitBetween: ['Alex Johnson', 'Sarah Chen'],
          date: new Date('2024-01-15'),
          category: 'utilities',
        },
      ],
    };

    res.json(mockData);
  } catch (error) {
    console.error('Get roommates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/roommates/invite
async function inviteRoommate(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { email } = req.body;

    // Mock response - implement actual invitation logic later
    res.status(201).json({
      message: `Invitation sent to ${email}`,
      invitation: {
        email,
        sentAt: new Date(),
        status: 'pending',
      },
    });
  } catch (error) {
    console.error('Invite roommate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/roommates/analytics
async function getRoommateAnalytics(req, res) {
  try {
    const analytics = {
      totalRoommates: 2,
      activeChores: 2,
      completedChores: 8,
      totalExpenses: 145.5,
      averageExpensePerPerson: 72.75,
      monthlyExpenses: [
        { month: 'Jan', amount: 145.5 },
        { month: 'Dec', amount: 230.2 },
        { month: 'Nov', amount: 180.75 },
      ],
    };

    res.json({ analytics });
  } catch (error) {
    console.error('Get roommate analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getRoommates, inviteRoommate, getRoommateAnalytics };
