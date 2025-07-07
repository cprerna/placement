'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  name: string | null;
  value: number;
}

interface GraphsProps {
  genderData: ChartData[];
  regionData: ChartData[];
}

export default function Graphs({ genderData, regionData }: GraphsProps) {
  // Filter out null values and convert to proper format for charts
  const pieData = genderData
    .filter((item) => item.name && item.value > 0)
    .map((item) => ({ name: item.name!, value: item.value }));

  const barData = regionData
    .filter((item) => item.name && item.value > 0)
    .map((item) => ({ name: item.name!, value: item.value }));

  const COLORS = ['#0088FE', '#FF69B4', '#00C49F'];

  return (
    <div className="w-full mb-6">
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
        <div className="flex-1 max-w-md">
          <h2 className="text-center text-lg font-semibold mb-4">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 max-w-lg">
          <h2 className="text-center text-lg font-semibold mb-4">Region Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
