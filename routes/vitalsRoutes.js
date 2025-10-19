import express from "express";
import Vitals from "../models/Vitals.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, async (req, res) => {
  const vital = await Vitals.create({ ...req.body, userId: req.user.id });
  res.json(vital);
});

router.get("/", protect, async (req, res) => {
  const vitals = await Vitals.find({ userId: req.user.id });
  res.json(vitals);
});

export default router;
