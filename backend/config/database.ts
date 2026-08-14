import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";
import { DatabaseConfig } from "../types/index.js";

dotenv.config();

const config: DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "crud_app",
  port: parseInt(process.env.DB_PORT || "3306", 10),
};

const pool: Pool = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

pool
  .getConnection()
  .then((conn) => {
    console.log("✅ MySQL connected");
    conn.release();
  })
  .catch((err: Error) => {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  });

export default pool;
