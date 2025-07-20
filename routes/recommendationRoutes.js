const express = require("express");
const router = express.Router();
const Resource = require("../models/resource");

function scoreMatch(resource, completed) {
  let score = 0;
  completed.forEach(done => {
    if (done.subject === resource.subject) score += 1;
    if (done.language === resource.language) score += 1;
    if (done.level === resource.level) score += 1;
    if (done.chapter === resource.chapter) score += 2;
  });
  return score;
}

router.post("/", async (req, res) => {
  const { subject, completedIds } = req.body;

  try {
    const all = await Resource.find({ subject });

    const completed = all.filter(r => completedIds.includes(r._id.toString()));
    const remaining = all.filter(r => !completedIds.includes(r._id.toString()));

    const scored = remaining
      .map(r => ({ ...r._doc, score: scoreMatch(r, completed) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.json(scored);
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ error: "Recommendation engine failed" });
  }
});

module.exports = router;
