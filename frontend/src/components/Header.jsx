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

  console.log('1111toekn',loggedIn);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, [user]);

  useEffect(() => {
    if (!token) return;
    // api defaults header should already be set in main init; but set again to be safe
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    (async () => {
      try {
        const res = await api.get('/orders'); // returns all; we'll take first 5
        const orders = res.data.data || [];
        setRecentOrders(orders.slice(0,5));
      } catch (e) {
        console.error("Failed fetch orders", e);
      }
    })();
  }, [token]);

  const itemsCount = items ? items.reduce((s, it) => s + (it.quantity || 1), 0) : 0;

  const logout = async () => {
    try {
      // optional: call backend logout if you have endpoint, e.g. await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-slate-900">
          FireShop
        </Link>

        {/* Search */}
        <div className="flex-1 mx-6">
          <div className="relative">
            <input
              placeholder="Search fireworks, videos, packs..."
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-teal-500 text-white px-3 py-1 rounded-md">
              Search
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* If logged in show greeting + dropdown placeholder */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-700">Hello, <span className="font-medium">{user.name || user.phone}</span></div>
              {/* simple dropdown placeholder — you can replace with real dropdown */}
              <div className="relative">
                <button className="text-sm px-3 py-1 border rounded">{user.name ? "Account" : "Profile"}</button>
                {/* you can later add a small dropdown menu here */}
              </div>
              <button onClick={logout} className="text-sm text-red-600 font-medium">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="text-sm text-slate-700 font-medium">Sign in</Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="bg-slate-900 text-white px-3 py-2 rounded-md flex items-center"
          >
            Cart
            <span className="ml-2 bg-white text-slate-900 px-2 py-0.5 rounded-full">
              {itemsCount}
            </span>
          </Link>

          {/* <Link to="/my-orders" >My Orders</Link> */}
        </div>
      </div>
    </header>
  );
}
