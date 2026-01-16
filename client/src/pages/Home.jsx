import { useEffect, useState } from 'react';
import StatCard from '../components/dashboard/StatCard';
import WeeklyLineChart from '../components/dashboard/WeeklyLineChart'; 
import { getSummary } from '../api/logs';

export default function Home() {
    const [summary, setSummary] = useState({ totalEntries: 0, totalExits: 0, totalAttendees: 0 });
    const [loading, setLoading] = useState(true);

    const fetchSummary = async () => {
        try {
            setLoading(true);
            const res = await getSummary('all');
            const data = res.data || {};
            setSummary({
                totalEntries: Number(data.totalEntries) || 0,
                totalExits: Number(data.totalExits) || 0,
                totalAttendees: Number(data.totalAttendees) || 0,
            });
        } catch (err) {
            console.error('Failed to load summary', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
        const id = setInterval(fetchSummary, 3000);
        return () => clearInterval(id);
    }, []);

    const fmt = (n) => n.toLocaleString();

    return (
        <div className="dashboard">
            <h1 className='page-title'>Dashboard</h1>
            <p className="subtitle">Total and current activity</p>

            <div className="stats-grid">
                <StatCard
                    title="Total Entries"
                    value={loading ? '—' : fmt(summary.totalEntries)}
                    variant="entries"
                    description="Total number of entries recorded across the database."
                />

                <StatCard
                    title="Total Exits"
                    value={loading ? '—' : fmt(summary.totalExits)}
                    variant="exits"
                    description="Total number of exits recorded across the database."
                />

                <StatCard
                    title="Total Attendees"
                    value={loading ? '—' : fmt(summary.totalAttendees)}
                    variant="attendees"
                    description="Current attendee count (entries minus exits) across the database."
                />
            </div>

            {/* ...existing code... */}
            <div className="dashboard-chart-section">
                <h2 className="chart-section-title">Weekly Activity Overview</h2>
                <WeeklyLineChart />
            </div>
        </div>
    );
}