import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: 'Day 1', value: 10, value2: 5 },
  { name: "Week 1", value: 20, value2: 10 },
  { name: "Week 2", value: 35, value2: 25 },
  { name: "Week 3", value: 49, value2: 40 },
  { name: "Week 4", value: 70, value2: 60 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#6C4CF1] text-white px-4 py-2 rounded-xl shadow-lg text-center">
        <p className="text-sm text-gray-200 mb-1">10.06 — 17.06.2020</p>
        <p className="text-lg font-semibold">
          ₹{payload[0].value.toLocaleString()}
        </p>
        <p className="text-sm text-violet-200">
          Compare: ₹{payload[1]?.value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function SalesStatistics() {
  return (
    <div className="bg-white text-[#42427d] p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sales statistics</h2>
        <button className="border border-[#42427d] text-[#42427d] rounded-full px-4 py-1 text-sm">
          Monthly ▾
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 30, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="lineShadow" x1="0" y1="0" x2="0" y2="2">
              <stop offset="0%" stopColor="#e0c8ff" stopOpacity={1} />
              <stop offset="100%" stopColor="#42427d" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="#F3F6FF" />
          <XAxis
            dataKey="name"
            color="#42427d"
            axisLine={{ stroke: "#F3F6FF" }}
            tickLine={{ stroke: "#F3F6FF" }}
            tick={{ fill: "#6C4CF1" }}
          />
          <YAxis color="#42427d" 
           axisLine={{ stroke: "#F3F6FF" }}
            tickLine={{ stroke: "#F3F6FF" }}
            tick={{ fill: "#6C4CF1" }}
            />
          <Tooltip content={<CustomTooltip />} cursor={false} />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#FFE5EE"
            strokeWidth={3}
             fill="url(#lineShadow)"
            dot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: "#6C4CF1" }}
            activeDot={{ r: 8, strokeWidth: 0, fill: "#7979B2" }}
          />

          <Line
            type="monotone"
            dataKey="value2"
            stroke="#C7F2FF"
            strokeWidth={3}
            dot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: "#00B4D8" }}
            activeDot={{ r: 8, strokeWidth: 0, fill: "#0077B6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
