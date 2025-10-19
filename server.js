import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import vitalsRoutes from "./routes/vitalsRoutes.js";
dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/vitals", vitalsRoutes);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
