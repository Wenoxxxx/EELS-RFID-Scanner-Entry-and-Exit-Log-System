// src/components/ui/ConfirmDialog.jsx
export default function ConfirmDialog({ type = "delete", message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-border-soft shadow-xl p-6 max-w-sm w-full animate-scale-up">
        <p className="text-black font-body font-medium text-base mb-6 text-center">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            className={`h-10 px-6 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer ${
              type === "delete"
                ? "bg-out-orange text-white hover:bg-orange-600 shadow-sm"
                : "bg-brand-purple text-white hover:bg-brand-hover shadow-sm"
            }`}
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="h-10 px-6 rounded-lg font-semibold text-sm border border-border-soft bg-white text-gray-500 hover:bg-gray-50 hover:text-black transition-all duration-200 cursor-pointer"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}