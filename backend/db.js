import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Optional test connection
pool.connect()
  .then(() => console.log("Connected to PostgreSQL successfully!"))
  .catch((err) => console.error("Connection error", err));
