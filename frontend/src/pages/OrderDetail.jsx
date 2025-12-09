import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import Header from "../components/Header";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        // Support wrapped or unwrapped response
        setOrder(res.data.data || res.data.order || res.data);
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="text-red-600 font-bold text-lg mb-2">Failed to load order</div>
        <p className="text-gray-500 mb-6">{error || "Order not found"}</p>
        <Link to="/my-orders" className="bg-gray-900 text-white px-6 py-2 rounded-lg">Back to Orders</Link>
      </div>
    </div>
  );

  const items = order.items || order.order_items || [];
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    cod: "bg-gray-100 text-gray-800"
  };
  const statusClass = statusColors[order.status?.toLowerCase()] || "bg-gray-100 text-gray-800";

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/my-orders" className="hover:text-gray-900 transition-colors">My Orders</Link>
          <span>/</span>
          <span className="font-medium text-gray-900">Order #{order.id}</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Order Header */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-500 text-sm mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
              </p>
            </div>
            <div className={`px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-wide w-fit ${statusClass}`}>
              {order.status || 'Processing'}
            </div>
          </div>

          {/* Items */}
          <div className="p-6">
            <h2 className="font-bold text-gray-900 mb-4">Items ({items.length})</h2>
            <div className="divide-y divide-gray-100">
              {items.map(item => {
                const product = item.product || item;
                return (
                  <div key={item.id} className="py-4 flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                      {product.thumbnail_url && <img src={product.thumbnail_url} className="w-full h-full object-cover" alt="" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{product.title || product.name || `Product #${item.product_id}`}</h3>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₹ {(item.unit_price || item.price || 0).toLocaleString()}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Price section */}
          <div className="bg-gray-50 border-t border-gray-100 p-6">
            <div className="flex flex-col gap-2 max-w-xs ml-auto">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹ {order.total_amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-dashed border-gray-300 pt-2 mt-2">
                <span>Total</span>
                <span>₹ {order.total_amount?.toLocaleString()}</span>
              </div>
            </div>

            {order.payment_method === 'cod' && (
              <div className="mt-4 text-right">
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">Payment Mode: Cash on Delivery</span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Info Card (Optional) */}
        {order.address && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-3">Shipping Details</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{order.address}</p>
            {order.guest_phone && <p className="text-gray-600 mt-2">Phone: {order.guest_phone}</p>}
          </div>
        )}

      </div>
    </div>
  );
}
