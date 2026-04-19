const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String },
  flashcards: [{
    question: String,
    answer: String
  }],
  quiz: [{
    question: String,
    options: [String],
    correct: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
