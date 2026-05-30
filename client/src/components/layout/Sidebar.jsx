import { NavLink } from "react-router-dom";
import { HiOutlineChartBar, HiOutlineClipboardList, HiOutlineDocumentReport, HiOutlineUser, HiOutlineLogout } from "react-icons/hi";

export default function Sidebar() {
  const linkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ` +
    (isActive 
      ? "bg-brand-light text-brand-dark font-semibold" 
      : "text-gray-500 hover:text-black hover:bg-gray-50");

  return (
    <aside className="w-64 bg-white px-5 py-8 border-r border-border-soft flex flex-col h-screen shrink-0">
      {/* Brand logo header */}
      <div className="mb-9 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-purple text-white font-extrabold text-lg flex items-center justify-center rounded-lg">
            <span>E</span>
          </div>
          <h2 className="text-xl font-extrabold text-black tracking-tight">EELS</h2>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex flex-col gap-7 flex-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3 pl-2">
            Monitoring
          </span>
          <nav className="flex flex-col gap-1">
            <NavLink to="/" end className={linkClass}>
              {({ isActive }) => (
                <>
                  <HiOutlineChartBar size={20} className={isActive ? "text-brand-purple" : "text-gray-400"} />
                  <span>Dashboard</span>
                </>
              )}
            </NavLink>
            <NavLink to="/logs" className={linkClass}>
              {({ isActive }) => (
                <>
                  <HiOutlineClipboardList size={20} className={isActive ? "text-brand-purple" : "text-gray-400"} />
                  <span>Scanner Logs</span>
                </>
              )}
            </NavLink>
          </nav>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3 pl-2">
            Reports
          </span>
          <nav className="flex flex-col gap-1">
            <NavLink to="/reports" className={linkClass}>
              {({ isActive }) => (
                <>
                  <HiOutlineDocumentReport size={20} className={isActive ? "text-brand-purple" : "text-gray-400"} />
                  <span>Analytics Reports</span>
                </>
              )}
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Footer containing profile info and logout button */}
      <div className="border-t border-border-soft pt-6 mt-auto">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 bg-gray-100 text-gray-500 flex items-center justify-center rounded-full border border-gray-200">
            <HiOutlineUser size={18} />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs font-bold text-black">Owen Jerusalem</h4>
            <span className="text-[10px] text-gray-500">System Admin</span>
          </div>
        </div>
        
        <div className="px-2">
          <button className="w-full border-none bg-transparent text-gray-500 flex items-center gap-2 text-xs font-semibold cursor-pointer py-2 hover:text-brand-purple transition-all duration-250">
            <HiOutlineLogout size={16} />
            <span>Exit Log System</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
