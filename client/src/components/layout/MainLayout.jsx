import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../../App.css";
import "./MainLayout.css";

export default function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
