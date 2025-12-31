const db = require("../db");

let currentScanMode = "IN";

// GET all logs
exports.getAllLogs = (req, res) => {
  db.query("SELECT * FROM logs ORDER BY time DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// GET IN logs
exports.getInLogs = (req, res) => {
  db.query("SELECT * FROM logs WHERE status = 'IN' ORDER BY time DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// GET OUT logs
exports.getOutLogs = (req, res) => {
  db.query("SELECT * FROM logs WHERE status = 'OUT' ORDER BY time DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// SUMMARY
exports.getSummary = (req, res) => {
  db.query(
    `SELECT 
      SUM(status = 'IN') AS totalEntries,
      SUM(status = 'OUT') AS totalExits 
     FROM logs`,
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

// SET scan mode
exports.setMode = (req, res) => {
  const { mode } = req.body;
  currentScanMode = mode;
  console.log(`Scan mode set to ${mode}`);
  res.json({ mode });
};

// RFID scan
exports.rfidScan = (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ message: "UID required" });

  db.query(
    "SELECT * FROM logs WHERE name = ? ORDER BY time DESC LIMIT 1",
    [uid],
    (err, results) => {
      if (err) return res.status(500).json(err);
      const lastLog = results[0];
      if (lastLog && lastLog.status === currentScanMode) {
        return res.status(200).json({ message: "Duplicate ignored" });
      }

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