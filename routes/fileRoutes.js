import express from "express";
import multer from "multer";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";
import { protect } from "../middleware/authMiddleware.js";
import File from "../models/File.js";

const router = express.Router();

// Memory storage avoids disk issues
const upload = multer({ storage: multer.memoryStorage() });


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "uploads" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};


router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await streamUpload(req.file.buffer);

    const file = await File.create({
      userId: req.user.id,
      fileUrl: result.secure_url,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
    });

    res.json(file);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/", protect, async (req, res) => {
  const files = await File.find({ userId: req.user.id });
  res.json(files);
});

export default router;
