import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX, FiShield,
  FiShoppingBag, FiMessageSquare, FiXCircle, FiLogOut, FiMapPin, FiCreditCard,
  FiGrid, FiMessageCircle,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import CartPulseLogo from "../Logo/CartPulseLogo";
import api from "../../services/api";

const API_BASE = process.env.REACT_APP_API_URL?.replace("/api/v1", "") || "http://127.0.0.1:8000";
const toAbsolute = (url) => (!url ? "" : url.startsWith("http") ? url : `${API_BASE}${url}`);

const SearchSuggestions = ({ suggestions, onSelect, visible }) => {
  if (!visible || !suggestions.length) return null;
  return (
    <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      {suggestions.map((p) => (
        <li key={p.id}>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onSelect(p); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
          >
            {p.primary_image && (
              <img src={toAbsolute(p.primary_image)} alt={p.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
              <p className="text-xs text-gray-400 truncate">{p.category_name || p.brand_name || ""}</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
};

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Brands", to: "/brands" },
  { label: "Contact", to: "/contact" },
];

const AccountModal = ({ user, onClose, onLogout }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const items = [
    { icon: <FiShoppingBag />, label: "My Orders", to: "/orders" },
    { icon: <FiMessageSquare />, label: "Inbox", to: "/inbox" },
    { icon: <FiMessageCircle />, label: "Chat Support", to: "/chat" },
    { icon: <FiMapPin />, label: "Change Location", to: "/profile/location" },
    { icon: <FiCreditCard />, label: "Payment Methods", to: "/profile/payment" },
    { icon: <FiXCircle />, label: "Close Account", to: "/profile/close", danger: true },
  ];

  const isTrader = user?.is_trader && user?.trader_profile?.status === "approved";

  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden" ref={ref}>
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-cyan-50 border-b border-gray-100">
        <p className="text-sm font-bold text-gray-900 truncate">{user?.first_name || user?.username || "Account"}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
      </div>

      {/* Trader shortcut */}
      {isTrader && (
        <Link
          to="/trader/dashboard"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors border-b border-indigo-100"
        >
          <FiGrid className="text-base" /> My Trader Dashboard
        </Link>
      )}

      {/* Menu items */}
      <div className="py-1">
        {items.map(({ icon, label, to, danger }) => (
          <Link
            key={label}
            to={to}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
              danger
                ? "text-red-500 hover:bg-red-50"
                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            }`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100 py-1">
        <button
          onClick={() => { onLogout(); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
        >
          <FiLogOut className="text-base" /> Logout
        </button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatUnread, setChatUnread] = useState(0);
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (user) {
      api.get("/notifications/unread-count/")
        .then((r) => setUnreadCount(r.data.count || 0))
        .catch(() => {});
      api.get("/chat/my/unread/")
        .then((r) => setChatUnread(r.data.count || 0))
        .catch(() => {});
    } else {
      setUnreadCount(0);
      setChatUnread(0);
    }
  }, [user]);

  const fetchSuggestions = useCallback((q) => {
    if (!q.trim()) { setSuggestions([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      api.get("/products/search/", { params: { q } })
        .then((r) => {
          const list = Array.isArray(r.data) ? r.data : (r.data.results ?? []);
          setSuggestions(list.slice(0, 5));
        })
        .catch(() => setSuggestions([]));
    }, 250);
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setShowSuggestions(true);
    fetchSuggestions(val);
  };

  const handleSuggestionSelect = (product) => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchOpen(false);
    navigate(`/product/${product.slug}`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleUserClick = () => {
    if (!user) { navigate("/login"); return; }
    setAccountOpen((v) => !v);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg" : "bg-white shadow-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <CartPulseLogo size={34} textClass="text-xl font-extrabold" />
          </Link>

          {/* Search bar — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl items-center bg-gray-100 rounded-xl px-4 py-2 gap-2 focus-within:ring-2 focus-within:ring-primary-500 transition-all relative"
          >
            <FiSearch className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search for laptops, phones, gaming gear..."
              className="bg-transparent flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <SearchSuggestions suggestions={suggestions} onSelect={handleSuggestionSelect} visible={showSuggestions} />
          </form>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "text-primary-600 bg-primary-50" : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <FiSearch className="text-xl" />
            </button>

            <Link to="/wishlist" className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Wishlist">
              <FiHeart className="text-xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {user && (
              <Link to="/inbox" className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Inbox">
                <FiMessageSquare className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {user && (
              <Link to="/chat" className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Chat Support">
                <FiMessageCircle className="text-xl" />
                {chatUnread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {chatUnread > 9 ? "9+" : chatUnread}
                  </span>
                )}
              </Link>
            )}

            <Link to="/cart" className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Cart">
              <FiShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Trader dashboard shortcut */}
            {user?.is_trader && user?.trader_profile?.status === "approved" && (
              <Link
                to="/trader/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                aria-label="Trader Dashboard"
              >
                <FiGrid className="text-sm" /> My Store
              </Link>
            )}

            {/* Admin shortcut */}
            {user && (user.is_admin || user.is_staff) && (
              <Link to="/admin/dashboard" className="hidden sm:flex p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Admin">
                <FiShield className="text-xl" />
              </Link>
            )}

            {/* User icon — opens account modal */}
            <div className="relative hidden sm:block">
              <button
                onClick={handleUserClick}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Account"
              >
                <FiUser className="text-xl" />
              </button>
              {accountOpen && user && (
                <AccountModal user={user} onClose={() => setAccountOpen(false)} onLogout={logout} />
              )}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <form
            onSubmit={handleSearch}
            className="md:hidden pb-3 flex items-center bg-gray-100 rounded-xl px-4 py-2 gap-2 focus-within:ring-2 focus-within:ring-primary-500 relative"
          >
            <FiSearch className="text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search products..."
              className="bg-transparent flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <SearchSuggestions suggestions={suggestions} onSelect={handleSuggestionSelect} visible={showSuggestions} />
          </form>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="lg:hidden pb-4 border-t border-gray-100 pt-3">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive ? "text-primary-600 bg-primary-50" : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"><FiShoppingBag /> My Orders</Link>
                  <Link to="/inbox" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"><FiMessageSquare /> Inbox</Link>
                  <Link to="/chat" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"><FiMessageCircle /> Chat Support</Link>
                  {user?.is_trader && user?.trader_profile?.status === "approved" && (
                    <Link to="/trader/dashboard" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center gap-2"><FiGrid /> My Trader Dashboard</Link>
                  )}
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg flex items-center gap-2 w-full text-left"><FiLogOut /> Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"><FiUser /> Login</Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
