import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
// Header removed

export default function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/my-orders");
        // support both shapes
        const arr = res?.data?.orders ?? res?.data?.data ?? [];
        if (!mounted) return;
        setOrders(Array.isArray(arr) ? arr : []);
      } catch (e) {
        if (!mounted) return;
        const msg = e?.response?.data?.message || e.message || "Failed to load orders";
        setError(msg);
        if (e?.response?.status === 401 || e?.response?.status === 403) {
          setTimeout(() => navigate("/"), 800);
        }
        setOrders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h2>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                  <div className="flex justify-between mb-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/6"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center p-4 h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800">Oops! Something went wrong</h2>
            <p className="text-gray-600 mt-2">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  // --- Empty State ---
  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center p-4 text-center h-[calc(100vh-80px)]">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">No orders yet</h2>
          <p className="text-gray-500 mt-2 max-w-sm">Looks like you haven't placed any orders yet. Start exploring our collection!</p>
          <button
            onClick={() => navigate('/')}
            className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  // --- Content State ---
  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">My Orders</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Order History & Tracking</p>
          </div>
          <span className="bg-[#991b1b] text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-900/20">
            {orders.length} TOTAL Orders
          </span>
        </div>

        <div className="space-y-8">
          {orders.map((order) => {
            const status = order.status || 'Pending';
            const statusMap = {
              pending: { color: 'text-amber-600 bg-amber-50', icon: '⏳', label: 'Order Received' },
              processing: { color: 'text-blue-600 bg-blue-50', icon: '⚙️', label: 'Preparing' },
              shipped: { color: 'text-indigo-600 bg-indigo-50', icon: '🚚', label: 'On the Way' },
              delivered: { color: 'text-emerald-600 bg-emerald-50', icon: '✅', label: 'Delivered' },
              cancelled: { color: 'text-red-600 bg-red-50', icon: '❌', label: 'Cancelled' },
            };
            const s = statusMap[status.toLowerCase()] || statusMap.pending;

            return (
              <div key={order.id} className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500">

                {/* Header Section */}
                <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-slate-100">📦</div>
                    <div>
                      <h3 className="font-black text-xl text-slate-900 leading-none">Order #{order.id}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Placed: {new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end">
                    <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${s.color}`}>
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                    </span>
                  </div>
                </div>

                {/* Tracking Progress Simulation (Mobile friendly) */}
                <div className="px-8 py-4 bg-slate-50/50 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-300">
                  <div className={`flex flex-col items-center gap-2 ${['pending', 'processing', 'shipped', 'delivered'].indexOf(status.toLowerCase()) >= 0 ? 'text-red-700' : ''}`}>
                    <div className={`w-3 h-3 rounded-full ${['pending', 'processing', 'shipped', 'delivered'].indexOf(status.toLowerCase()) >= 0 ? 'bg-red-600 shadow-lg shadow-red-200' : 'bg-slate-200'}`} />
                    Placed
                  </div>
                  <div className="flex-1 h-[2px] bg-slate-100 mx-2" />
                  <div className={`flex flex-col items-center gap-2 ${['processing', 'shipped', 'delivered'].indexOf(status.toLowerCase()) >= 0 ? 'text-red-700' : ''}`}>
                    <div className={`w-3 h-3 rounded-full ${['processing', 'shipped', 'delivered'].indexOf(status.toLowerCase()) >= 0 ? 'bg-red-600 shadow-lg shadow-red-200' : 'bg-slate-200'}`} />
                    Ready
                  </div>
                  <div className="flex-1 h-[2px] bg-slate-100 mx-2" />
                  <div className={`flex flex-col items-center gap-2 ${['shipped', 'delivered'].indexOf(status.toLowerCase()) >= 0 ? 'text-red-700' : ''}`}>
                    <div className={`w-3 h-3 rounded-full ${['shipped', 'delivered'].indexOf(status.toLowerCase()) >= 0 ? 'bg-red-600 shadow-lg shadow-red-200' : 'bg-slate-200'}`} />
                    Transit
                  </div>
                  <div className="flex-1 h-[2px] bg-slate-100 mx-2" />
                  <div className={`flex flex-col items-center gap-2 ${['delivered'].indexOf(status.toLowerCase()) >= 0 ? 'text-red-700' : ''}`}>
                    <div className={`w-3 h-3 rounded-full ${['delivered'].indexOf(status.toLowerCase()) >= 0 ? 'bg-red-600 shadow-lg shadow-red-200' : 'bg-slate-200'}`} />
                    Arrival
                  </div>
                </div>

                {/* Items Section */}
                <div className="p-6 md:p-8 space-y-6">
                  {(order.items ?? []).map((item) => {
                    const prod = item.product ?? {};
                    const price = Number(item.unit_price || prod.price || 0);

                    return (
                      <div key={item.id} className="flex gap-5 items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-[1.2rem] border border-slate-100 overflow-hidden flex-shrink-0 group">
                          <img src={prod.thumbnail_url} alt={prod.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-slate-800 text-sm md:text-base leading-tight mb-1">{prod.title}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.quantity} x ₹{price.toLocaleString()}</span>
                            <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">{prod.inner_unit || 'Pack'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900 text-base">₹ {(price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Amount</span>
                    <span className="text-2xl font-black text-slate-900 leading-none">₹ {Number(order.total_amount || 0).toLocaleString()}</span>
                  </div>

                  <div className="flex gap-3">
                    {status.toLowerCase() === 'delivered' && !order.refund && (
                      <button
                        onClick={() => navigate(`/my-orders/${order.id}?action=refund`)}
                        className="bg-white border border-red-100 text-red-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm active:scale-95"
                      >
                        ↩️ Refund
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/order-success/${order.id}`, { state: { order } })}
                      className="bg-[#0f172a] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-[#991b1b] transition-all flex items-center gap-2 active:scale-95"
                    >
                      Track Details <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
