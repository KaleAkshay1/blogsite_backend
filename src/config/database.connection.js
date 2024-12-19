import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "Akshay#123",
  database: process.env.DATABASE_NAME || "blogDB",
  waitForConnections: true,
});

export default pool;
