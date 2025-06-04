import { ChevronDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "", visitors: 0 },
  { name: "Mon", visitors: 48000 },
  { name: "Tue", visitors: 30000 },
  { name: "Wed", visitors: 47000 },
  { name: "Thu", visitors: 28000 },
  { name: "Fri", visitors: 26000 },
  { name: "Sat", visitors: 48000 },
  { name: "Sun", visitors: 36000 },
];
const CustomTooltip = ({ active, payload, label }) => {
  if (
    !active ||
    !payload ||
    !payload.length ||
    payload[0].value <= 1 // ✅ condition to suppress tooltip
  ) {
    return null;
  }

  return (
    <div className="bg-white rounded-tl-[20px] rounded-tr-[5px] rounded-bl-[5px] rounded-br-[20px] shadow-lg p-3 text-sm text-gray-800 border border-gray-200">
      <div className="font-semibold">{label}</div>
      <div>{`Visitors: ${payload[0].value.toLocaleString()}`}</div>
    </div>
  );
};

export default function UniqueVisitorsChart() {
  return (
    <div className="bg-white p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Unique visitors</h2>
        <button className="border border-[F3F6FF] text-[#42427d] rounded-tl-[20px] rounded-tr-[5px] rounded-bl-[5px] rounded-br-[20px] px-4 py-3 text-sm flex items-center gap-1">
          Weekly {<ChevronDown size={16} />}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis
            dataKey="name"
            color="#42427d"
            axisLine={{ stroke: "#F3F6FF" }}
            tickLine={{ stroke: "#F3F6FF" }}
            tick={{ fill: "#6C4CF1" }}
             padding={{ left: 10, right: 10 }}
          />
          <YAxis
            color="#42427d"
            hide
            axisLine={{ stroke: "#F3F6FF" }}
            tickLine={{ stroke: "#F3F6FF" }}
            tick={{ fill: "#6C4CF1" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke="#7C3AED"
            strokeWidth={3}
            dot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: "#6C4CF1" }}
            activeDot={{ r: 8, strokeWidth: 0, fill: "#7979B2" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
