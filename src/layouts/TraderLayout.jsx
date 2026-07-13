import React, { useState } from "react";
import { Outlet, NavLink, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiGrid, FiPackage, FiPlusCircle, FiUser,
  FiMenu, FiX, FiHome, FiClock,
} from "react-icons/fi";
import PrimeAisleLogo from "../components/Logo/PrimeAisleLogo";

const NAV = [
  { to: "/trader/dashboard", icon: <FiGrid />, label: "Overview", end: true },
  { to: "/trader/dashboard/products", icon: <FiPackage />, label: "My Products" },
  { to: "/trader/dashboard/add-product", icon: <FiPlusCircle />, label: "Add Product" },
  { to: "/trader/dashboard/profile", icon: <FiUser />, label: "Business Profile" },
];

const TraderLayout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: "/trader/dashboard" }} replace />;
  if (!user.is_trader) return <Navigate to="/trader/register" replace />;

  const isPending = user.trader_profile?.status === "pending";
  const isRejected = user.trader_profile?.status === "rejected";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-gray-100 flex flex-col transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link to="/">
            <PrimeAisleLogo size={28} textClass="text-base font-extrabold" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500"><FiX /></button>
        </div>

        <div className="px-4 py-4 border-b border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Business</p>
          <p className="text-sm font-bold text-gray-800 truncate">{user.trader_profile?.business_name || "—"}</p>
          <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full capitalize
            ${isPending ? "bg-yellow-100 text-yellow-700" : isRejected ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
            {user.trader_profile?.status || "pending"}
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors
                ${isActive ? "bg-primary-50 text-primary-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
            <FiHome /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 text-xl"><FiMenu /></button>
          <span className="font-extrabold text-gray-900">Trader Dashboard</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {isPending && (
            <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
              <FiClock className="flex-shrink-0 text-lg" />
              <p><span className="font-bold">Pending Approval —</span> Your account is under review. You can explore the dashboard but cannot list products yet.</p>
            </div>
          )}
          {isRejected && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
              <p><span className="font-bold">Application Rejected —</span> Please contact support for more information.</p>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TraderLayout;
