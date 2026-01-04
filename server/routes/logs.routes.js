const express = require("express");
const router = express.Router();
const logsController = require("../controllers/logs.controller");
const validateMode = require("../middleware/validateMode");

// ======================
// ROUTES
// ======================
router.get("/", logsController.getAllLogs);        // GET all logs
router.get("/in", logsController.getInLogs);       // GET IN logs
router.get("/out", logsController.getOutLogs);     // GET OUT logs
router.get("/summary", logsController.getSummary); // GET summary
router.get("/mode", logsController.getMode);       // GET current scan mode

router.post("/mode", validateMode, logsController.setMode); // Set scan mode
router.post("/rfid/scan", logsController.rfidScan);         // RFID scan
router.delete("/:id", logsController.deleteLog); // DELETE a log by id

module.exports = router;