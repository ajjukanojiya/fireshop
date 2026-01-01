import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
// Header removed
import { useToast } from "../contexts/ToastContext";

export default function GuestCheckout() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    try {
      const cartString = localStorage.getItem("cart");
      const cart = cartString ? JSON.parse(cartString) : [];
      setCartItems(cart);

      const t = cart.reduce((acc, item) => {
        const price = item.product?.price || item.product_id || 0; // fallback if messy data
        return acc + (price * (item.quantity || 1));
      }, 0);
      setTotal(t);

    } catch (err) {
      console.error("Invalid cart JSON", err);
      setCartItems([]);
    }
  }, []);

  const placeOrder = async () => {
    if (!name || !phone || !address) {
      addToast("Please fill in all details", "error");
      return;
    }
    // STRICT COMPLIANCE: Check Pincode
    const { checkPincode, shopConfig } = await import('../config/shopConfig');

    // Extract pincode from address string (last 6 digits logic or simple regex)
    const pinMatch = address.match(/\b\d{6}\b/);
    const pincode = pinMatch ? pinMatch[0] : null;

    if (!pincode || !checkPincode(pincode)) {
      addToast(`Service Unavailable. Please include a valid ${shopConfig.city} Pincode (e.g., 482001) in address.`, "error");
      alert(`Delivery is restricted to ${shopConfig.city} Area within ${shopConfig.maxDeliveryRange}.\n\nPlease ensure your address contains a valid pincode from: ${shopConfig.allowedPincodes.slice(0, 3).join(", ")}...`);
      return;
    }

    setLoading(true);

    try {
      // map to backend format
      const items = cartItems.map(item => ({
        product_id: item.product?.id || item.product_id,
        quantity: item.quantity || 1,
        meta: item.meta || null
      })).filter(i => i.product_id);

      const payload = {
        name,
        phone,
        address,
        items,
        payment_method: 'cod'
      };

      const res = await api.post('/checkout/guest', payload);

      localStorage.removeItem('cart');
      if (res.data.guest_token) {
        localStorage.setItem('guest_token', res.data.guest_token);
      }

      addToast("Order placed successfully!", "success");

      const order = res.data.order;
      navigate(`/order-success/${order?.id || res.data.order_id}`);

    } catch (e) {
      console.error(e);
      addToast(e?.response?.data?.message || e.message || "Failed to place order", "error");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl m-4 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <Link to="/" className="mt-4 text-red-600 font-medium hover:underline">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Guest Checkout</h1>
          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded font-medium">Quick Checkout</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column: Guest Details */}
          <div className="flex-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                Your Details
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">Phone Number</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all" placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">Delivery Address (Must include Pincode)</label>
                  <textarea value={address} onChange={e => setAddress(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all" rows="3" placeholder="Full address including Pincode (Required for Delivery Check)..." />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 opacity-60 pointer-events-none">
              <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="bg-gray-300 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Payment Method
              </h2>
              <p className="text-sm text-gray-500">Cash on Delivery (Standard for Guest Checkout)</p>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Order Summary</h3>

              <div className="max-h-60 overflow-y-auto pr-2 space-y-3 mb-6 custom-scrollbar">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex-shrink-0">
                      {item.product?.thumbnail_url && <img src={item.product?.thumbnail_url} className="w-full h-full object-cover rounded" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 line-clamp-1">{item.product?.title || 'Product'}</div>
                      <div className="text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-semibold">₹ {((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between items-center pt-2 font-bold text-gray-900 text-lg border-t border-dashed">
                  <span>Total Pay</span>
                  <span>₹ {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-red-200 transition-all active:scale-[0.98] disabled:bg-gray-400 disabled:shadow-none"
              >
                {loading ? 'Processing...' : 'Place Guest Order'}
              </button>

              <div className="mt-4 text-center">
                <Link to="/login" className="text-xs text-gray-500 hover:text-red-600 underline">Already have an account? Log in</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
