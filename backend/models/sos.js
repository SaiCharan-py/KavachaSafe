import { pool } from "../db.js";

export const createSosTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS sos_alerts (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL,
      photo_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log("SOS Alerts table created successfully!");
};
