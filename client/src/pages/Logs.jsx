import { NavLink, Outlet, useLocation } from "react-router-dom";
import { HiOutlineLogin, HiOutlineLogout, HiOutlineCollection } from "react-icons/hi";
import { setScanMode } from "../api/rfid";

// =============================
// TODAY (YYYY-MM-DD) — LOCAL TIMEZONE
// =============================
const getToday = () => {
  const dt = new Date();
  return dt.toLocaleDateString("en-CA"); // YYYY-MM-DD format in local timezone
};

export default function Logs() {
  const location = useLocation();

  // Determine current view from URL
  const currentView = location.pathname.endsWith("/in")
    ? "IN"
    : location.pathname.endsWith("/out")
    ? "OUT"
    : "SUMMARY";

  const btnClassIn = ({ isActive }) => 
    `h-10 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border transition-all duration-200 ` +
    (isActive 
      ? "bg-in-green border-in-green text-white" 
      : "border-border-soft bg-white text-gray-500 hover:bg-gray-50 hover:text-black");

  const btnClassOut = ({ isActive }) => 
    `h-10 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border transition-all duration-200 ` +
    (isActive 
      ? "bg-out-orange border-out-orange text-white" 
      : "border-border-soft bg-white text-gray-500 hover:bg-gray-50 hover:text-black");

  const btnClassSummary = ({ isActive }) => 
    `h-10 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border transition-all duration-200 ` +
    (isActive 
      ? "bg-brand-purple border-brand-purple text-white" 
      : "border-border-soft bg-white text-gray-500 hover:bg-gray-50 hover:text-black");

  const getFilterLabelClass = () => {
    switch (currentView) {
      case "IN":
        return "text-in-green";
      case "OUT":
        return "text-out-orange";
      default:
        return "text-brand-purple";
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl border border-border-soft shadow-sm relative">
      <h1 className="text-2xl font-extrabold text-black font-display tracking-tight">Logs</h1>
      {/* Subtitle now includes current day */}
      <p className="text-sm text-gray-500 mt-1 mb-8">
        Timeline scanner logs: {getToday()}
      </p>

      {/* NON-CLICKABLE STATUS LABEL */}
      <p className={`text-xs font-bold tracking-widest uppercase mt-2 mb-4 ${getFilterLabelClass()}`}>
        SHOWING: {currentView} LOGS
      </p>

      {/* ACTION BAR */}
      <div className="flex justify-between items-center my-6 gap-4">
        <div className="flex gap-2">
          <NavLink
            to="in"
            onClick={() => setScanMode("IN")}
            className={btnClassIn}
          >
            <HiOutlineLogin size={16} />
            <span>Scan IN</span>
          </NavLink>

          <NavLink
            to="out"
            onClick={() => setScanMode("OUT")}
            className={btnClassOut}
          >
            <HiOutlineLogout size={16} />
            <span>Scan OUT</span>
          </NavLink>
        </div>

        <NavLink
          to="summary"
          className={btnClassSummary}
        >
          <HiOutlineCollection size={16} />
          <span>Summary View</span>
        </NavLink>
      </div>

      {/* CHILD ROUTES */}
      <Outlet />
    </div>
  );
}