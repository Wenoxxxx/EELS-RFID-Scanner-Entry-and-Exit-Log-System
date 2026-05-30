import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL + "/logs";

export default function LogsSummary() {
  const [summary, setSummary] = useState({
    totalEntries: 0,
    totalExits: 0,
    totalAttendees: 0,
  });

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_URL}/summary`);
      if (!res.ok) throw new Error("Failed to fetch summary");
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="stats-grid">
      <div className="card">
        <p>Total Entries</p>
        <h2>{summary.totalEntries}</h2>
      </div>

      <div className="card">
        <p>Total Exits</p>
        <h2>{summary.totalExits}</h2>
      </div>

      <div className="card">
        <p>Total Attendees</p>
        <h2>{summary.totalAttendees}</h2>
      </div>
    </div>
  );
}
