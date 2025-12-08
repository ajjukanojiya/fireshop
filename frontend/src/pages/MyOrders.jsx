import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function MyOrders() {
  // orders: null => not loaded yet, [] => loaded but empty, [..] => has data
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
        // NOTE: your backend route earlier was /my-orders — keep it, or change to /orders if that's the real one.
        const res = await api.get("/my-orders");
        console.log(res,'myorder');
        // support both shapes: { orders: [...] } or { data: [...] }
        const arr = res?.data?.orders ?? res?.data?.data ?? [];
        if (!mounted) return;
        setOrders(Array.isArray(arr) ? arr : []);
      } catch (e) {
        if (!mounted) return;
        const msg = e?.response?.data?.message || e.message || "Failed to load orders";
        setError(msg);
        // unauthorized -> redirect to home/login
        if (e?.response?.status === 401 || e?.response?.status === 403) {
          // delay a little so user sees message if needed
          setTimeout(() => navigate("/"), 800);
        }
        setOrders([]); // treat as loaded but empty on error (prevents infinite loading)
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // 1) Loading state -> show skeleton/loader
  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        {/* simple skeleton */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-md shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-full" />
          </div>
          <div className="bg-white p-4 rounded-md shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  // 2) Error (after loading)
  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  // 3) Loaded but empty: show friendly message
  if (!orders || orders.length === 0) {
    return <div className="p-4">No orders yet.</div>;
  }

  // 4) show orders
  return (
    <div className="min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="bg-white p-4 rounded-md shadow mb-4">
          <div className="flex justify-between mb-2">
            <span>Order ID: {order.id}</span>
            <span>
              Total: $
              {Number(order.total_amount ?? order.total ?? 0).toFixed(2)}
            </span>
          </div>
          <div className="mb-2">Status: {order.status}</div>

          <div>
            {(order.items ?? []).map((item) => {
              const prod = item.product ?? {};
              // price fallback: product.price or item.unit_price or 0
              const unitPrice =
                Number(prod.price ?? item.unit_price ?? item.unitPrice ?? 0);
              const qty = Number(item.quantity ?? 1);
              return (
                <div
                  key={item.id}
                  className="flex justify-between border-b py-1 items-center"
                >
                  <div className="flex items-center gap-3">
                    {prod.thumbnail_url ? (
                      <img
                        src={prod.thumbnail_url}
                        alt={prod.title || "product"}
                        className="w-16 h-12 object-cover rounded"
                      />
                    ) : null}
                    <div>
                      <div className="font-medium">{prod.title ?? `Product #${item.product_id}`}</div>
                      <div className="text-sm text-gray-600">Qty: {qty}</div>
                    </div>
                  </div>

                  <div>${(unitPrice * qty).toFixed(2)}</div>
                </div>
              );
            })}
          </div>

          <button
            className="mt-2 bg-teal-500 text-white py-1 px-3 rounded-md"
            onClick={() => navigate(`/order-success/${order.id}`)}
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}
