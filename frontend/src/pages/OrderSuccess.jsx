import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) return;

    (async () => {
      try {
        const res = await api.get(`/order-success/${orderId}`);
        setOrder(res.data.order);
      } catch (e) {
        alert(e?.response?.data?.message || e.message);
        navigate("/"); // Redirect if order not found
      }
    })();
  }, [orderId]);

  if (!order) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
      <p className="mb-4">Order ID: <strong>{order.id}</strong></p>
      <p className="mb-4">
  Total: <strong>₹{Number(order.total_amount).toFixed(2)}</strong>
</p>



      <div className="w-full max-w-lg bg-white p-4 rounded-md shadow">
        <h3 className="font-semibold mb-2">Items:</h3>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between border-b py-2">
            <span>{item.product.title} x {item.quantity}</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-teal-500 text-white py-2 px-4 rounded-md"
      >
        Continue Shopping
      </button>
    </div>
  );
}
