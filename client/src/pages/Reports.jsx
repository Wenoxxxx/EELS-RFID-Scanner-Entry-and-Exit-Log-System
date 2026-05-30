import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

import StatCard from "../components/dashboard/StatCard";
import WeeklyLineChart from "../components/dashboard/WeeklyLineChart";
import DailySummary from "../components/reports/DailySummary";
import DailyTimeline from "../components/reports/DailyTimeline";

const API_URL = import.meta.env.VITE_API_URL + "/logs";

// =============================
// TODAY (YYYY-MM-DD) — LOCAL TIMEZONE
// =============================
const getToday = () => {
  const dt = new Date();
  // Use local timezone, format YYYY-MM-DD
  return dt.toLocaleDateString("en-CA"); 
};

export default function Reports() {
  const [logs, setLogs] = useState([]);
  const [date, setDate] = useState(getToday());
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // =============================
  // FETCH LOGS (WITH DATE FILTER)
  // =============================
  const fetchLogs = async (selectedDate, showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setSyncing(true);
      }
      const res = await fetch(`${API_URL}?date=${selectedDate}`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Reports API Error:", err.message);
    } finally {
      if (showLoader) {
        setLoading(false);
      } else {
        setSyncing(false);
      }
    }
  };

  // =============================
  // REALTIME POLLING & DATE FILTER
  // =============================
  useEffect(() => {
    fetchLogs(date, true); // fetch on date change with loader

    // Only poll if viewing today's data
    if (date === getToday()) {
      const interval = setInterval(() => fetchLogs(date, false), 2000);
      return () => clearInterval(interval);
    }
  }, [date]);

  // =============================
  // NORMALIZE BACKEND DATA
  // =============================
  const normalizedLogs = logs.map(log => {
    const dt = new Date(log.time);

    return {
      name: log.name,
      status: log.status,
      // Local time in PH timezone
      time: dt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      // Local date in PH timezone
      date: dt.toLocaleDateString("en-CA")
    };
  });

  // =============================
  // FILTER BY SELECTED DATE
  // =============================
  const filteredLogs = normalizedLogs.filter(
    log => log.date === date
  );

  const totalEntries = filteredLogs.filter(l => l.status === "IN").length;
  const totalExits = filteredLogs.filter(l => l.status === "OUT").length;
  const totalAttendees = new Set(filteredLogs.map(l => l.name)).size;

  // =============================
  // PDF EXPORT (RESPECT DATE)
  // =============================
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("EELS Daily Report", 14, 15);
    doc.text(`Date: ${date}`, 14, 25);

    doc.autoTable({
      startY: 35,
      head: [["Name", "Time", "Status"]],
      body: filteredLogs.map(l => [l.name, l.time, l.status])
    });

    doc.save(`EELS_Report_${date}.pdf`);
  };

  // =============================
  // RENDER
  // =============================
  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-black font-display tracking-tight">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Live & historical attendance data</p>
        </div>

        <div className="flex items-center gap-3">
          {/* DATE FILTER */}
          <input
            type="date"
            className="h-10 px-3 rounded-lg border border-border-soft bg-white text-black font-body text-sm outline-none focus:border-brand-purple focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)] transition-all duration-200 cursor-pointer"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <button 
            className="h-10 px-4 rounded-lg font-semibold text-sm bg-brand-purple hover:bg-brand-hover text-white transition-all duration-200 cursor-pointer" 
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-purple">
          Showing logs for <span className="text-black font-extrabold">{date}</span>
          {date === getToday() && " (Live)"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Total Entries"
            value={loading ? "—" : totalEntries}
            variant="entries"
            description="Total check-ins on this date."
          />
          <StatCard
            title="Total Exits"
            value={loading ? "—" : totalExits}
            variant="exits"
            description="Total check-outs on this date."
          />
          <StatCard
            title="Total Attendees"
            value={loading ? "—" : totalAttendees}
            variant="attendees"
            description="Unique attendees in the logs on this date."
          />
        </div>
      </div>

      {/* WEEKLY + DAILY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <div className="bg-white p-7 rounded-xl border border-border-soft shadow-sm flex flex-col">
          <h4 className="text-lg font-bold text-black font-display mb-4">Weekly Activity Overview</h4>
          <WeeklyLineChart />
        </div>

        <div className="bg-white p-7 rounded-xl border border-border-soft shadow-sm flex flex-col">
          <DailySummary logs={filteredLogs} date={date} />
        </div>
      </div>

      {/* TIMELINE */}
      <div className="bg-white p-7 rounded-xl border border-border-soft shadow-sm mt-2">
        <DailyTimeline logs={filteredLogs} />

        {syncing && date === getToday() && (
          <p className="text-xs text-gray-500 mt-4 animate-pulse">
            Syncing live logs…
          </p>
        )}
      </div>

    </div>
  );
}