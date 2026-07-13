import React, { useState } from "react";
import { Outlet, NavLink, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PrimeAisleLogo from "../components/Logo/PrimeAisleLogo";
import {
  FiGrid, FiUsers, FiBriefcase, FiShoppingBag,
  FiPackage, FiMenu, FiX, FiHome, FiLogOut, FiTag,
} from "react-icons/fi";

const NAV = [
  { to: "/admin/dashboard", icon: <FiGrid />, label: "Overview", end: true },
  { to: "/admin/dashboard/users", icon: <FiUsers />, label: "Users" },
  { to: "/admin/dashboard/traders", icon: <FiBriefcase />, label: "Traders" },
  { to: "/admin/dashboard/orders", icon: <FiShoppingBag />, label: "Orders" },
  { to: "/admin/dashboard/products", icon: <FiPackage />, label: "Products" },
  { to: "/admin/dashboard/categories", icon: <FiTag />, label: "Categories" },
];

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  if (!user || (!user.is_admin && !user.is_staff)) {
    return <Navigate to="/login" state={{ from: "/admin/dashboard" }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-gray-900 flex flex-col transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <PrimeAisleLogo size={28} textClass="text-base font-extrabold" dark />
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400"><FiX /></button>
        </div>

        <div className="px-4 py-3 border-b border-gray-800">
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Admin Panel</p>
          <p className="text-sm font-bold text-white mt-0.5 truncate">{user.email}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors
                ${isActive ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <FiHome /> View Store
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-red-900/40 hover:text-red-400 transition-colors">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 text-xl"><FiMenu /></button>
          <span className="font-extrabold text-gray-900">Admin Dashboard</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
