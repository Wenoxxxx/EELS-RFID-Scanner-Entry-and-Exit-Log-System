const db = require("../db");

let currentScanMode = "IN";

// Utility: get today's date in YYYY-MM-DD (local timezone)
const getToday = () => {
  const dt = new Date();
  return dt.toLocaleDateString("en-CA"); // e.g. 2026-01-01
};

// =============================
// GET all logs (with optional date filter)
// =============================
exports.getAllLogs = (req, res) => {
  const { date } = req.query;
  const targetDate = date || getToday();
  
  db.query(
    "SELECT * FROM logs WHERE DATE(time) = ? ORDER BY time DESC",
    [targetDate],
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
// SUMMARY (with optional date filter)
// - If query `date=all` is provided, return totals across the whole DB
// - Otherwise default to today's date (existing behavior)
// =============================
exports.getSummary = (req, res) => {
  const { date } = req.query;

  // Overall totals across all rows
  if (date === "all") {
    db.query(
      `SELECT 
        SUM(status = 'IN') AS totalEntries,
        SUM(status = 'OUT') AS totalExits,
        COUNT(DISTINCT name) AS totalAttendees
       FROM logs`,
      (err, results) => {
        if (err) return res.status(500).json(err);
        const row = results[0] || {};
        const totalEntries = Number(row.totalEntries) || 0;
        const totalExits = Number(row.totalExits) || 0;
        const totalAttendees = Number(row.totalAttendees) || 0;
        res.json({
          totalEntries,
          totalExits,
          totalAttendees,
        });
      }
    );
    return;
  }

  const targetDate = date || getToday();
  db.query(
    `SELECT 
      SUM(status = 'IN') AS totalEntries,
      SUM(status = 'OUT') AS totalExits,
      COUNT(DISTINCT name) AS totalAttendees
     FROM logs
     WHERE DATE(time) = ?`,
    [targetDate],
    (err, results) => {
      if (err) return res.status(500).json(err);
      const row = results[0] || {};
      const totalEntries = Number(row.totalEntries) || 0;
      const totalExits = Number(row.totalExits) || 0;
      const totalAttendees = Number(row.totalAttendees) || 0;
      res.json({
        totalEntries,
        totalExits,
        totalAttendees,
      });
    }
  );
};

// =============================
// GET current scan mode
// =============================
exports.getMode = (req, res) => {
  res.json({ mode: currentScanMode });
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
  const { uid, mode } = req.body;
  if (!uid) return res.status(400).json({ message: "UID required" });

  // Use provided mode or fall back to current scan mode
  const scanMode = mode || currentScanMode;
  const today = getToday();

  // Check if this UID already has a log with the same status today
  db.query(
    "SELECT * FROM logs WHERE name = ? AND status = ? AND DATE(time) = ?",
    [uid, scanMode, today],
    (err, results) => {
      if (err) return res.status(500).json(err);

      // If already scanned with this mode today → reject
      if (results.length > 0) {
        return res
          .status(409)
          .json({ message: `Card already scanned ${scanMode} today` });
      }

      // Otherwise insert new log
      const log = {
        name: uid,
        status: scanMode,
        time: new Date().toISOString(),
      };

      db.query("INSERT INTO logs SET ?", log, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, ...log });
      });
    }
  );
};

// =============================
// DELETE a log by id
// =============================
exports.deleteLog = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM logs WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Log not found" });
    res.json({ success: true, id: Number(id) });
  });
};