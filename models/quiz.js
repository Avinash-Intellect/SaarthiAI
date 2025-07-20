const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  subject: String,
  chapter: String,
  question: String,
  options: [String],
  answerIndex: Number,
  explanation: String
});

module.exports = mongoose.model('quizzes', quizSchema);

