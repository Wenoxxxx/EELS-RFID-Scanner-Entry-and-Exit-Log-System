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

// Weekly activity data
const weeklyData = [
  { day: "Mon", Total: 120 },
  { day: "Tue", Total: 210 },
  { day: "Wed", Total: 180 },
  { day: "Thu", Total: 260 },
  { day: "Fri", Total: 300 },
  { day: "Sat", Total: 220 },
  { day: "Sun", Total: 150 },
];

export default function WeeklyLineChart() {
  return (
    <div className="weekly-line-chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Total"
            stroke="#5b5be0"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
