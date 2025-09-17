const express = require('express');
const { body, validationResult } = require('express-validator');
const Mood = require('../models/Mood');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/moods
// @desc    Get all moods for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    
    let query = { user: req.user._id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const moods = await Mood.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({ moods });
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { mood, intensity, notes, tags, date } = req.body;

    const moodEntry = new Mood({
      user: req.user._id,
      mood,
      intensity,
      notes,
      tags: tags || [],
      date: date ? new Date(date) : new Date()
    });

    await moodEntry.save();

    res.status(201).json({
      message: 'Mood logged successfully',
      mood: moodEntry
    });
  } catch (error) {
    console.error('Log mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const mood = await Mood.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    const { mood: moodValue, intensity, notes, tags } = req.body;

    if (moodValue !== undefined) mood.mood = moodValue;
    if (intensity !== undefined) mood.intensity = intensity;
    if (notes !== undefined) mood.notes = notes;
    if (tags !== undefined) mood.tags = tags;

    await mood.save();

    res.json({
      message: 'Mood updated successfully',
      mood
    });
  } catch (error) {
    console.error('Update mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/moods/:id
// @desc    Delete mood entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const mood = await Mood.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    await Mood.findByIdAndDelete(req.params.id);

    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    console.error('Delete mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/moods/analytics
// @desc    Get mood analytics
// @access  Private
router.get('/analytics', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const moods = await Mood.find({
      user: req.user._id,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Calculate mood distribution
    const moodCounts = {
      very_sad: 0,
      sad: 0,
      neutral: 0,
      happy: 0,
      very_happy: 0
    };

    let totalIntensity = 0;
    const dailyMoods = {};

    moods.forEach(mood => {
      moodCounts[mood.mood]++;
      totalIntensity += mood.intensity;
      
      const dateKey = mood.date.toISOString().split('T')[0];
      if (!dailyMoods[dateKey]) {
        dailyMoods[dateKey] = [];
      }
      dailyMoods[dateKey].push({
        mood: mood.mood,
        intensity: mood.intensity
      });
    });

    const averageIntensity = moods.length > 0 ? totalIntensity / moods.length : 0;

    // Calculate mood trends
    const moodValues = {
      very_sad: 1,
      sad: 2,
      neutral: 3,
      happy: 4,
      very_happy: 5
    };

    const weeklyTrends = [];
    for (let i = 0; i < parseInt(days); i += 7) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - i - 6);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - i);

      const weekMoods = moods.filter(mood => 
        mood.date >= weekStart && mood.date <= weekEnd
      );

      if (weekMoods.length > 0) {
        const weekAverage = weekMoods.reduce((sum, mood) => 
          sum + moodValues[mood.mood], 0
        ) / weekMoods.length;

        weeklyTrends.unshift({
          week: `${weekStart.toISOString().split('T')[0]} to ${weekEnd.toISOString().split('T')[0]}`,
          average: Math.round(weekAverage * 10) / 10,
          count: weekMoods.length
        });
      }
    }

    res.json({
      analytics: {
        totalEntries: moods.length,
        averageIntensity: Math.round(averageIntensity * 10) / 10,
        moodDistribution: moodCounts,
        dailyMoods,
        weeklyTrends
      }
    });
  } catch (error) {
    console.error('Get mood analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
