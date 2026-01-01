const db = require("../db");

let currentScanMode = "IN";

// Utility: get today's date in YYYY-MM-DD (local timezone)
const getToday = () => {
  const dt = new Date();
  return dt.toLocaleDateString("en-CA"); // e.g. 2026-01-01
};

// =============================
// GET all logs (only today)
// =============================
exports.getAllLogs = (req, res) => {
  const today = getToday();
  db.query(
    "SELECT * FROM logs WHERE DATE(time) = ? ORDER BY time DESC",
    [today],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// =============================
// GET IN logs (only today)
// =============================
exports.getInLogs = (req, res) => {
  const today = getToday();
  db.query(
    "SELECT * FROM logs WHERE status = 'IN' AND DATE(time) = ? ORDER BY time DESC",
    [today],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// =============================
// GET OUT logs (only today)
// =============================
exports.getOutLogs = (req, res) => {
  const today = getToday();
  db.query(
    "SELECT * FROM logs WHERE status = 'OUT' AND DATE(time) = ? ORDER BY time DESC",
    [today],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// =============================
// SUMMARY (only today)
// =============================
exports.getSummary = (req, res) => {
  const today = getToday();
  db.query(
    `SELECT 
      SUM(status = 'IN') AS totalEntries,
      SUM(status = 'OUT') AS totalExits
     FROM logs
     WHERE DATE(time) = ?`,
    [today],
    (err, results) => {
      if (err) return res.status(500).json(err);
      const { totalEntries, totalExits } = results[0];
      res.json({
        totalEntries,
        totalExits,
        totalAttendees: totalEntries - totalExits,
      });
    }
  );
};

// =============================
// SET scan mode
// =============================
exports.setMode = (req, res) => {
  const { mode } = req.body;
  currentScanMode = mode;
  console.log(`Scan mode set to ${mode}`);
  res.json({ mode });
};

// =============================
// RFID scan (allow one IN and one OUT per day)
// =============================
exports.rfidScan = (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ message: "UID required" });

  const today = getToday();

  // Check if this UID already has a log with the same status today
  db.query(
    "SELECT * FROM logs WHERE name = ? AND status = ? AND DATE(time) = ?",
    [uid, currentScanMode, today],
    (err, results) => {
      if (err) return res.status(500).json(err);

      // If already scanned with this mode today → reject
      if (results.length > 0) {
        return res
          .status(409)
          .json({ message: `Card already scanned ${currentScanMode} today` });
      }

      // Otherwise insert new log
      const log = {
        name: uid,
        status: currentScanMode,
        time: new Date().toISOString(),
      };

      db.query("INSERT INTO logs SET ?", log, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, ...log });
      });
    }
  );
};