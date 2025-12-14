// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";

export default function Header() {
  const navigate = useNavigate();
  const { items } = useCart();
  const { user, setUser } = useUser();

  const [token] = useState(localStorage.getItem('token'));
  const [recentOrders, setRecentOrders] = useState([]);
  const [open, setOpen] = useState(false);

  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, [user]);

  useEffect(() => {
    if (!token) return;
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }, [token]);

  const itemsCount = items ? items.reduce((s, it) => s + (it.quantity || 1), 0) : 0;

  const logout = async () => {
    try {
      // api logout if needed
    } catch (e) { }
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
          FireShop
        </Link>

        {/* Desktop Search - Hidden on mobile */}
        <div className="hidden md:block flex-1 max-w-xl mx-6">
          <div className="relative group">
            <input
              placeholder="Search fireworks, videos, packs..."
              className="w-full border border-gray-200 bg-gray-50 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all shadow-sm"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-6">

          {/* Mobile Search Icon (Placeholder if needed) */}

          {user ? (
            <div className="flex items-center gap-4">
              {/* My Orders Link - Visible on Desktop */}
              <Link
                to="/my-orders"
                className="hidden md:flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span>Orders</span>
              </Link>

              <Link
                to="/my-wallet"
                className="hidden md:flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
                title="My Wallet"
              >
                <span className="text-xl">💰</span>
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="hidden md:flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100 hover:bg-red-100 font-bold text-sm transition-colors"
                >
                  <span className="text-lg">🛡️</span>
                  <span>Admin</span>
                </Link>
              )}

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right leading-tight">
                  <div className="text-xs text-gray-500">Welcome back</div>
                  <div className="text-sm font-bold text-gray-800">{user.name || "User"}</div>
                </div>

                <button
                  onClick={logout}
                  className="text-sm border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-700 hover:text-red-600 font-medium transition-colors">Sign in</Link>
              <Link to="/signup" className="hidden sm:block bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">Register</Link>
            </div>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            {itemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                {itemsCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Bar (Bottom fixed or simple row below) - Optional but good for UX */}
      {/* For now, relying on top header. If user wants strictly mobile friendly, we just made search hidden on mobile to save space. */}
      {/* Let's add a small mobile search bar row if on mobile */}
      <div className="md:hidden px-4 pb-3">
        <input
          placeholder="Search..."
          className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>
    </header>
  );
}
