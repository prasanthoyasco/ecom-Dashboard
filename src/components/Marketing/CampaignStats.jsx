import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IndianRupee, BarChart2, Zap, Percent } from "lucide-react";

export default function CampaignStats({ stats }) {
  // stats prop example:
  // {
  //   totalBudget: 10000,
  //   totalSpent: 7000,
  //   totalConversions: 1500,
  //   ctr: 3.8,
  //   dailyPerformance: [
  //     { date: 'Jun 1', ctr: 3.1, spent: 200 },
  //     { date: 'Jun 2', ctr: 4.0, spent: 350 },
  //     ...
  //   ]
  // }

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-5">Campaign Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="flex items-center gap-3">
          <IndianRupee className="text-indigo-600" size={24} />
          <div>
            <p className="text-gray-500 text-sm">Total Budget</p>
            <p className="text-lg font-semibold">₹{stats.totalBudget.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <IndianRupee className="text-red-500" size={24} />
          <div>
            <p className="text-gray-500 text-sm">Total Spent</p>
            <p className="text-lg font-semibold">₹{stats.totalSpent.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Zap className="text-yellow-500" size={24} />
          <div>
            <p className="text-gray-500 text-sm">Conversions</p>
            <p className="text-lg font-semibold">{stats.totalConversions.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Percent className="text-blue-500" size={24} />
          <div>
            <p className="text-gray-500 text-sm">Click-Through Rate (CTR)</p>
            <p className="text-lg font-semibold">{stats.ctr.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">Daily Performance</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={stats.dailyPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Bar yAxisId="left" dataKey="spent" fill="#8884d8" name="Spent (₹)" />
          <Bar yAxisId="right" dataKey="ctr" fill="#82ca9d" name="CTR (%)" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
