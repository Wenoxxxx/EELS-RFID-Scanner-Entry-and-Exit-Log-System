export default function Sidebar() {
    return (
        <aside className="sidebar">
            <h2 className="logo">RFID</h2>
            <nav>
                <a className="active">Dashboard</a>
                <a>Logs</a>
                <a>Stats</a>
            </nav>
        </aside>
    );
}