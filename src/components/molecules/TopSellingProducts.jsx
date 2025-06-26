import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { getAllProducts } from "../../api/productApi";

export default function TopSellingProducts() {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await getAllProducts();
        const allProducts = res.data || [];

        const withSales = allProducts.map((p) => ({
          ...p,
          sales: p.sales ?? p.soldCount ?? Math.floor(Math.random() * 10000),
        }));

        const sorted = [...withSales].sort((a, b) => b.sales - a.sales);

        const topFour = sorted.slice(0, 4).map((p) => ({
          id: p._id,
          title: p.name,
          price: `₹ ${p.price?.toLocaleString("en-IN") || 0}`,
          image: p.images?.[0] || "/placeholder.jpg",
          sales: p.sales,
        }));

        setTopProducts(topFour);
      } catch (error) {
        console.error("Failed to load top selling products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <div className="bg-white p-4 sm:p-6 w-full max-w-xl rounded-lg shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-lg sm:text-sm font-semibold text-[#2E2E62]">Top Selling Products</h2>
        <a href="/topsellers" className="text-sm text-[#5840BB] flex items-center gap-1">
          See all <ChevronRight size={16} />
        </a>
      </div>

      {loading ? (
        <ul className="space-y-3">
          {[1, 2, 3, 4].map((_, index) => (
            <li
              key={index}
              className="flex animate-pulse items-center gap-3 p-3 border border-gray-100 rounded-lg"
            >
              <div className="w-4 text-gray-300">{index + 1}</div>
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-10 h-4 bg-gray-200 rounded sm:block hidden"></div>
            </li>
          ))}
        </ul>
      ) : (
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
      )}
    </div>
  );
}
