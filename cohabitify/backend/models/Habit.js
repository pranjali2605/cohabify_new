const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Habit title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['health', 'productivity', 'learning', 'fitness', 'mindfulness', 'social', 'other'],
    default: 'other'
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required'],
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  targetCount: {
    type: Number,
    default: 1,
    min: [1, 'Target count must be at least 1']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    }
  },
  completions: [{
    date: {
      type: Date,
      required: true
    },
    count: {
      type: Number,
      default: 1
    },
    notes: {
      type: String,
      maxlength: [200, 'Notes cannot exceed 200 characters']
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
habitSchema.index({ user: 1, isActive: 1 });
habitSchema.index({ 'completions.date': 1 });

// Calculate streak before saving
habitSchema.methods.updateStreak = function() {
  if (this.completions.length === 0) {
    this.streak.current = 0;
    return;
  }

  const sortedCompletions = this.completions
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedCompletions.length; i++) {
    const completionDate = new Date(sortedCompletions[i].date);
    completionDate.setHours(0, 0, 0, 0);
    
    if (i === 0) {
      // Check if most recent completion is today or yesterday
      const daysDiff = Math.floor((today - completionDate) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 1) {
        currentStreak = 1;
        tempStreak = 1;
      }
    } else {
      const prevDate = new Date(sortedCompletions[i - 1].date);
      prevDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((prevDate - completionDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        tempStreak++;
        if (i === 1) currentStreak = tempStreak;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
        if (i === 1) currentStreak = 0;
      }
    }
  }
  
  longestStreak = Math.max(longestStreak, tempStreak);
  this.streak.current = currentStreak;
  this.streak.longest = Math.max(this.streak.longest, longestStreak);
};

module.exports = mongoose.model('Habit', habitSchema);
