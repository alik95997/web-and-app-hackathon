// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config()
// export const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ MongoDB Connected");
//   } catch (err) {
//     console.error("❌ MongoDB Error:", err.message);
//     process.exit(1);
//   }
// };

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
 await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error:", err.message));
} 
