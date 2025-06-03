export default function StatCard({ label, value, icon, diff, color }) {
  return (
    <div
      className={`min-w-0 w-full p-4 md:p-6 xl:p-8 rounded-xl ${color} 
  rounded-tl-[50px] rounded-br-[50px] rounded-tr-[10px] rounded-bl-[10px] 
  flex items-center gap-1`}
    >
      {icon && (
        <div className="text-2xl sm:text-3xl text-gray-600 bg-white shadow-gray-100 p-3 rounded-tl-[15px] rounded-br-[15px] rounded-tr-[5px] rounded-bl-[5px] me-3">
          {icon}
        </div>
      )}
      <div>
        <div className="flex items-start gap-0">
          <h3 className="text-l font-bold text-[#42427D]">{value}</h3>
          {diff && (
            <p className="text-xs text-white ms-1 bg-[#42427D] rounded-tl-[10px] rounded-br-[10px] rounded-tr-[3px] rounded-bl-[3px] px-2 py-1">
              +{diff}
            </p>
          )}
        </div>
        <p className="text-sm font-medium text-[#42427D]">{label}</p>{" "}
      </div>
    </div>
  );
}
