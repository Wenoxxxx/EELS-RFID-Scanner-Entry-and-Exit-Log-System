const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const axios = require("axios");

// ======================
// CONFIG: API BASE
// ======================
const API_BASE = "http://localhost:3000/api/logs";

// ======================
// SERIAL PORT SETUP
// ======================
const port = new SerialPort({
  path: "COM5",      // confirm in Device Manager
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

console.log(`📡 Listening to Arduino on COM5...`);
console.log(`🔄 Scan mode will be fetched from frontend buttons`);

// ======================
// GET CURRENT SCAN MODE FROM BACKEND
// ======================
const getCurrentMode = async () => {
  try {
    const res = await axios.get(`${API_BASE}/mode`);
    currentScanMode = res.data.mode;
    return currentScanMode;
  } catch (err) {
    console.error("Failed to fetch mode:", err.message);
    return currentScanMode; // fallback to last known mode
  }
};

// Store the current mode that the backend tells us
let currentScanMode = "IN";

// ======================
// HANDLE RFID DATA
// ======================
parser.on("data", async (line) => {
  const uid = line.trim();

  if (!uid || uid === "RFID_READY") return;

  console.log("📥 RFID UID:", uid);

  try {
    // Get the current mode from backend
    const mode = await getCurrentMode();
    
    const res = await axios.post(
      `${API_BASE}/rfid/scan`,
      {
        uid,
        mode, // Let backend know what mode we're using
      }
    );

    console.log(`✅ RFID ${mode} SAVED:`, res.data);
  } catch (err) {
    if (err.response) {
      console.error(
        "API ERROR:",
        err.response.status,
        err.response.data
      );
    } else {
      console.error("❌ CONNECTION ERROR:", err.message);
    }
  }
});
