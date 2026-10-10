import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo.svg";

const DashboardLayout = () => {
  return (
    <div className="drawer drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <Navbar />
        {/* Page content here */}
        <div className="py-4 px-6">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side ">
        <div className="flex min-h-full flex-col items-start bg-[#0F172A] text-white/80 w-64">
          <div className="flex items-center justify-center px-6 gap-3 h-16 w-full border-b border-white/10">
            <div>
              <img src={logo} alt="logo" className="min-w-9" />
            </div>
            <h1 className="font-bold text-sm">Inventory Management System</h1>
          </div>
          {/* Sidebar content here */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
