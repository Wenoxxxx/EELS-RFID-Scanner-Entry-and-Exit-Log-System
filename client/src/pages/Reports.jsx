import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

import WeeklyLineChart from "../components/dashboard/WeeklyLineChart";
import DailySummary from "../components/reports/DailySummary";
import DailyTimeline from "../components/reports/DailyTimeline";

import "./Reports.css";

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

  // =============================
  // FETCH LOGS (WITH DATE FILTER)
  // =============================
  const fetchLogs = async (selectedDate) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}?date=${selectedDate}`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Reports API Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // REALTIME POLLING & DATE FILTER
  // =============================
  useEffect(() => {
    fetchLogs(date); // fetch on date change

    // Only poll if viewing today's data
    if (date === getToday()) {
      const interval = setInterval(() => fetchLogs(date), 2000);
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
    <div className="reports-page">

      {/* HEADER */}
      <div className="stats-header">
        <div>
          <h1>Reports</h1>
          <p className="subtitle">Live & historical attendance data</p>
        </div>

        <div className="stats-controls">
          {/* DATE FILTER (KEPT) */}
          <input
            type="date"
            className="date-input"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <button className="btn-eels" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="date-summary">
        <p className="selected-date">
          Showing logs for <strong>{date}</strong>
          {date === getToday() && " (Live)"}
        </p>

        <div className="stats-grid">
          <div className="stat-card green">
            <p>Total Entries</p>
            <h3>{totalEntries}</h3>
          </div>

          <div className="stat-card orange">
            <p>Total Exits</p>
            <h3>{totalExits}</h3>
          </div>

          <div className="stat-card purple">
            <p>Total Attendees</p>
            <h3>{totalAttendees}</h3>
          </div>
        </div>
      </div>

      {/* WEEKLY + DAILY */}
      <div className="reports-grid">
        <div className="report-card">
          <h4 className="card-title">Weekly Activity Overview</h4>
          <WeeklyLineChart />
        </div>

        <div className="report-card">
          <DailySummary logs={filteredLogs} date={date} />
        </div>
      </div>

      {/* TIMELINE */}
      <div className="report-card full-width">
        <DailyTimeline logs={filteredLogs} />

        {loading && date === getToday() && (
          <p style={{ marginTop: 12 }}>
            Syncing live logs…
          </p>
        )}
      </div>

    </div>
  );
}