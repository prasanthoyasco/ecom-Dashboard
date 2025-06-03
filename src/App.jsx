import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import './App.css'
import ComingSoonPage from './pages/ComingSoonPage';
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="*" element={<ComingSoonPage />} />
        </Route>
      </Routes>
    </Router>
  );
}