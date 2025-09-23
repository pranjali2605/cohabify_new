const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: 'My Room'
  },
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  maxSize: {
    type: Number,
    enum: [2,3,4,5],
    default: 5,
  },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
