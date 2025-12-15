export default function Logs() {
return (
    <div className="card">
        <h3>RFID Logs</h3>
        <table className="table">
            <thead>
                <tr><th>User</th><th>Time</th><th>Status</th></tr>
            </thead>
            <tbody>
                <tr><td>Admin</td><td>08:01 AM</td><td>IN</td></tr>
                <tr><td>Admin</td><td>05:10 PM</td><td>OUT</td></tr>
            </tbody>
        </table>
    </div>
    );
}