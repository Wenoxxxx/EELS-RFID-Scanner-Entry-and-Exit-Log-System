require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("MySQL connected");

  // Test query to confirm connection and schema
  db.query("SHOW TABLES", (err, results) => {
    if (err) {
      console.error("Query failed:", err.message);
    } else {
      console.log("Tables in eels-logs:", results);
    }
  });
});

module.exports = db;