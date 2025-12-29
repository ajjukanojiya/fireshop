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
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">My Orders</h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{orders.length} Orders</span>
          </div>

          <div className="space-y-6">
            {orders.map((order) => {
              // Determine status color
              const status = order.status || 'Pending';
              let statusColor = 'bg-yellow-100 text-yellow-800';
              if (status.toLowerCase() === 'delivered') statusColor = 'bg-green-100 text-green-800';
              else if (status.toLowerCase() === 'cancelled') statusColor = 'bg-red-100 text-red-800';
              else if (status.toLowerCase() === 'shipped') statusColor = 'bg-blue-100 text-blue-800';

              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-50 gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-gray-900">Order #{order.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${statusColor}`}>
                          {status}
                        </span>
                      </div>
                      {/* Add date here if available in order object, e.g. <div className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div> */}
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-sm text-gray-500">Total Amount</div>
                      <div className="text-xl font-bold text-gray-900">₹ {Number(order.total_amount ?? order.total ?? 0).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-6 space-y-4">
                    {(order.items ?? []).map((item) => {
                      const prod = item.product ?? {};
                      const unitPrice = Number(prod.price ?? item.unit_price ?? item.unitPrice ?? 0);
                      const qty = Number(item.quantity ?? 1);

                      return (
                        <div key={item.id} className="flex items-start gap-4">
                          <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            {prod.thumbnail_url ? (
                              <img src={prod.thumbnail_url} alt={prod.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate pr-4">{prod.title ?? `Product #${item.product_id}`}</h4>
                            <p className="text-sm text-gray-500 mt-1">Qty: {qty}</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1 sm:hidden">₹ {(unitPrice * qty).toLocaleString()}</p>
                          </div>
                          <div className="hidden sm:block text-right">
                            <p className="font-medium text-gray-900">₹ {(unitPrice * qty).toLocaleString()}</p>
                            {qty > 1 && <p className="text-xs text-gray-500">₹ {unitPrice.toLocaleString()} each</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    {/* Refund Logic */}
                    {status.toLowerCase() === 'delivered' && !order.refund && (
                      <button
                        onClick={() => navigate(`/my-orders/${order.id}?action=refund`)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center gap-1 transition-colors border border-red-200 px-3 py-1 rounded bg-red-50 hover:bg-red-100"
                      >
                        ↩️ Request Refund
                      </button>
                    )}

                    {order.refund && (
                      <span className={`px-3 py-1 rounded text-sm font-medium border ${order.refund.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                        order.refund.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                        {order.refund.status === 'approved' ? 'Refunded' :
                          order.refund.status === 'rejected' ? 'Refund Rejected' :
                            'Refund Pending'}
                      </span>
                    )}

                    {/* Fallback for manually updated status without refund record */}
                    {status.toLowerCase() === 'refunded' && !order.refund && (
                      <span className="px-3 py-1 rounded text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                        Refunded
                      </span>
                    )}
                    <button
                      onClick={() => navigate(`/order-success/${order.id}`, { state: { order } })}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition-colors"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
