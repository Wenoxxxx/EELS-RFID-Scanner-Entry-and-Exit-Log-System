import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";

import Home from "./pages/Home.jsx";
import Logs from "./pages/Logs.jsx";
import Stats from "./pages/Stats.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </>
  );
}

export default App;
