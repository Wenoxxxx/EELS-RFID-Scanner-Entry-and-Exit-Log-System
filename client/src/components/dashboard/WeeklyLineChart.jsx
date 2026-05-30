import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
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
    <div className="w-full relative">
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} barSize={12}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f6" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              dy={10}
              tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
            />
            <YAxis 
              allowDecimals={false} 
              axisLine={false} 
              tickLine={false} 
              dx={-10}
              tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(124, 58, 237, 0.02)' }}
              contentStyle={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                fontSize: '12px',
                fontFamily: 'Poppins, sans-serif'
              }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 500, fontFamily: 'Outfit, sans-serif' }}
            />
            <Bar 
              dataKey="In" 
              fill="#7c3aed" 
              name="IN check-ins" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="Out" 
              fill="#c084fc" 
              name="OUT check-outs" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {loading && <div className="text-center mt-3 text-xs text-gray-500 font-medium">Loading scanner stats...</div>}
    </div>
  );
}
