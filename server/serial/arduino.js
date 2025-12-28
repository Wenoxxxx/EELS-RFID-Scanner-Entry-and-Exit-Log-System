const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const axios = require("axios");

// ======================
// CONFIG: SET SCAN MODE
// ======================
// Change this to "OUT" when using Scan OUT
const SCAN_MODE = "IN"; // "IN" | "OUT"

// ======================
// SERIAL PORT SETUP
// ======================
const port = new SerialPort({
  path: "COM5",      // confirm in Device Manager
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

console.log(`📡 Listening to Arduino on COM5 (MODE: ${SCAN_MODE})...`);

// ======================
// HANDLE RFID DATA
// ======================
parser.on("data", async (line) => {
  const uid = line.trim();

  if (!uid || uid === "RFID_READY") return;

  console.log("📥 RFID UID:", uid);

  try {
    const res = await axios.post(
      "http://localhost:3000/api/logs/rfid/scan",
      {
        uid,
        mode: SCAN_MODE, // 🔥 EXPLICIT MODE
      }
    );

    console.log(`✅ RFID ${SCAN_MODE} SAVED:`, res.data);
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
