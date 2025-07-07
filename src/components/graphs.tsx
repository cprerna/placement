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
import data from '../data/data.json';

// Prepare data for Pie Chart (Male/Female)
const genderCounts = data.reduce(
  (acc: any, curr: any) => {
    if (curr.gender === 'Male') acc.Male += 1;
    else if (curr.gender === 'Female') acc.Female += 1;
    return acc;
  },
  { Male: 0, Female: 0 }
);

const pieData = [
  { name: 'Male', value: genderCounts.Male },
  { name: 'Female', value: genderCounts.Female },
];

const COLORS = ['#0088FE', '#FF69B4'];

// Prepare data for Bar Chart (Region)
const regionCounts: { [key: string]: number } = {};
data.forEach((item: any) => {
  regionCounts[item.region] = (regionCounts[item.region] || 0) + 1;
});

const barData = Object.entries(regionCounts).map(([region, count]) => ({
  region,
  count,
}));

export default function Graphs() {
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
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
