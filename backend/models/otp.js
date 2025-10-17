import { pool } from "../db.js";

export const createOtpTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS otps (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) NOT NULL,
      otp VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL
    );
  `;
  await pool.query(query);
};
