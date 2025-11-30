// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get("/orders");
       // console.log(res.data.orders.data,'aaa');
       // const arr = res?.data?.orders ?? res?.data ?? [];
        const arr = res?.data?.orders?.data ?? [];

        setOrders(Array.isArray(arr) ? arr : []);
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center mt-12">Loading orders...</div>;
  if (error) return <div className="text-center mt-12 text-red-600">{error}</div>;
  if (!orders || orders.length === 0) return <div className="text-center mt-12">No orders yet.</div>;
  console.log(orders,'bbb');
  return (
   
    <div className="max-w-6xl mx-auto mt-12">
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="flex justify-between p-4 bg-white rounded shadow">
            <div>
              <div className="font-medium">Order ID: {order.id}</div>
              <div className="text-sm text-gray-600">{order.created_at ? new Date(order.created_at).toLocaleString() : ""}</div>
              <div className="text-sm text-gray-600">Status: {order.status}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-semibold">₹ {Number(order.total_amount ?? order.total ?? 0).toFixed(2)}</div>
              <Link to={`/order/${order.id}`} className="bg-slate-900 text-white px-3 py-1 rounded">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
