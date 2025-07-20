const express = require("express");
const router = express.Router();
const QuizResult = require("../models/quizResult");

router.post("/", async (req, res) => {
  try {
    console.log("Received payload:", req.body);
    const result = new QuizResult(req.body);
    const saved = await result.save();
    console.log("Saved to MongoDB:", saved);
    res.status(201).json({ success: true, id: saved._id });
  } catch (err) {
    console.error("Quiz result save error:", err);
    res.status(500).json({ error: err.message });
  }
});

// router.get("/test", (req, res) => {
//   res.send("Quiz result route is working ✅");
// });


module.exports = router;
