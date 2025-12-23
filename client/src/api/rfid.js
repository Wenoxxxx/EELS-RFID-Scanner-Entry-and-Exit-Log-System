const API_URL = "http://localhost:3000/api/logs";

//  Called when user clicks Scan IN / Scan OUT
export async function setScanMode(mode) {
  await fetch(`${API_URL}/mode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode }),
  });
}

//  Called when RFID UID is received (hardware or manual)
export async function scanRFID(uid) {
  if (!uid) throw new Error("UID required");

  const res = await fetch(`${API_URL}/rfid/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.json();
}
