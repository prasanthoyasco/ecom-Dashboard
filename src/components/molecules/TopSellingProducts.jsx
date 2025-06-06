import { ChevronRight } from "lucide-react";

const topProducts = [
  {
    id: 1,
    title: 'Tshirt Levis',
    price: '₹ 4990',
    image: '/tshirt.jpg',
    sales: 9000
  },
  {
    id: 2,
    title: 'Long jeans jacket',
    price: '₹ 1299',
    image: '/jeans-jacket.jpg',
    sales: 8895
  },
  {
    id: 3,
    title: 'Fullcap',
    price: '₹ 299',
    image: '/fullcap.jpg',
    sales: 7657
  },
  {
    id: 4,
    title: 'Adidas pants',
    price: '₹ 899',
    image: '/adidas-pants.jpg',
    sales: 3000
  },
];

export default function TopSellingProducts() {
  return (
    <div className="bg-white p-4 sm:p-6 w-full max-w-xl rounded-lg shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-lg sm:text-sm font-semibold text-[#2E2E62]">Top Selling Products</h2>
        <a href="#" className="text-sm text-[#5840BB] flex items-center gap-1">
          See all <ChevronRight size={16} />
        </a>
      </div>

      <ul className="space-y-3">
        {topProducts.map((product, index) => (
          <li
            key={product.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 border border-gray-100 hover:bg-gray-50 rounded-lg transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#2E2E62] font-semibold">{index + 1}</span>
              <img
                src={product.image}
                alt={product.title}
                className="w-12 h-12 object-cover rounded-tl-[15px] rounded-tr-[5px] rounded-br-[15px] rounded-bl-[5px] shadow"
              />
              <div className="min-w-0">
                <p className="text-sm text-[#2E2E62] font-medium truncate">{product.title}</p>
                <p className="text-base font-semibold text-[#2E2E62]">{product.price}</p>
              </div>
            </div>
            <div className="hidden sm:block text-left sm:text-right">
              <p className="text-xs sm:text-sm text-[#2E2E62]">Sales/Month</p>
              <p className="text-sm sm:text-base font-semibold text-orange-500">
                {product.sales >= 1000 ? `${(product.sales / 1000).toFixed(1)}K` : product.sales}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
