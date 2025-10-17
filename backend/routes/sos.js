import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
    console.log("SOS route hit", req.body);

  try {
    const { user_id, latitude, longitude, photo_url } = req.body;

    if (!user_id || !latitude || !longitude) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      "INSERT INTO sos_alerts (user_id, latitude, longitude, photo_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, latitude, longitude, photo_url]
    );

    res.json({ message: "SOS alert stored", sos: result.rows[0] });
  } catch (err) {
    console.error("Error creating SOS:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
