// src/components/ui/ConfirmDialog.jsx
export default function ConfirmDialog({ type = "delete", message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p>{message}</p>
        <div className="confirm-actions">
          <button
            className={type === "delete" ? "btn-confirm-delete" : "btn-confirm-edit"}
            onClick={onConfirm}
          >
            Yes
          </button>
          <button className="btn-cancel" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}