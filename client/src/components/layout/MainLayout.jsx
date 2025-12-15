import Sidebar from "./Sidebar";
import Header from "./Header";
import "../../App.css";

export default function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
