import React, {useState, useEffect} from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { initGoogle, renderGoogleButton } from "../utils/googleAuth";

export default function Login(){
  const [phone,setPhone] = useState("");
  const [loading,setLoading] = useState(false);
  const [msg,setMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(()=> {
    const handleCredential = async (resp) => {
      const id_token = resp.credential;
      try {
        const res = await api.post('/auth/google', { id_token });
        const token = res.data.token;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        navigate('/');
      } catch(e){
        setMsg('Google login failed');
      }
    };

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (window.google && clientId) {
      initGoogle(clientId, handleCredential);
      // render in #googleBtn
      renderGoogleButton('googleBtn');
    } else {
      // waits for script load
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
      await api.post('/auth/send-otp',{ phone });
      navigate(`/verify-otp?phone=${encodeURIComponent(phone)}`);
    } catch(e){
      setMsg(e?.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Sign in</h2>
        <p className="text-sm text-slate-600 mb-4">Quickly sign in with phone or Google.</p>

        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+919812345678" className="w-full border rounded-md px-3 py-2 mb-3" />

        <button onClick={sendOtp} className="w-full bg-teal-500 text-white py-2 rounded-md">
          {loading ? "Sending..." : "Send OTP"}
        </button>

        <div id="googleBtn" className="mt-4 flex justify-center"></div>

        <div className="mt-3 text-center">
          <a href="/guest-checkout" className="text-sm text-slate-700">Continue as guest</a>
        </div>

        {msg && <p className="mt-3 text-red-600">{msg}</p>}
      </div>
    </div>
  );
}
