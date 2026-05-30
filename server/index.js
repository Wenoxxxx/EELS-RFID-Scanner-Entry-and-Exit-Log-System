const express = require("express");
const cors = require("cors");
const logsRoutes = require("./routes/logs.routes");

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// ROUTES
// =====================
app.use("/api/logs", logsRoutes);

// =====================
// HEALTH CHECK
// =====================
app.get("/health", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

// =====================
// ERROR HANDLER
// =====================
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// =====================
// SERVER
// =====================
const PORT = 3000;
app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 Express API is running");
  console.log(`📡 http://localhost:${PORT}`);
  console.log("=================================");
});