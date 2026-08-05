import React, { useState, useEffect } from "react";
import { Outlet, NavLink, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartPulseLogo from "../components/Logo/CartPulseLogo";
import {
  FiGrid, FiUsers, FiBriefcase, FiShoppingBag,
  FiPackage, FiMenu, FiX, FiHome, FiLogOut, FiTag, FiMessageCircle, FiLayers, FiInbox, FiRefreshCw, FiBarChart2, FiZap, FiUserCheck,
} from "react-icons/fi";
import api from "../services/api";
import adminService from "../services/adminService";

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatUnread, setChatUnread] = useState(0);
  const [insightsUnread, setInsightsUnread] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  const isFullAdmin = user?.is_admin;
  const isEmployee = user?.is_staff && !user?.is_admin;
  const visiblePerms = isEmployee ? (Array.isArray(user?.employee_permissions) ? user.employee_permissions : []) : null;

  // Chat unread poll
  useEffect(() => {
    if (!user) return;
    const fetch = () => api.get("/chat/admin/unread/").then((r) => setChatUnread(r.data.count || 0)).catch(() => {});
    fetch();
    const t = setInterval(fetch, 8000);
    return () => clearInterval(t);
  }, [user]);

  // Pending orders count
  useEffect(() => {
    if (!user) return;
    const fetch = () => adminService.getOrders("pending").then((r) => {
      const data = r.data?.results || r.data || [];
      setPendingOrders(data.length);
    }).catch(() => {});
    fetch();
    const t = setInterval(fetch, 30000);
    return () => clearInterval(t);
  }, [user]);

  // Insights unread count — compare total count vs last seen
  useEffect(() => {
    if (!user) return;
    const checkInsights = () => {
      // Don't show badge while on the insights page itself
      if (location.pathname.includes("/insights")) {
        setInsightsUnread(0);
        return;
      }
      adminService.getInsights().then((r) => {
        const all = r.data.insights || [];
        const total = all.length;
        const seen = parseInt(localStorage.getItem("insights_seen_count") || "0", 10);
        const newCount = Math.max(total - seen, 0);
        // Always show critical count even if all were seen before
        const criticalCount = all.filter(i => i.severity === "critical").length;
        setInsightsUnread(newCount > 0 ? newCount : criticalCount);
      }).catch(() => {});
    };
    checkInsights();
    const t = setInterval(checkInsights, 60000);
    return () => clearInterval(t);
  }, [user, location.pathname]);

  const NAV = [
    { to: "/admin/dashboard",            icon: <FiGrid />,          label: "Overview" ,     end: true },
    { to: "/admin/dashboard/insights",   icon: <FiZap />,           label: "Smart Insights", badge: insightsUnread, pageKey: "insights" },
    { to: "/admin/dashboard/users",      icon: <FiUsers />,         label: "Users",          pageKey: "users" },
    { to: "/admin/dashboard/traders",    icon: <FiBriefcase />,     label: "Traders",        pageKey: "traders" },
    { to: "/admin/dashboard/orders",     icon: <FiShoppingBag />,   label: "Orders",         badge: pendingOrders, pageKey: "orders" },
    { to: "/admin/dashboard/products",   icon: <FiPackage />,       label: "Products",       pageKey: "products" },
    { to: "/admin/dashboard/categories", icon: <FiTag />,           label: "Categories",     pageKey: "categories" },
    { to: "/admin/dashboard/brands",     icon: <FiLayers />,        label: "Brands",         pageKey: "brands" },
    { to: "/admin/dashboard/chat",       icon: <FiMessageCircle />, label: "Chat",           badge: chatUnread, pageKey: "chat" },
    { to: "/admin/dashboard/inquiries",  icon: <FiInbox />,         label: "Inquiries",      pageKey: "inquiries" },
    { to: "/admin/dashboard/returns",    icon: <FiRefreshCw />,     label: "Returns",        pageKey: "returns" },
    { to: "/admin/dashboard/analytics",  icon: <FiBarChart2 />,     label: "Analytics",      pageKey: "analytics" },
    { to: "/admin/dashboard/employees",  icon: <FiUserCheck />,     label: "Employees",      adminOnly: true },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  if (!user || (!user.is_admin && !user.is_staff)) {
    return <Navigate to="/login" state={{ from: "/admin/dashboard" }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar — always fixed */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-gray-900 flex flex-col transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 flex-shrink-0">
          <CartPulseLogo size={28} textClass="text-base font-extrabold" dark />
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400"><FiX /></button>
        </div>

        <div className="px-4 py-3 border-b border-gray-800 flex-shrink-0">
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Admin Panel</p>
          <p className="text-sm font-bold text-white mt-0.5 truncate">{user.email}</p>
          {user.phone && <p className="text-xs text-gray-400 truncate">{user.phone}</p>}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV
            .filter((item) => {
              if (item.adminOnly) return isFullAdmin;
              if (isEmployee) {
                if (item.pageKey) return visiblePerms.includes(item.pageKey);
                return visiblePerms.length > 0; // Overview: show only if employee has any perm
              }
              return true;
            })
            .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors
                ${isActive ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {item.badge > 0 && (
                <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800 space-y-1 flex-shrink-0">
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

      {/* Main — offset by sidebar width on lg */}
      <div className="lg:ml-60 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-4 lg:hidden sticky top-0 z-20">
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
