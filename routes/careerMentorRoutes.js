// routes/careerMentorRoutes.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// POST /api/career-mentor
router.post("/", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  const prompt = `
You are a career mentor for rural and beginner students in India.
The student says: "${question}"
Give a career roadmap in 3–5 bullet points.
Keep the language simple and supportive.
Avoid suggesting paid platforms. Use free tools and skills.
`;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "mistral", // You can also use phi3, llama3, etc.
      prompt,
      stream: false
    });

    const reply = response.data?.response?.trim();
    res.json({ reply: reply || "Sorry, I couldn’t generate advice." });
  } catch (err) {
    console.error("Career Mentor Error:", err.message);
    res.status(500).json({ error: "Something went wrong with the AI mentor." });
  }
});

module.exports = router;
