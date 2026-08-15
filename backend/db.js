import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log("========== DATABASE CONFIG ==========");
console.log("HOST:", process.env.DB_HOST);
console.log("USER:", process.env.DB_USER);
console.log("DATABASE:", process.env.DB_NAME);
console.log("PORT:", process.env.DB_PORT);
console.log("PASSWORD EXISTS:", !!process.env.DB_PASSWORD);
console.log("=====================================");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
