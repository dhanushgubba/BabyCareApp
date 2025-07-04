const mongoose = require('mongoose');

const CryHistorySchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  emotions: {
    hungry: {
      type: Number,
      required: true,
    },
    tired: {
      type: Number,
      required: true,
    },
    uncomfortable: {
      type: Number,
      required: true,
    },
    needsAttention: {
      type: Number,
      required: true,
    },
  },
  confidence: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  recommendation: {
    type: String,
    required: true,
  },
  audioUrl: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'ta', 'te', 'bn'],
    default: 'en',
  },
});

module.exports = mongoose.model('CryHistory', CryHistorySchema);
