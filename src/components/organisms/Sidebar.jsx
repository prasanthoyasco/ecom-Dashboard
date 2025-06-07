import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  BarChart2,
  Star,
  LucideShoppingCart,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function Sidebar({ setSidebarOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = () => {
    if (window.innerWidth < 640 && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const isProductActive =
    location.pathname.startsWith('/products') && !location.pathname.includes('/marketing');

  return (
    <aside
      className={`${
        collapsed ? 'sm:w-20' : 'sm:w-56'
      } w-80 bg-[#42427D] text-white h-full p-6 pe-0 transition-[width] duration-300 ease-in-out relative select-none`}
    >
      {/* Logo */}
      <div className={`mb-10 px-1 flex items-center gap-2 ${collapsed ? 'justify-center' : 'px-5'}`}>
        <LucideShoppingCart size={24} />
        {!collapsed && (
          <h1 className="text-2xl font-bold transition-all duration-300 ease-in-out select-text">ShopNow</h1>
        )}
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute bottom-14 -right-3 transition-all duration-300 ease-in-out hidden sm:block bg-[#42427d] text-white p-1 rounded-full shadow-md"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-4">
        {/* Dashboard */}
        <NavLink
          to="/"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex items-center gap-2 ${
              collapsed ? 'justify-center' : 'ps-3 pe-5'
            } py-3 rounded-[13px] rounded-tr-[0px] rounded-br-[0px] transition relative ${
              isActive ? 'text-[#5840BB] font-medium active-tab active-tab-bg' : 'hover:bg-purple-700'
            }`
          }
          title={collapsed ? 'Dashboard' : undefined}
        >
          <LayoutDashboard />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        {/* Products with submenu */}
<div>
  <button
    onClick={() => setProductOpen(!productOpen)}
    className={`w-full flex items-center gap-2 ${
      collapsed ? 'justify-center' : 'ps-3 pe-5'
    } py-3 rounded-[13px] rounded-tr-[0px] rounded-br-[0px] transition ${
      (isProductActive || productOpen) && !collapsed
        ? 'text-white font-medium bg-purple-700'
        : 'hover:bg-purple-700'
    }`}
  >
    <BarChart2 />
    {!collapsed && (
      <>
        <span className="flex-1 text-left">Products</span>
        {productOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </>
    )}
  </button>

  {!collapsed && productOpen && (
    <div className="ml-8 mt-1 space-y-1">
      <NavLink
        to="/products"
        onClick={handleNavClick}
        className={({ isActive }) =>
          `block text-sm rounded rounded-r-none px-2 py-2 transition ${
            isActive ? 'text-[#5840BB] font-medium bg-white active-tab active-tab-bg' : 'hover:text-white/80'
          }`
        }
      >
        All Products
      </NavLink>
      <NavLink
        to="/addproducts"
        onClick={handleNavClick}
        className={({ isActive }) =>
          `block text-sm rounded rounded-r-none px-2 py-2 transition ${
            isActive ? 'text-[#5840BB] font-medium bg-white active-tab active-tab-bg' : 'hover:text-white/80'
          }`
        }
      >
        Add Product
      </NavLink>
      <NavLink
        to="/categories"
        onClick={handleNavClick}
        className={({ isActive }) =>
          `block text-sm rounded rounded-r-none px-2 py-2 transition ${
            isActive ? 'text-[#5840BB] font-medium bg-white active-tab' : 'hover:text-white/80'
          }`
        }
      >
        Categories
      </NavLink>
    </div>
  )}
</div>


        {/* Orders */}
        <NavLink
          to="/orders"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex items-center gap-2 ${
              collapsed ? 'justify-center' : 'ps-3 pe-5'
            } py-3 rounded-[13px] rounded-tr-[0px] rounded-br-[0px] transition relative ${
              isActive ? 'text-[#5840BB] font-medium active-tab active-tab-bg' : 'hover:bg-purple-700'
            }`
          }
          title={collapsed ? 'Orders' : undefined}
        >
          <ShoppingBag />
          {!collapsed && <span>Orders</span>}
        </NavLink>

        {/* Payments */}
        <NavLink
          to="/payments"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex items-center gap-2 ${
              collapsed ? 'justify-center' : 'ps-3 pe-5'
            } py-3 rounded-[13px] rounded-tr-[0px] rounded-r-[0px] transition relative ${
              isActive ? 'text-[#5840BB] font-medium active-tab active-tab-bg' : 'hover:bg-purple-700'
            }`
          }
          title={collapsed ? 'Payments' : undefined}
        >
          <IndianRupee />
          {!collapsed && <span>Payments</span>}
        </NavLink>

        {/* Marketing */}
        <NavLink
          to="/marketing"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex items-center gap-2 ${
              collapsed ? 'justify-center' : 'ps-3 pe-5'
            } py-3 rounded-[13px] rounded-tr-[0px] rounded-br-[0px] transition relative ${
              isActive ? 'text-[#5840BB] font-medium active-tab active-tab-bg' : 'hover:bg-purple-700'
            }`
          }
          title={collapsed ? 'Marketing' : undefined}
        >
          <Star />
          {!collapsed && <span>Marketing</span>}
        </NavLink>
      </nav>
    </aside>
  );
}
