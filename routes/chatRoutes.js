const express = require("express");
const router = express.Router();
const axios = require("axios");

const HF_API_TOKEN = process.env.HUGGINGFACE_API_KEY;

const model = "bigscience/bloomz-560m";
const apiURL = `https://api-inference.huggingface.co/models/${model}`;

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const hfResponse = await axios.post(
      apiURL,
      {
        inputs: message,
        parameters: {
          temperature: 0.6,
          max_new_tokens: 80,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
        },
      }
    );

    const reply = hfResponse.data?.[0]?.generated_text?.trim();
    res.json({ reply: reply || "Sorry, I couldn't generate a reply." });
  } catch (err) {
    console.error("🔥 HuggingFace Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong with Hugging Face" });
  }
});

module.exports = router;
