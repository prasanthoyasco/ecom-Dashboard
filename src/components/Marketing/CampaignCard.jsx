import { BarChart2, IndianRupee, Calendar, Zap } from "lucide-react";

export default function CampaignCard({ campaign }) {
  const {
    name,
    status,
    budget,
    spent,
    ctr,
    conversions,
    startDate,
    endDate,
  } = campaign;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded ₹{
            status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
        <Calendar size={14} />
        {startDate} - {endDate}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
        <div className="flex items-center gap-2">
          <IndianRupee className="text-indigo-600" size={16} />
          <span className="text-gray-600">Budget: </span>₹{budget}
        </div>
        <div className="flex items-center gap-2">
          <IndianRupee className="text-red-500" size={16} />
          <span className="text-gray-600">Spent: </span>₹{spent}
        </div>
        <div className="flex items-center gap-2">
          <BarChart2 className="text-blue-500" size={16} />
          <span className="text-gray-600">CTR: </span>{ctr}%
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <Zap className="text-yellow-500" size={16} />
          <span className="text-gray-600">Conversions: </span>{conversions}
        </div>
      </div>
    </div>
  );
}
