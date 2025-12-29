import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { initGoogle, renderGoogleButton } from "../utils/googleAuth";
// Header removed

export default function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCredential = async (resp) => {
      const id_token = resp.credential;
      try {
        const res = await api.post('/auth/google', { id_token });
        const token = res.data.token;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        navigate('/');
      } catch (e) {
        setMsg('Google login failed');
      }
    };

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (window.google && clientId) {
      initGoogle(clientId, handleCredential);
      renderGoogleButton('googleBtn');
    } else {
      window.onload = () => {
        if (window.google && clientId) {
          initGoogle(clientId, handleCredential);
          renderGoogleButton('googleBtn');
        }
      }
    }
  }, [navigate]);

  const sendOtp = async () => {
    if (!phone) return setMsg("Enter phone");
    setLoading(true); setMsg(null);
    try {
      const res = await api.post('/auth/send-otp', { phone });
      const otpSent = res.data.otp;
      if (otpSent) {
        setMsg(`OTP sent successfully: ${otpSent}`);
        setTimeout(() => {
          navigate(`/verify-otp?phone=${encodeURIComponent(phone)}`);
        }, 2000);
      } else {
        navigate(`/verify-otp?phone=${encodeURIComponent(phone)}`);
      }
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen overflow-hidden">

        {/* Left Side - Visual */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-red-600 to-orange-500 relative items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center px-12">
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight">FireShop</h1>
            <p className="text-xl text-red-100 max-w-md mx-auto leading-relaxed">
              The premium destination for your celebrations. Log in to track orders, save favorites, and get exclusive deals.
            </p>
            <div className="mt-12 opacity-80">
              <div className="flex justify-center gap-4 text-4xl">
                <span>🎆</span><span>✨</span><span>🧨</span>
              </div>
            </div>
          </div>
          {/* Decor circles */}
          <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-gray-600">Please enter your details to sign in.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all font-medium text-lg"
                    />
                  </div>
                </div>

                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-gray-200 transition-all active:scale-[0.98]"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
                </div>

                <div id="googleBtn" className="flex justify-center"></div>

                {msg && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">{msg}</div>}
              </div>

              <p className="text-center text-sm text-gray-500">
                Don't have an account? <Link to="/signup" className="font-bold text-red-600 hover:underline">Sign up</Link>
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
