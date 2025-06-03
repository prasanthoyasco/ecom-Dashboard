import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  BarChart2,
  Star,
  FileText,
  LucideShoppingCart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard />, path: '/' },
  { label: 'Orders', icon: <ShoppingBag />, path: '/orders' },
  { label: 'Products', icon: <BarChart2 />, path: '/products' },
  { label: 'Marketing', icon: <Star />, path: '/marketing' },
  { label: 'Reports', icon: <FileText />, path: '/reports' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-[#42427D] text-white p-6 pe-0 transition-all duration-300 ease-in-out relative`}
    >
      

      {/* Logo */}
      <div className={`mb-10 px-1 flex items-center gap-2 ${collapsed ? 'justify-center' : 'px-5'}`}>
        <LucideShoppingCart />
        {!collapsed && <h1 className="text-2xl font-bold">ShopNow</h1>}
        <div>
            {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-14 -right-3 bg-[#42427d] focus:border-0 text-white p-1 rounded-full shadow-md"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-4">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 ease-in-out duration-500 ${
                collapsed ? 'justify-center' : 'ps-3 pe-5'
              } py-3 rounded-[13px] rounded-tr-[0px] rounded-r-[0px] transition relative ${
                isActive
                  ? 'bg-white text-[#5840BB] font-medium active-tab'
                  : 'hover:bg-purple-700'
              }`
            }
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
