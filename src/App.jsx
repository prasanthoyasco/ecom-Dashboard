import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import ComingSoonPage from './pages/ComingSoonPage';
import OrderPage from './pages/OrderPage';
import ProductList from './components/molecules/ProductList';
import ProductFormModal from './components/AddProducts/ProductFormModal';
import { Toaster } from 'react-hot-toast';
import './App.css';
import MarketingPage from './pages/MarketingPage';
import PaymentDashboard from './components/molecules/PaymentDashboard';
import TopSellersList from './pages/TopSellers';
import CategoryPage from './pages/Categorypage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/topsellers" element={<TopSellersList />} />
          <Route path="/Addproducts" element={<ProductFormModal />} />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route path="/payments" element={<PaymentDashboard />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="*" element={<ComingSoonPage />} />
        </Route>
      </Routes>
      <Toaster position="bottom-center" />
    </Router>
  );
}
