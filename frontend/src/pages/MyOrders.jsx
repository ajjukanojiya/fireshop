import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/my-orders");
        console.log(res.data.orders,'bbb');
        const arr = res?.data?.orders ?? [];
        console.log(arr,'aaajyaaa');
        setOrders(Array.isArray(arr) ? arr : []);
      } catch (e) {
        alert(e?.response?.data?.message || e.message);
        navigate("/"); // redirect if unauthorized
      }
    })();
  }, []);

  if (!orders.length) return <div className="p-4">No orders yet.</div>;

  return (
    <div className="min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="bg-white p-4 rounded-md shadow mb-4">
          <div className="flex justify-between mb-2">
            <span>Order ID: {order.id}</span>
            <span>Total: ${Number(order.total_amount ?? order.total ?? 0).toFixed(2)}</span>
          </div>
          <div className="mb-2">Status: {order.status}</div>
          <div>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between border-b py-1">
                <span>{item.product.title} x {item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
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
