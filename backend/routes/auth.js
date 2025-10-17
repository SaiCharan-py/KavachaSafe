import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

dotenv.config();
const router = express.Router();

// Nodemailer transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  try {
    // Insert or update OTP
    await pool.query(
      "INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET otp = $2, expires_at = $3",
      [email, otp, expiresAt]
    );

    // Create user if not exists
    await pool.query(
      "INSERT INTO users (email, is_verified) VALUES ($1, false) ON CONFLICT (email) DO NOTHING",
      [email]
    );

    // Send OTP email
    await transporter.sendMail({
      from: `"KavachaSafe" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your KavachaSafe OTP Code",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });

  try {
    const otpRes = await pool.query("SELECT * FROM otps WHERE email=$1", [email]);
    const record = otpRes.rows[0];
    if (!record) return res.status(400).json({ success: false, message: "OTP not found" });

    if (record.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (new Date() > new Date(record.expires_at)) return res.status(400).json({ success: false, message: "OTP expired" });

    // Mark user verified
    await pool.query("UPDATE users SET is_verified=true WHERE email=$1", [email]);
    await pool.query("DELETE FROM otps WHERE email=$1", [email]); // Cleanup

    // Issue JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, token });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

// ✅ Direct login (if already verified)
router.post("/login", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email required" });

  try {
    const userRes = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = userRes.rows[0];
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    if (!user.is_verified)
      return res.json({ success: false, message: "User not verified. Please request OTP." });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

export default router;
