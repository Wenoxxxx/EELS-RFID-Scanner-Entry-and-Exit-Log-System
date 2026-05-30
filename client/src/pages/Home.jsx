import { useEffect, useState } from 'react';
import { HiOutlinePlus, HiOutlineClock } from 'react-icons/hi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import StatCard from '../components/dashboard/StatCard';
import WeeklyLineChart from '../components/dashboard/WeeklyLineChart'; 
import { getSummary, getLogs } from '../api/logs';

const PIE_COLORS = ["#7c3aed", "#a855f7", "#c084fc", "#e879f9"];

export default function Home() {
    const [summary, setSummary] = useState({ totalEntries: 0, totalExits: 0, totalAttendees: 0 });
    const [recentLogs, setRecentLogs] = useState([]);
    const [distribution, setDistribution] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSummary = async () => {
        try {
            const res = await getSummary('all');
            const data = res.data || {};
            setSummary({
                totalEntries: Number(data.totalEntries) || 0,
                totalExits: Number(data.totalExits) || 0,
                totalAttendees: Number(data.totalAttendees) || 0,
            });
        } catch (err) {
            console.error('Failed to load summary', err);
        }
    };

    const fetchRecentLogs = async () => {
        try {
            const today = new Date().toLocaleDateString("en-CA");
            const res = await getLogs(today);
            const data = res.data || [];
            
            // Set 5 most recent logs
            setRecentLogs(data.slice(0, 5));

            // Calculate peak times (Morning, Afternoon, Evening, Night)
            let morning = 0; // 6-12
            let afternoon = 0; // 12-18
            let evening = 0; // 18-24
            let night = 0; // 0-6

            data.forEach(log => {
                const hour = new Date(log.time).getHours();
                if (hour >= 6 && hour < 12) morning++;
                else if (hour >= 12 && hour < 18) afternoon++;
                else if (hour >= 18 && hour < 24) evening++;
                else night++;
            });

            const totalScans = data.length || 1;
            const distData = [
                { name: 'Morning (6am-12pm)', value: morning, pct: Math.round((morning/totalScans)*100) },
                { name: 'Afternoon (12pm-6pm)', value: afternoon, pct: Math.round((afternoon/totalScans)*100) },
                { name: 'Evening (6pm-12am)', value: evening, pct: Math.round((evening/totalScans)*100) },
                { name: 'Night (12am-6am)', value: night, pct: Math.round((night/totalScans)*100) }
            ].filter(item => item.value > 0);

            // Fallback if no logs today
            if (distData.length === 0) {
                setDistribution([
                    { name: 'Morning (6am-12pm)', value: 3, pct: 30 },
                    { name: 'Afternoon (12pm-6pm)', value: 5, pct: 50 },
                    { name: 'Evening (6pm-12am)', value: 2, pct: 20 }
                ]);
            } else {
                setDistribution(distData);
            }

        } catch (err) {
            console.error('Failed to load recent logs', err);
        }
    };

    const loadAllData = async () => {
        setLoading(true);
        await Promise.all([fetchSummary(), fetchRecentLogs()]);
        setLoading(false);
    };

    useEffect(() => {
        loadAllData();
        const id = setInterval(() => {
            fetchSummary();
            fetchRecentLogs();
        }, 5000);
        return () => clearInterval(id);
    }, []);

    const simulateScan = async () => {
        const uid = prompt("Enter RFID Card UID to simulate manual scan:");
        if (!uid) return;
        try {
            const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
            const res = await fetch(`${apiBase}/logs/rfid/scan`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid }),
            });
            if (res.ok) {
                alert("Simulated card scan successful!");
                fetchSummary();
                fetchRecentLogs();
            } else {
                const err = await res.json();
                alert(`Scan Rejected: ${err.message}`);
            }
        } catch (err) {
            alert(`Simulation failed: ${err.message}`);
        }
    };

    const fmt = (n) => n.toLocaleString();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-3xl font-extrabold text-black font-display tracking-tight">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1 mb-8">Real-time building access metrics & activity logs</p>
                </div>
            </div>

            {/* Metric Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Total Entries"
                    value={loading ? '—' : fmt(summary.totalEntries)}
                    variant="entries"
                    description="Total number of logged check-ins."
                />

                <StatCard
                    title="Total Exits"
                    value={loading ? '—' : fmt(summary.totalExits)}
                    variant="exits"
                    description="Total number of logged check-outs."
                />

                <StatCard
                    title="Total Attendees"
                    value={loading ? '—' : fmt(summary.totalAttendees)}
                    variant="attendees"
                    description="Unique attendees registered in the logs."
                />

                {/* Dotted Scan Placeholder (Mockup style) */}
                <div 
                  className="bg-transparent p-5 border border-dashed border-gray-300 rounded-xl flex flex-col justify-center items-center gap-2 cursor-pointer transition-all duration-200 hover:border-brand-purple hover:bg-purple-50/20 group" 
                  onClick={simulateScan}
                >
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center transition-all duration-200 group-hover:bg-brand-light group-hover:text-brand-purple">
                        <HiOutlinePlus size={20} />
                    </div>
                    <span className="font-display text-xs font-bold text-gray-500 uppercase tracking-wider transition-all duration-200 group-hover:text-brand-purple">
                      Simulate Scan
                    </span>
                </div>
            </div>

            {/* Bar Chart Section */}
            <div className="bg-white p-7 rounded-xl border border-border-soft shadow-sm">
                <h2 className="text-lg font-bold text-black font-display mb-1">Weekly Activity Overview</h2>
                <WeeklyLineChart />
            </div>

            {/* Bottom Grid Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card: Pie Chart Distribution */}
                <div className="bg-white p-7 rounded-xl border border-border-soft shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-black font-display mb-1">Scans by Peak Hours</h3>
                    <p className="text-xs text-gray-500 mb-6">Check-in check-out distribution by time block today</p>
                    <div className="flex justify-center items-center h-[200px] mb-4">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} Scans`]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-3 border-t border-border-soft pt-4.5 mt-auto">
                        {distribution.map((item, idx) => (
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500" key={idx}>
                                <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }}></div>
                                <span className="flex-1 truncate">{item.name}</span>
                                <span className="font-display font-bold text-black">{item.pct}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Card: Country styled Recent Scans table */}
                <div className="bg-white p-7 rounded-xl border border-border-soft shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-black font-display mb-1">Recent Check-ins</h3>
                    <p className="text-xs text-gray-500 mb-6">Latest scannings recorded on the RFID hardware</p>
                    
                    <div className="mt-2 flex-1">
                        <table className="w-full border-collapse">
                            <tbody>
                                {recentLogs.length === 0 ? (
                                    <tr>
                                        <td className="text-center text-gray-500 py-[30px] border-b-0">No scanning records today.</td>
                                    </tr>
                                ) : (
                                    recentLogs.map((log, index) => (
                                        <tr key={log.id}>
                                            <td className={`py-3.5 text-sm text-black align-middle flex items-center gap-3 ${index === recentLogs.length - 1 ? 'border-b-0' : 'border-b border-border-soft'}`}>
                                                <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                                                    <HiOutlineClock size={16} />
                                                </div>
                                                <span className="font-semibold text-black">{log.name}</span>
                                            </td>
                                            <td className={`py-3.5 text-sm text-gray-500 text-right font-medium align-middle ${index === recentLogs.length - 1 ? 'border-b-0' : 'border-b border-border-soft'}`}>
                                                {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className={`py-3.5 text-right w-[90px] align-middle ${index === recentLogs.length - 1 ? 'border-b-0' : 'border-b border-border-soft'}`}>
                                                <span className={`inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full ${log.status.toLowerCase() === 'in' ? 'text-in-green bg-emerald-50' : 'text-out-orange bg-orange-50'}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}