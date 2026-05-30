import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
