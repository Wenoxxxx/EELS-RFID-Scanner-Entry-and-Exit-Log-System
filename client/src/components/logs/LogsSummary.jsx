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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
      <div className="bg-white p-6 rounded-xl border border-border-soft shadow-sm border-l-4 border-l-in-green">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Total Entries</p>
        <h2 className="text-3xl font-extrabold text-black font-display tracking-tight">{summary.totalEntries}</h2>
      </div>

      <div className="bg-white p-6 rounded-xl border border-border-soft shadow-sm border-l-4 border-l-out-orange">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Total Exits</p>
        <h2 className="text-3xl font-extrabold text-black font-display tracking-tight">{summary.totalExits}</h2>
      </div>

      <div className="bg-white p-6 rounded-xl border border-border-soft shadow-sm border-l-4 border-l-attendees-purple">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Total Attendees</p>
        <h2 className="text-3xl font-extrabold text-black font-display tracking-tight">{summary.totalAttendees}</h2>
      </div>
    </div>
  );
}
