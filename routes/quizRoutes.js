const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz");

router.get("/", async (req, res) => {
  try {
    const { subject } = req.query;

    const filter = {};
    if (subject) filter.subject = subject;

    const quizzes = await Quiz.find(filter);
    res.json(quizzes);
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
