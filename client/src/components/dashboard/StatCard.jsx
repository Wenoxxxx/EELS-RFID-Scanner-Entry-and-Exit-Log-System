export default function StatCard({ title, value }) {
return (
    <div className="card">
        <p className="card-title">{title}</p>
        <h3>{value}</h3>
    </div>
    );
}