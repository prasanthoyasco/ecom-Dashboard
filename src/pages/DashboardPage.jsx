import StatCard from '../components/molecules/StatCard';
import { PiggyBank, ReceiptText } from 'lucide-react';
import TopSellingProducts from '../components/molecules/TopSellingProducts';
import SalesStatistics from '../components/molecules/SalesStatistics';
import UniqueVisitorsChart from '../components/molecules/UniqueVisitorsChart';

export default function DashboardPage() {
  return (
    <div className="flex flex-col md:flex-row flex-wrap">
      
      {/* Left Section */}
      <div className="w-full md:w-3/5 flex flex-col gap-2 p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <StatCard
            label="Orders"
            value="2,43,789"
            diff="20"
            icon={<ReceiptText />}
            color="bg-[#C7F2FF] w-full sm:w-2/5"
          />
          <StatCard
            label="Sales"
            value="₹120,890.00"
            diff="440.00"
            icon={<PiggyBank />}
            color="bg-[#FFE5EE] w-full sm:w-3/5"
          />
        </div>
        <div className="w-full">
          <SalesStatistics />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-2/5 p-4 pt-0 md:pt-4">
        <TopSellingProducts />
        <UniqueVisitorsChart />
      </div>
    </div>
  );
}
