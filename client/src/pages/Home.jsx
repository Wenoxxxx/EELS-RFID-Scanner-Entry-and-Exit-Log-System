import StatCard from '../components/dashboard/StatCard';
import LineChart from '../components/dashboard/LineChart';


export default function Home() {
return (
    <div className="dashboard">
        <div className="stats-grid">
        <StatCard title="Total Entries" value="1,245" />
        <StatCard title="Total Exits" value="1,180" />
        <StatCard title="Active Today" value="32" />
        </div>
        <LineChart />
    </div>
    );
}