const API_BASE ="https://localhost:3000/api";

export async function scanLog(name, status) {
    const res = await fetch(`${API_BASE}/logs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, status }),
    });

    return res.json();
}

export async function fetchInLogs() {
    const res = await fetch(`${API_BASE}/logs/in`);
    return res.json();
}

export async function fetchOutLogs() {
    const res = await fetch(`${API_BASE}/logs/out`);
    return res.json();
}