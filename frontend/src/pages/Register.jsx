import React, { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { initGoogle, renderGoogleButton } from "../utils/googleAuth";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!phone) return setMsg("Enter phone number");
    if (!name) return setMsg("Enter your name");

    setLoading(true); setMsg(null);
    try {
      // In this specific flow, we might just send OTP first, 
      // but conceptually we want to capture the name.
      // For now, we trigger the standardized OTP flow.
      await api.post('/auth/send-otp', { phone });

      // Ideally backend caches the name or we pass it, but for simplistic auth flow:
      navigate(`/verify-otp?phone=${encodeURIComponent(phone)}`);
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen overflow-hidden">

        {/* Left Side - Visual */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-bl from-slate-900 to-gray-800 relative items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center px-12">
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Join FireShop</h1>
            <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
              Create an account to unlock exclusive member benefits, faster checkout, and order tracking.
            </p>
            <div className="mt-12 flex justify-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">🚀</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">Fast</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">🛡️</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">Secure</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">🎁</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">Rewards</div>
              </div>
            </div>
          </div>
          {/* Decor circles */}
          <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="mt-2 text-gray-600">Join our community today.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Full Name</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all font-medium text-lg"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-gray-200 transition-all active:scale-[0.98]"
                >
                  {loading ? "Sending OTP..." : "Continue"}
                </button>

                {msg && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">{msg}</div>}
              </div>

              <p className="text-center text-sm text-gray-500">
                Already have an account? <Link to="/login" className="font-bold text-slate-900 hover:underline">Log in</Link>
              </p>
              <div className="text-center">
                <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
