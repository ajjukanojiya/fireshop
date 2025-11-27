import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { items  = [], reload } = useCart(); // default empty array
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // safe total calculation
  const total = (items || []).reduce(
    (sum, item) => sum + ((item.product?.price || 0) * (item.quantity || 0)),
    0
  );

 

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/checkout');
     
      await reload(); // reload cart state
      navigate("/"); // redirect to home or order confirmation
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.message || e.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) return <div className="text-center mt-20">Your cart is empty</div>;

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>

      {items.map(item => (
        <div key={item.id} className="flex justify-between items-center py-2 border-b">
          <div>
            <div className="font-medium">{item.product?.title}</div>
            <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
          </div>
          <div>₹ {(item.product?.price || 0) * (item.quantity || 0)}</div>
        </div>
      ))}

      <div className="mt-4 flex justify-between font-semibold text-lg">
        <div>Total</div>
        <div>₹ {total}</div>
      </div>

      {error && <div className="text-red-600 mt-2">{error}</div>}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {loading ? "Processing..." : "Pay & Place Order"}
      </button>
    </div>
  );
}
