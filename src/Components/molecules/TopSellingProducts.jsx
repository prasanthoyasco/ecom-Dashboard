import { ArrowBigLeft, ChevronRight } from "lucide-react";

const topProducts = [
  {
    id: 1,
    title: 'Tshirt Levis',
    price: '₹ 49,99',
    image: '/tshirt.jpg',
  },
  {
    id: 2,
    title: 'Long jeans jacket',
    price: '₹ 129,99',
    image: '/jeans-jacket.jpg',
  },
  {
    id: 3,
    title: 'Fullcap',
    price: '₹ 20,99',
    image: '/fullcap.jpg',
  },
  {
    id: 4,
    title: 'Adidas pants',
    price: '₹ 89,99',
    image: '/adidas-pants.jpg',
  },
];

export default function TopSellingProducts() {
  return (
    <div className="bg-white pt-2 p-6 w-full max-w-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-[#2E2E62]">Top selling products</h2>
        <a href="#" className="text-sm text-[#5840BB] flex items-center gap-1">
          See all <ChevronRight size={16}/>
        </a>
      </div>

      <ul className="space-y-4">
        {topProducts.map((product, index) => (
          <li key={product.id} className="flex items-center gap-4">
            <span className="text-sm text-[#2E2E62] font-semibold w-5">{index + 1}</span>
            <img
              src={product.image}
              alt={product.title}
              className="w-12 h-12 rounded-tl-[15px] shadow-sm rounded-tr-[5px] rounded-br-[15px] rounded-bl-[5px] object-cover"
            />
            <div>
              <p className="text-sm text-[#2E2E62]">{product.title}</p>
              <p className="text-base font-semibold text-[#2E2E62]">{product.price}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
