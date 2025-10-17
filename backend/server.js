// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import { createUsersTable } from "./models/users.js";
import { createOtpTable } from "./models/otp.js";
import { createSosTable } from "./models/sos.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Load responses.json in ESM-compatible way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const responsesPath = path.join(__dirname, "responses.json");

let responses = {};
try {
  const fileData = fs.readFileSync(responsesPath, "utf-8");
  responses = JSON.parse(fileData);
} catch (err) {
  console.error("❌ Failed to load responses.json:", err);
}

// Chat endpoint
app.post("/chat", (req, res) => {
  const userMessage = req.body?.message?.toLowerCase() || "";
  const reply = responses[userMessage] || responses["default"] || "Sorry, I didn't understand that.";
  res.json({ reply });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Initialize tables & start server
const startServer = async () => {
  try {
    await createUsersTable();
    await createOtpTable();
    await createSosTable();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server started on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error starting server:", err);
  }
};

startServer();
