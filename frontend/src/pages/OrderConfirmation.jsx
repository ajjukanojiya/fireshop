// src/pages/OrderConfirmation.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

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
        // backend may return { order: {...} } or {...}
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

  if (loading) return <div className="text-center mt-12">Loading order...</div>;
  if (error) return <div className="text-center mt-12 text-red-600">{error}</div>;
  if (!order) return <div className="text-center mt-12">Order not found</div>;

  // support different field names
  const items = order.items ?? order.order_items ?? [];
  const total = order.total_amount ?? order.total ?? order.price ?? 0;

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Order Confirmed!</h2>

      <div className="mb-4">
        <div><strong>Order ID:</strong> {order.id}</div>
        <div><strong>Status:</strong> {order.status ?? "paid"}</div>
        <div><strong>Date:</strong> {order.created_at ? new Date(order.created_at).toLocaleString() : ""}</div>
      </div>

      <h3 className="font-medium mb-2">Items:</h3>
      <div className="space-y-2">
        {items.map((item) => {
          // product may be nested differently
          const product = item.product ?? item.product_data ?? item;
          const qty = item.quantity ?? item.qty ?? 1;
          const price = (product?.price ?? item.price ?? 0);
          return (
            <div key={item.id ?? `${product?.id}-${Math.random()}`} className="flex justify-between p-2 border rounded">
              <div>
                <div className="font-medium">{product?.title ?? product?.name ?? "Product"}</div>
                <div className="text-sm text-gray-600">Qty: {qty}</div>
              </div>
              <div>₹ {(price * qty).toFixed(2)}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between font-semibold text-lg">
        <div>Total</div>
        <div>₹ {Number(total).toFixed(2)}</div>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={() => navigate("/")} className="bg-emerald-600 text-white px-4 py-2 rounded">Back to Home</button>
        <button onClick={() => navigate("/my-orders")} className="bg-slate-900 text-white px-4 py-2 rounded">My Orders</button>
      </div>
    </div>
  );
}
