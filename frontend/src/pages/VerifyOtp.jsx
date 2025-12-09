import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const initialPhone = query.get("phone") || "";

  const { mergeGuestToServer, reload } = useCart();
  const { loadUser, setUser } = useUser();

  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // Timer state
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (initialPhone) setPhone(initialPhone);
  }, [initialPhone]);

  // Countdown timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (!phone) {
      setErr("Phone number is missing");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      await api.post('/auth/send-otp', { phone });
      setTimer(30);
      setCanResend(false);
      // Optional: Add success toast/message
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", { phone, otp });
      const token = res?.data?.token ?? res?.data?.access_token ?? null;

      if (!token) {
        const maybeToken = res?.data?.data?.token ?? res?.data?.data?.access_token;
        if (maybeToken) {
          localStorage.setItem("token", maybeToken);
          api.defaults.headers.common["Authorization"] = "Bearer " + maybeToken;
        } else {
          throw new Error("Token not found in response");
        }
      } else {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = "Bearer " + token;
      }

      if (res?.data?.user) {
        setUser(res.data.user);
      } else {
        try { await loadUser(); } catch (e) { }
      }

      try { await mergeGuestToServer(); } catch (mergeErr) { console.warn(mergeErr); }
      try { await reload(); } catch (e) { }
      try { localStorage.removeItem("otp_phone"); } catch (e) { }

      navigate("/");

    } catch (error) {
      console.error("Verify error:", error);
      const msg = error?.response?.data?.message || "Verification failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Visual Side (Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-emerald-600 to-teal-500 relative items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Secure Login</h1>
          <p className="text-green-50 max-w-md mx-auto">Verify your identity to access your account and manage your orders securely.</p>
        </div>
        {/* Decor */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Enter OTP</h2>
            <p className="mt-2 text-gray-500">
              We've sent a 6-digit code to <span className="font-bold text-gray-900">{phone}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                maxLength={6}
                placeholder="• • • • • •"
                className="w-full text-center text-3xl tracking-[1em] font-bold py-4 border-b-2 border-gray-200 focus:border-black outline-none transition-colors"
                autoFocus
              />
            </div>

            {err && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">{String(err)}</div>}

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Didn't receive code?</p>
            <button
              onClick={handleResend}
              disabled={!canResend || loading}
              className={`font-semibold text-sm transition-colors ${!canResend ? 'text-gray-400 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-700 hover:underline'}`}
            >
              {!canResend ? `Resend in ${timer}s` : "Resend OTP"}
            </button>
          </div>

          <div className="text-center mt-8">
            <button onClick={() => navigate('/login')} className="text-sm text-gray-400 hover:text-gray-600">
              Change Phone Number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
