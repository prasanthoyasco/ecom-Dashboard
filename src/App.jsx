import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import './App.css'
import ComingSoonPage from './pages/ComingSoonPage';
import OrderPage from './pages/dashboard/OrderPage';
import ProductList from './components/molecules/ProductList';
import ProductFormModal from './components/AddProducts/ProductFormModal';
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path='/orders' element={<OrderPage />} />
          <Route path='/products' element={<ProductList />} />
          <Route path='/Addproducts' element={<ProductFormModal />} />
          <Route path="*" element={<ComingSoonPage />} />
        </Route>
      </Routes>
    </Router>
  );
}