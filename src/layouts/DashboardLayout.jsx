import { Outlet } from 'react-router-dom';
import Sidebar from "../components/organisms/sidebar";
import Header from '../components/organisms/Header';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#42427D]">
      <Sidebar />
      <div className="flex-1 flex flex-col rounded-[40px] bg-white my-3 me-3">
        <Header />
        <main className="flex-1 overflow-auto p-3 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}