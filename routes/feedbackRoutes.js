// routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();
const QuizResult = require("../models/quizResult");

// POST /api/quiz-feedback
router.post("/", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const results = await QuizResult.find({ userId });

    const topicStats = {};

    // Aggregate scores per chapter
    results.forEach(result => {
      const chapters = result.chapterStats || {};
      for (const [chapter, stats] of Object.entries(chapters)) {
        if (!topicStats[chapter]) {
          topicStats[chapter] = { correct: 0, total: 0 };
        }
        topicStats[chapter].correct += stats.correct;
        topicStats[chapter].total += stats.total;
      }
    });

    // Analyze performance
    const weakTopics = [];
    const strongTopics = [];
    const suggestedTopics = [];

    for (const [chapter, { correct, total }] of Object.entries(topicStats)) {
      const accuracy = (correct / total) * 100;
      if (accuracy < 50) {
        weakTopics.push(chapter);
        suggestedTopics.push(chapter);
      } else if (accuracy >= 80) {
        strongTopics.push(chapter);
      } else {
        suggestedTopics.push(chapter);
      }
    }

    res.json({
      weakTopics,
      strongTopics,
      suggestedTopics
    });

  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ error: "Failed to analyze quiz feedback" });
  }
});

module.exports = router;
