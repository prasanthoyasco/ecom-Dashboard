import StatCard from '../../components/molecules/StatCard';
import { DollarSign, IndianRupeeIcon, ShoppingCart } from 'lucide-react';
import TopSellingProducts from '../../Components/molecules/TopSellingProducts';
import SalesStatistics from '../../Components/molecules/SalesStatistics';

export default function DashboardPage() {
  return (
    <>
    <div className='flex flex-wrap'>
   <div className="w-3/5 flex flex-col gap-2 p-4">
      <div className='flex gap-2'>
        <StatCard label="Orders" value="2,43,789" diff="20" icon={<ShoppingCart />} color="bg-blue-100" />
      <StatCard label="Sales" value="₹120,890.00" diff="440.00" icon={<IndianRupeeIcon />} color="bg-yellow-100" />
      </div>
      <div className='w-full'>
            <SalesStatistics/>
      </div>
    </div>
    <div className="w-2/5">
    <TopSellingProducts/>
    </div>
    </div>
    </>   
  );
}