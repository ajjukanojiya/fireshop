import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { sendOtpForGuest, verifyOtpAndClaim } from '../services/authService';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import Header from '../components/Header';
import api from '../api/api';

export default function OrderSuccess() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { user, loadUser } = useUser();
  const { clearCart } = useCart();

  // order may be passed via state or you can fetch by id
  const [order, setOrder] = useState(loc.state?.order ?? null);
  const [phone, setPhone] = useState(order?.guest_phone ?? '');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Timer logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Fetch order if missing (page refresh)
  useEffect(() => {
    if (!order && orderId) {
      (async () => {
        try {
          const guestToken = localStorage.getItem('guest_token');
          console.log("Fetching order", orderId, "guest:", guestToken);

          let res;
          // Try fetching as guest if we have a token and no user
          if (!user && guestToken) {
            res = await api.get(`/orders/${orderId}/guest?guest_token=${guestToken}`);
          } else {
            // Try fetching as auth user
            res = await api.get(`/orders/${orderId}`);
          }

          if (res.data.order) {
            setOrder(res.data.order);
            if (res.data.order.guest_phone) setPhone(res.data.order.guest_phone);
          }
        } catch (e) {
          console.error("Failed to fetch order", e);
          setMsg("Could not load order details.");
        }
      })();
    }
  }, [order, orderId, user]);

  const handleSendOtp = async () => {
    if (!phone) { setMsg('Enter mobile number'); return; }
    setLoading(true);
    setMsg('');
    try {
      await sendOtpForGuest(phone);
      setOtpSent(true);
      setTimer(30); // Start 30s timer
      setMsg('OTP sent to ' + phone);
    } catch (e) {
      console.error(e);
      setMsg(e?.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    await handleSendOtp();
  };

  const handleVerify = async () => {
    if (!otp) { setMsg('Enter OTP'); return; }
    setLoading(true);
    setMsg('');
    try {
      await verifyOtpAndClaim({ phone, otp });
      setMsg('Verified! You are now logged in.');

      // Refresh user context so the app knows we are logged in
      await loadUser();

      // Clear cart explicitly to fix persistent cart count
      await clearCart();

      // optional: redirect to My Orders
      setTimeout(() => navigate('/my-orders'), 1500);
    } catch (e) {
      console.error(e);
      setMsg(e?.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-col items-center justify-center p-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
          {/* Success Header Area */}
          <div className="bg-green-100 p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Order Placed!</h2>
            <p className="text-green-700 mt-2 font-medium">Thank you for your purchase</p>
          </div>

          <div className="p-8">
            {/* Order Details Chip */}
            {order && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-8 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Order ID</p>
                  <p className="text-lg font-bold text-gray-800">#{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Amount</p>
                  <p className="text-lg font-bold text-green-600">₹ {order.total_amount.toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Account Linking Section - Conditionally Rendered */}
            {user ? (
              <div className="bg-green-50/50 rounded-xl p-6 border border-green-100 mb-8 flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">Linked to Account</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    This order is linked to your account <span className="font-medium text-gray-900">{user.phone}</span>. You can track it in My Orders.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Save this order</h4>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Verify your phone number to attach this order to your account and track it easily.
                </p>

                <div className="space-y-4">
                  {!otpSent ? (
                    <div className="flex gap-2">
                      <input
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="Enter mobile number"
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                      <button
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                      >
                        {loading ? 'Sending...' : 'Send OTP'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <input
                          value={otp}
                          onChange={e => setOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        />
                        <button
                          onClick={handleVerify}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                        >
                          {loading ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>

                      {/* Resend OTP Section */}
                      <div className="flex justify-between items-center px-1 mt-2">
                        <button
                          onClick={() => setOtpSent(false)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Change Number
                        </button>
                        {timer > 0 ? (
                          <span className="text-xs text-gray-500">Resend OTP in {timer}s</span>
                        ) : (
                          <button
                            onClick={handleResend}
                            className="text-xs text-blue-600 hover:underline font-medium"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {msg && (
                    <div className={`text-sm font-medium px-3 py-2 rounded-md ${msg.toLowerCase().includes('failed') || msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('enter') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                      {msg}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all group"
              >
                <span className="group-hover:-translate-x-1 inline-block transition-transform">←</span> Continue Shopping
              </button>
              <button
                onClick={() => navigate('/my-orders')}
                className="flex-1 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
              >
                View Orders →
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
