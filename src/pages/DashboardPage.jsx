import StatCard from '../components/molecules/StatCard';
import { DollarSign, IndianRupeeIcon, ListOrderedIcon, PiggyBank, ReceiptText, ShoppingCart } from 'lucide-react';
import TopSellingProducts from '../components/molecules/TopSellingProducts';
import SalesStatistics from '../components/molecules/SalesStatistics';
import UniqueVisitorsChart from '../components/molecules/UniqueVisitorsChart';

export default function DashboardPage() {
  return (
    <>
    <div className='flex flex-wrap'>
   <div className="w-3/5 flex flex-col gap-2 p-4">
      <div className='flex gap-2'>
        <StatCard label="Orders" value="2,43,789" diff="20" icon={<ReceiptText />} color="bg-[#C7F2FF] w-2/5" />
      <StatCard label="Sales" value="₹120,890.00" diff="440.00" icon={<PiggyBank />} color="bg-[#FFE5EE] w-3/5" />
      </div>
      <div className='w-full'>
            <SalesStatistics/>
      </div>
    </div>
    <div className="w-2/5">
    <TopSellingProducts/>
    <UniqueVisitorsChart/>
    </div>
    </div>
    </>   
  );
}