import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import Header from "../components/Header";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/orders/${orderId}`);
        const o = res?.data?.order ?? res?.data;
        setOrder(o);
      } catch (e) {
        console.error("fetch order err", e);
        setError(e?.response?.data?.message || e.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-red-600 text-xl font-bold mb-2">Oops! Something went wrong.</div>
        <div className="text-gray-600 mb-6">{error}</div>
        <button onClick={() => navigate('/')} className="bg-gray-900 text-white px-6 py-2 rounded-lg">Go Home</button>
      </div>
    </div>
  );

  if (!order) return <div className="text-center mt-12">Order not found</div>;

  const items = order.items ?? order.order_items ?? [];
  const total = order.total_amount ?? order.total ?? order.price ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-center p-8 md:p-12 mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 text-lg mb-8">Thank you for your purchase. Your order has been received.</p>

          <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
            <span className="text-gray-500 text-sm font-medium">Order ID:</span>
            <span className="text-gray-900 font-bold font-mono text-sm">#{order.id}</span>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Order Details</h3>
            <span className="text-sm text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleString() : ""}</span>
          </div>

          <div className="p-6 divide-y divide-gray-100">
            {items.map((item) => {
              const product = item.product ?? item.product_data ?? item;
              const qty = item.quantity ?? item.qty ?? 1;
              const price = (product?.price ?? item.price ?? 0);
              return (
                <div key={item.id ?? `${product?.id}-${Math.random()}`} className="py-4 flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                    {product?.thumbnail_url ? <img src={product.thumbnail_url} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{product?.title ?? product?.name ?? "Product"}</div>
                    <div className="text-sm text-gray-500 mt-1">Qty: {qty}</div>
                  </div>
                  <div className="font-bold text-gray-900">₹ {(price * qty).toLocaleString()}</div>
                </div>
              );
            })}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-gray-900">Total Paid</span>
              <span className="text-green-600">₹ {Number(total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate("/")} className="px-8 py-3 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Continue Shopping
          </button>
          <button onClick={() => navigate("/my-orders")} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
            Track Order
          </button>
        </div>

      </div>
    </div>
  );
}
