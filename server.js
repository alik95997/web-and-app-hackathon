
import dotenv from "dotenv";
import cloudinary from "./config/cloudinary.js"
dotenv.config();
import express, { urlencoded } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import vitalsRoutes from "./routes/vitalsRoutes.js";
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/vitals", vitalsRoutes);

const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
}

export default app
