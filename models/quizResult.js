const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  userId: { type: String, default: "guest" }, // optional: can expand later
  subject: String,
  score: Number,
  total: Number,
  chapterStats: Object, // { chapterName: { correct, total } }
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("QuizResult", quizResultSchema);
