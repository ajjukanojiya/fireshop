import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useToast } from "../contexts/ToastContext";

export default function CheckoutPage() {
  const { items = [], reload, total } = useCart();
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi, card, cod
  const [upiId, setUpiId] = useState('');

  // Redirect guests to Guest Checkout
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!userLoading && !user && !token) {
      navigate('/guest-checkout');
    }
  }, [user, userLoading, navigate]);

  // Address State
  const [address, setAddress] = useState({
    name: user?.name || '',
    street: '',
    city: '',
    zip: '',
    phone: user?.phone || ''
  });

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!address.name || !address.street || !address.phone) {
      addToast("Please fill in all address details", "error");
      return;
    }

    if (paymentMethod === 'upi' && !upiId) {
      // Just a validation simulation, typically we'd redirect to gateway
      // For now, allow empty for "QR Code" simulation flow if we had one, but let's enforce VPA for "Enter ID"
      addToast("Please enter your UPI ID", "error");
      return;
    }

    setLoading(true);

    try {
      // Ideally we send address and payment info here
      const res = await api.post("/checkout", {
        address,
        payment_method: paymentMethod,
        payment_details: { upi_id: upiId }
      });

      const order = res?.data?.order ?? res?.data;
      const orderId = order?.id ?? order?.order_id ?? null;

      if (!orderId) {
        addToast(res?.data?.message || "Order placed successfully", "success");
        await reload();
        navigate("/");
        return;
      }

      await reload();
      addToast("Order placed successfully!", "success");
      navigate(`/order/${orderId}`);

    } catch (e) {
      console.error("Checkout error:", e);
      addToast(e?.response?.data?.message || "Checkout failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-white p-6 rounded-full shadow-sm mb-4">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="mt-4 text-red-600 font-medium hover:underline">Start Shopping</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column: Forms */}
          <div className="flex-1 space-y-6">

            {/* 1. Address Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
                  <input name="name" value={address.name} onChange={handleAddressChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">Phone Number</label>
                  <input name="phone" value={address.phone} onChange={handleAddressChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all" placeholder="+91 98765 43210" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">Address (House No, Street, Area)</label>
                  <input name="street" value={address.street} onChange={handleAddressChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all" placeholder="Flat 101, Building Name, Street..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">City</label>
                  <input name="city" value={address.city} onChange={handleAddressChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all" placeholder="Mumbai" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">Pincode</label>
                  <input name="zip" value={address.zip} onChange={handleAddressChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all" placeholder="400001" />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Payment Method
              </h2>

              <div className="space-y-3">

                {/* UPI Option */}
                <div className={`border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-red-500 bg-red-50/50 ring-1 ring-red-500' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setPaymentMethod('upi')}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-red-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'upi' && <div className="w-3 h-3 bg-red-600 rounded-full"></div>}
                    </div>
                    <span className="font-bold text-gray-800">UPI (GPay, PhonePe, Paytm)</span>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-auto">Recommended</span>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-4 pl-8 animate-fade-in">
                      <p className="text-sm text-gray-600 mb-3">Enter your UPI ID to verify payment.</p>
                      <div className="flex gap-2">
                        <input
                          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                          placeholder="e.g. 9876543210@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />
                        <button onClick={(e) => { e.stopPropagation(); addToast('UPI ID Verified!', 'success') }} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">Verify</button>
                      </div>
                      <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        100% Safe Payment
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Option */}
                <div className={`border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-red-500 bg-red-50/50 ring-1 ring-red-500' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setPaymentMethod('card')}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-red-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'card' && <div className="w-3 h-3 bg-red-600 rounded-full"></div>}
                    </div>
                    <span className="font-bold text-gray-800">Credit / Debit Card</span>
                  </div>
                </div>

                {/* COD Option */}
                <div className={`border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-red-500 bg-red-50/50 ring-1 ring-red-500' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setPaymentMethod('cod')}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-red-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'cod' && <div className="w-3 h-3 bg-red-600 rounded-full"></div>}
                    </div>
                    <span className="font-bold text-gray-800">Cash on Delivery</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Order Summary</h3>

              <div className="max-h-60 overflow-y-auto pr-2 space-y-3 mb-6 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex-shrink-0">
                      <img src={item.product?.thumbnail_url} className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 line-clamp-1">{item.product?.title}</div>
                      <div className="text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-semibold">₹ {((item.product?.price || 0) * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹ {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between items-center pt-2 font-bold text-gray-900 text-lg border-t border-dashed">
                  <span>Total Pay</span>
                  <span>₹ {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-red-200 transition-all active:scale-[0.98] disabled:bg-gray-400 disabled:shadow-none"
              >
                {loading ? 'Processing...' : `Place Order • ₹ ${total.toLocaleString()}`}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                By placing order, you agree to our Terms & Conditions.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
