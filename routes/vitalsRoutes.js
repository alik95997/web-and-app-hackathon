import express from "express";
import Vitals from "../models/Vitals.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Add new vitals
router.post("/add", protect, async (req, res) => {
  try {
    const vital = await Vitals.create({ ...req.body, userId: req.user.id });
    res.json(vital);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Get all vitals for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const vitals = await Vitals.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(vitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟡 Update vitals (Edit)
router.put("/:id", protect, async (req, res) => {
  try {
    const vital = await Vitals.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!vital) return res.status(404).json({ message: "Vital not found" });
    res.json(vital);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔴 Delete vitals
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Vitals.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Vital not found" });
    res.json({ message: "Vital deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
