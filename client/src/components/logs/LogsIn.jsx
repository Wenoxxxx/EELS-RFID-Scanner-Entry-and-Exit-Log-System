import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LogsTable from "./LogsTable";

const API_BASE = import.meta.env.VITE_API_URL;

export default function LogsIn() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const fetchLogs = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);

      const res = await fetch(`${API_BASE}/logs/in`);
      if (!res.ok) throw new Error("Failed to fetch IN logs");

      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("API Error:", err.message);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load + when route becomes active
    fetchLogs(true);

    // Auto-refresh every 2 seconds (only when tab is visible)
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchLogs(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <>
      {loading ? <p>Loading IN logs...</p> : <LogsTable logs={logs} setLogs={setLogs} />}
    </>
  );
}