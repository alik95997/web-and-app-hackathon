import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ✅ Register
router.post("/register", async (req, res) => {
  try {
    const { fullname, email, password, gender, dob } = req.body;

    if (!fullname || !email || !password)
      return res.status(400).json({ message: "Required fields are missing" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      password: hashPassword,
      gender,
      dob,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, fullname: newUser.fullname, email: newUser.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Required fields are missing" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      message: "User successfully logged in",
      token,
      user: { id: user._id, fullname: user.fullname, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
