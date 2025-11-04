import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { protect } from "../middleware/authMiddleware.js";
import File from "../models/File.js";
import { Files } from "openai/resources.js";

const router = express.Router();

// ✅ Use memory storage instead of saving to "uploads/"
const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🟢 Upload a file (using buffer instead of path)
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Convert buffer to base64 for Cloudinary upload
    const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64Data, {
      resource_type: "auto",
    });

    const file = await File.create({
      userId: req.user.id,
      fileUrl: result.secure_url,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
    });

    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Get all uploaded files for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ Delete a report
router.delete("/deletereport/:id", protect, async (req, res) => {
  try {
    const deleted = await File.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Report not found or unauthorized" });
    }

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
