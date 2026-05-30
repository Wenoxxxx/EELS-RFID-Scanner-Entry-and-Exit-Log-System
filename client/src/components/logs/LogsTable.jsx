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
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {logs.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                No logs found.
              </td>
            </tr>
          )}

          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>
                {editingId === log.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  log.name || log.uid
                )}
              </td>
              <td>{log.time}</td>
              <td className={`status ${log.status.toLowerCase()}`}>
                {log.status}
              </td>
              <td className="actions">
                {editingId === log.id ? (
                  <>
                    <button className="btn-save" onClick={() => saveEdit(log.id)}>Save</button>
                    <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="icon-btn edit" onClick={() => startEdit(log)}>
                      <HiPencilAlt />
                    </button>
                    <button className="icon-btn delete" onClick={() => removeLog(log.id)}>
                      <HiTrash />
                    </button>
                  </>
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