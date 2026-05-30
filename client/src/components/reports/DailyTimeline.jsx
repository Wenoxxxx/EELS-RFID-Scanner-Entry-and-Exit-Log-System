export default function DailyTimeline({ logs }) {

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 text-sm font-body">
        No logs for this date
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h4 className="text-lg font-bold text-black font-display mb-4">Daily Timeline</h4>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-2">
          <thead>
            <tr>
              <th className="bg-gray-50 text-gray-500 font-display font-bold text-[10px] uppercase tracking-wider px-4 py-3 border-b border-gray-200 text-left">Time</th>
              <th className="bg-gray-50 text-gray-500 font-display font-bold text-[10px] uppercase tracking-wider px-4 py-3 border-b border-gray-200 text-left">Name</th>
              <th className="bg-gray-50 text-gray-500 font-display font-bold text-[10px] uppercase tracking-wider px-4 py-3 border-b border-gray-200 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors duration-150">
                <td className="px-4 py-3.5 border-b border-border-soft text-sm text-gray-500 align-middle">{log.time}</td>
                <td className="px-4 py-3.5 border-b border-border-soft text-sm text-black align-middle font-medium">{log.name}</td>
                <td className="px-4 py-3.5 border-b border-border-soft text-sm align-middle">
                  <span className={`inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full ${
                    log.status.toLowerCase() === 'in' 
                      ? 'text-in-green bg-emerald-50' 
                      : 'text-out-orange bg-orange-50'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

