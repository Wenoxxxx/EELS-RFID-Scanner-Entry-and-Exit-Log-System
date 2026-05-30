export default function DailySummary({ logs, date }) {

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 text-sm font-body">
        No activity recorded for {date}
      </div>
    );
  }

  const sortedLogs = [...logs].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  const firstEntry = sortedLogs.find(l => l.status === "IN");
  const lastExit = [...sortedLogs].reverse().find(l => l.status === "OUT");

  const totalLogs = logs.length;

  return (
    <div className="flex flex-col h-full">
      <h4 className="text-lg font-bold text-black font-display mb-4">Daily Summary</h4>

      <ul className="flex flex-col flex-1 justify-center">
        <li className="flex justify-between items-center py-4 border-b border-border-soft">
          <span className="text-sm font-medium text-gray-500">First Entry</span>
          <strong className="text-sm font-bold text-black font-display">{firstEntry ? firstEntry.time : "—"}</strong>
        </li>

        <li className="flex justify-between items-center py-4 border-b border-border-soft">
          <span className="text-sm font-medium text-gray-500">Last Exit</span>
          <strong className="text-sm font-bold text-black font-display">{lastExit ? lastExit.time : "—"}</strong>
        </li>

        <li className="flex justify-between items-center py-4">
          <span className="text-sm font-medium text-gray-500">Total Logs</span>
          <strong className="text-sm font-bold text-black font-display">{totalLogs}</strong>
        </li>
      </ul>
    </div>
  );
}

