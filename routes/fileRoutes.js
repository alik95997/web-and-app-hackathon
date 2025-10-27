import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { protect } from "../middleware/authMiddleware.js";
import File from "../models/File.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🟢 Upload a file
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
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

export default router;
