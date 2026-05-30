import { useState } from "react";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { updateLog, deleteLog } from "../../api/logs";
import ConfirmDialog from "../ui/ConfirmDialog";

export default function LogsTable({ logs, setLogs }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [confirmData, setConfirmData] = useState(null); // { type, logId, log }

  // Trigger edit confirmation
  const startEdit = (log) => {
    setConfirmData({ type: "edit", logId: log.id, log });
  };

  // Save changes after editing
  const saveEdit = async (id) => {
    await updateLog(id, { name: editName });
    setLogs(logs.map(log => log.id === id ? { ...log, name: editName } : log));
    setEditingId(null);
  };

  // Trigger delete confirmation
  const removeLog = (id) => {
    setConfirmData({ type: "delete", logId: id });
  };

  // Handle confirmation result
  const handleConfirm = () => {
    if (confirmData.type === "edit") {
      setEditingId(confirmData.logId);
      setEditName(confirmData.log.name || confirmData.log.uid);
    }
    if (confirmData.type === "delete") {
      deleteLog(confirmData.logId).then(() => {
        setLogs(logs.filter(log => log.id !== confirmData.logId));
      });
    }
    setConfirmData(null);
  };

  return (
    <>
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr>
            <th className="bg-gray-50 text-gray-500 font-display font-bold text-[10px] uppercase tracking-wider px-4 py-3 border-b border-gray-200 text-left">ID</th>
            <th className="bg-gray-50 text-gray-500 font-display font-bold text-[10px] uppercase tracking-wider px-4 py-3 border-b border-gray-200 text-left">Name</th>
            <th className="bg-gray-50 text-gray-500 font-display font-bold text-[10px] uppercase tracking-wider px-4 py-3 border-b border-gray-200 text-left">Time</th>
            <th className="bg-gray-50 text-gray-500 font-display font-bold text-[10px] uppercase tracking-wider px-4 py-3 border-b border-gray-200 text-left">Status</th>
            <th className="bg-gray-50 text-gray-500 font-display font-bold text-[10px] uppercase tracking-wider px-4 py-3 border-b border-gray-200 text-left w-[120px]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {logs.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-6 text-sm text-gray-500 border-b border-border-soft">
                No logs found.
              </td>
            </tr>
          )}

          {logs.map(log => (
            <tr key={log.id} className="hover:bg-gray-50/50 transition-colors duration-150">
              <td className="px-4 py-3.5 border-b border-border-soft text-sm text-black align-middle">{log.id}</td>
              <td className="px-4 py-3.5 border-b border-border-soft text-sm text-black align-middle">
                {editingId === log.id ? (
                  <input
                    className="w-full px-3 py-1.5 border border-brand-purple rounded-lg font-body text-sm outline-none focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  log.name || log.uid
                )}
              </td>
              <td className="px-4 py-3.5 border-b border-border-soft text-sm text-gray-500 align-middle">
                {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="px-4 py-3.5 border-b border-border-soft text-sm align-middle">
                <span className={`inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full ${log.status.toLowerCase() === 'in' ? 'text-in-green bg-emerald-50' : 'text-out-orange bg-orange-50'}`}>
                  {log.status}
                </span>
              </td>
              <td className="px-4 py-3.5 border-b border-border-soft text-sm align-middle">
                {editingId === log.id ? (
                  <div className="flex gap-2">
                    <button className="h-8 px-3 rounded-lg font-bold text-xs bg-brand-purple text-white hover:bg-brand-hover transition-all duration-200 cursor-pointer" onClick={() => saveEdit(log.id)}>Save</button>
                    <button className="h-8 px-3 rounded-lg font-bold text-xs bg-gray-100 text-black hover:bg-gray-200 transition-all duration-200 cursor-pointer" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      className="p-2 rounded-lg border border-border-soft flex items-center justify-center transition-all duration-200 text-gray-500 hover:bg-purple-50 hover:border-brand-purple hover:text-brand-purple cursor-pointer" 
                      onClick={() => startEdit(log)}
                    >
                      <HiPencilAlt size={16} />
                    </button>
                    <button 
                      className="p-2 rounded-lg border border-border-soft flex items-center justify-center transition-all duration-200 text-gray-500 hover:bg-orange-50 hover:border-out-orange hover:text-out-orange cursor-pointer" 
                      onClick={() => removeLog(log.id)}
                    >
                      <HiTrash size={16} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmData && (
        <ConfirmDialog
          type={confirmData.type} // "edit" or "delete"
          message={
            confirmData.type === "edit"
              ? "Do you want to edit this log?"
              : "Are you sure you want to delete this log?"
          }
          onConfirm={handleConfirm}
          onCancel={() => setConfirmData(null)}
        />
      )}
    </>
  );
}