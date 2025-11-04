import dotenv from "dotenv";
dotenv.config();
import express from "express";
import axios from "axios";
import { protect } from "../middleware/authMiddleware.js";
import AiInsight from "../models/AiInsight.js";

const router = express.Router();

// 🔹 POST /api/ai/analyze
router.post("/analyze", protect, async (req, res) => {
  try {
    const { fileUrl, fileId } = req.body;
    if (!fileUrl || !fileId)
      return res
        .status(400)
        .json({ message: "fileUrl and fileId are required" });

    const prompt = `
      Analyze this medical report (${fileUrl}) and provide:
      1. Simple English summary
      2. Roman Urdu summary
      3. 3 doctor questions
      4. Food advice
      5. Remedies
    `;

    // ✅ Correct Gemini endpoint + key
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(geminiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI did not return any text.";

    // ✅ Save insight in MongoDB
    const insight = await AiInsight.create({
      fileId,
      summaryEnglish: text,
      summaryUrdu: "Roman Urdu summary generated later.",
      doctorQuestions: [
        "What are the causes?",
        "Any medication needed?",
        "When to retest?",
      ],
      foodAdvice: "Avoid junk food and drink plenty of water.",
      remedies: "Rest well and stay hydrated.",
    });

    res.json(insight);
  } catch (err) {
    console.error("AI error:", err.response?.data || err.message);
    res
      .status(500)
      .json({ error: err.response?.data?.error?.message || err.message });
  }
});

// 🔹 GET /api/ai/:fileId — works for both fileId and AI _id
router.get("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by fileId, if not found, try by _id
    const insight =
      (await AiInsight.findOne({ fileId: id })) ||
      (await AiInsight.findById(id));

    if (!insight)
      return res.status(404).json({ message: "AI insight not found" });

    res.json(insight);
  } catch (err) {
    console.error("AI GET error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;