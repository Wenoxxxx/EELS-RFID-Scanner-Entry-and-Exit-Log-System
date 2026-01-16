import './WeeklyLineChart.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";
import { getWeeklyLogs } from "../../api/logs";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeeklyLineChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getWeeklyLogs();
        // Map backend dates to day names
        const formatted = res.data.map(d => ({
          day: dayNames[new Date(d.date).getDay()],
          Total: d.total,
          In: d.inCount,
          Out: d.outCount,
        }));
        setData(formatted);
      } catch (err) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="weekly-line-chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Total"
            stroke="#5b5be0"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
            name="Total Scans"
          />
          <Line
            type="monotone"
            dataKey="In"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
            name="IN"
          />
          <Line
            type="monotone"
            dataKey="Out"
            stroke="#f87171"
            strokeWidth={2}
            dot={false}
            name="OUT"
          />
        </LineChart>
      </ResponsiveContainer>
      {loading && <div style={{textAlign:'center',marginTop:8}}>Loading...</div>}
    </div>
  );
}
