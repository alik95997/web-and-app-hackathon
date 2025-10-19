import mongoose from "mongoose";

const aiInsightSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  summaryEnglish: String,
  summaryUrdu: String,
  doctorQuestions: [String],
  foodAdvice: String,
  remedies: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("AiInsight", aiInsightSchema);
