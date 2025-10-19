import express from "express";
import axios from "axios";
import AiInsight from "../models/AiInsight.js";
const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { fileUrl, fileId } = req.body;

    const prompt = `
      Analyze this medical report and provide:
      - Simple English summary
      - Roman Urdu summary
      - 3 doctor questions
      - Food advice
      - Remedies
      File: ${fileUrl}
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
console.log(response.data)
    const text = response.data.candidates[0].content.parts[0].text;
    const ai = await AiInsight.create({ fileId, summaryEnglish: text });
    res.json(ai);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
