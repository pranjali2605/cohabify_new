const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: [true, 'Mood is required'],
    enum: ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'],
  },
  intensity: {
    type: Number,
    required: true,
    min: [1, 'Intensity must be between 1 and 5'],
    max: [5, 'Intensity must be between 1 and 5']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
moodSchema.index({ user: 1, date: -1 });
moodSchema.index({ user: 1, mood: 1 });

module.exports = mongoose.model('Mood', moodSchema);
