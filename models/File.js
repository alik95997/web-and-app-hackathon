import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: String,
  fileName: String,
  fileType: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("File", fileSchema);
