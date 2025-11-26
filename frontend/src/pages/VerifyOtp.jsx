import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  // read phone from query param: /verify-otp?phone=...
  const query = new URLSearchParams(location.search);
  const initialPhone = query.get("phone") || "";

  // contexts
  const { mergeGuestToServer, reload } = useCart();
  const { setUser, loadUser } = useUser();

  // local state
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // if the page was opened without phone in query, allow manual entry
  useEffect(() => {
    if (initialPhone) {
      setPhone(initialPhone);
    }
  }, [initialPhone]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      // call backend verify OTP endpoint
      const res = await api.post("/auth/verify-otp", { phone, otp });

      // backend may return token in res.data.token or res.data.access_token
      const token = res?.data?.token ?? res?.data?.access_token ?? null;

      if (!token) {
        // try nested places (some APIs return data.token)
        const maybeToken = res?.data?.data?.token ?? res?.data?.data?.access_token;
        if (maybeToken) {
          localStorage.setItem("token", maybeToken);
          api.defaults.headers.common["Authorization"] = "Bearer " + maybeToken;
        } else {
          throw new Error("Token not found in response");
        }
      } else {
        // store token and set axios header immediately
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = "Bearer " + token;
      }

      // If response includes user object, set it in UserContext; otherwise call loadUser()
      if (res?.data?.user) {
        setUser(res.data.user);
      } else {
        // try to load from /auth/me (if your API exposes it)
        try { await loadUser(); } catch(e){ /* ignore */ }
      }

      // merge guest cart into server cart (if any) and reload cart state
      try {
        await mergeGuestToServer();
      } catch (mergeErr) {
        console.warn("Cart merge failed:", mergeErr);
      }
      try { await reload(); } catch(e){}

      // optional: remove any saved otp_phone key (if you used localStorage fallback)
      try { localStorage.removeItem("otp_phone"); } catch(e){}

      // navigate to home or dashboard
      navigate("/");

    } catch (error) {
      console.error("Verify error:", error);
      const msg =
        error?.response?.data?.message ||
        (typeof error?.response?.data === "object" ? JSON.stringify(error.response.data) : null) ||
        error.message ||
        "Verification failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>

      <div className="text-sm text-slate-600 mb-3">
        {phone ? (
          <>OTP will be sent to: <strong>{phone}</strong></>
        ) : (
          <>Enter your phone number to receive OTP</>
        )}
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        {/* Phone (prefilled from query if available) */}
        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input
            id="phoneInput"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +919XXXXXXXXX"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* OTP */}
        <div>
          <label className="block text-sm mb-1">OTP</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {err && <div className="text-sm text-red-600">{String(err)}</div>}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-slate-600 px-3 py-2 rounded border"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
