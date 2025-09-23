const { validationResult } = require('express-validator');
const Habit = require('../models/Habit');

// GET /api/habits
async function getHabits(req, res) {
  try {
    const habits = await Habit.find({
      user: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json({ habits });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/habits
async function createHabit(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { title, description, category, frequency, targetCount } = req.body;

    const habit = new Habit({
      title,
      description,
      category,
      frequency,
      targetCount: targetCount || 1,
      user: req.user._id,
    });

    await habit.save();

    res.status(201).json({
      message: 'Habit created successfully',
      habit,
    });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// PUT /api/habits/:id
async function updateHabit(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const { title, description, category, frequency, targetCount } = req.body;

    if (title !== undefined) habit.title = title;
    if (description !== undefined) habit.description = description;
    if (category !== undefined) habit.category = category;
    if (frequency !== undefined) habit.frequency = frequency;
    if (targetCount !== undefined) habit.targetCount = targetCount;

    await habit.save();

    res.json({
      message: 'Habit updated successfully',
      habit,
    });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/habits/:id/complete
async function completeHabit(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCompletion = habit.completions.find((completion) => {
      const completionDate = new Date(completion.date);
      completionDate.setHours(0, 0, 0, 0);
      return completionDate.getTime() === today.getTime();
    });

    if (existingCompletion) {
      return res.status(400).json({ message: 'Habit already completed today' });
    }

    const { count = 1, notes } = req.body;

    habit.completions.push({
      date: new Date(),
      count,
      notes,
    });

    habit.updateStreak();
    await habit.save();

    res.json({
      message: 'Habit completed successfully',
      habit,
    });
  } catch (error) {
    console.error('Complete habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// DELETE /api/habits/:id
async function deleteHabit(req, res) {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    habit.isActive = false;
    await habit.save();

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/habits/analytics
async function getAnalytics(req, res) {
  try {
    const habits = await Habit.find({
      user: req.user._id,
      isActive: true,
    });

    const totalHabits = habits.length;
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.completions.length, 0);
    const averageStreak = habits.reduce((sum, habit) => sum + habit.streak.current, 0) / totalHabits || 0;
    const longestStreak = Math.max(...habits.map((habit) => habit.streak.longest), 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyCompletions = {};
    habits.forEach((habit) => {
      habit.completions.forEach((completion) => {
        if (completion.date >= thirtyDaysAgo) {
          const dateKey = completion.date.toISOString().split('T')[0];
          dailyCompletions[dateKey] = (dailyCompletions[dateKey] || 0) + 1;
        }
      });
    });

    res.json({
      analytics: {
        totalHabits,
        totalCompletions,
        averageStreak: Math.round(averageStreak * 10) / 10,
        longestStreak,
        dailyCompletions,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getHabits,
  createHabit,
  updateHabit,
  completeHabit,
  deleteHabit,
  getAnalytics,
};
