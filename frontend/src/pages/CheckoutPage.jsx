// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  // use items (your CartContext uses `items`) — default to empty array
  const { items = [], reload } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // safe total calculation
  const total = (items || []).reduce(
    (sum, item) => sum + ((item.product?.price || 0) * (item.quantity || 0)),
    0
  );

  const handleCheckout = async () => {
    // If user is not logged in, send them to guest checkout page (collect phone/address)
    if (!user && !localStorage.getItem("token")) {
      navigate("/guest-checkout");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // POST to backend /checkout (backend should use auth:sanctum and user must be authenticated)
      const res = await api.post("/checkout");

      // backend should return created order in res.data.order (or res.data)
      // try to read order id flexibly
      const order = res?.data?.order ?? res?.data;
      const orderId = order?.id ?? order?.order_id ?? null;

      if (!orderId) {
        // if backend doesn't return order id, navigate home but show success
        alert(res?.data?.message || "Order placed");
        await reload();
        navigate("/");
        return;
      }

      // reload cart state (server cart should now be empty)
      try { await reload(); } catch(e){}

      // navigate to order confirmation page
      navigate(`/order/${orderId}`);

    } catch (e) {
      console.error("Checkout error:", e);
      const msg = e?.response?.data?.message || e.message || "Checkout failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return <div className="text-center mt-20">Your cart is empty</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-2 border-b">
            <div>
              <div className="font-medium">{item.product?.title || "Unknown product"}</div>
              <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
              {item.meta && <div className="text-xs text-slate-500">Note: {JSON.stringify(item.meta)}</div>}
            </div>
            <div>₹ {((item.product?.price || 0) * (item.quantity || 0)).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between font-semibold text-lg">
        <div>Total</div>
        <div>₹ {total.toFixed(2)}</div>
      </div>

      {error && <div className="text-red-600 mt-2">{error}</div>}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {loading ? "Processing..." : `Pay & Place Order (${items.length} items)`}
      </button>
    </div>
  );
}
