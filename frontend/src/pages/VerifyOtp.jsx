import React, {useEffect, useState} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function VerifyOtp(){
  const [search] = useSearchParams();
  const phone = search.get('phone') || '';
  const [otp, setOtp] = useState('');
  const [msg,setMsg] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const [timer,setTimer] = useState(30);

  useEffect(()=> {
    const it = setInterval(()=> setTimer(t=> t>0? t-1:0),1000);
    return ()=>clearInterval(it);
  },[]);

  const verify = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await api.post('/auth/verify-otp',{ phone, otp });
      const token = res.data.token;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      navigate('/');
    } catch(e){
      setMsg(e?.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const resend = async () => {
    if (timer>0) return;
    try {
      await api.post('/auth/send-otp',{ phone });
      setMsg('OTP resent');
      setTimer(30);
    } catch(e){
      setMsg('Failed to resend');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Verify {phone}</h3>
        <p className="text-sm text-slate-600 mb-4">Enter the 4-digit code we sent.</p>

        <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="OTP" className="w-full border rounded-md px-3 py-2 mb-3 text-center" />

        <button onClick={verify} disabled={loading} className="w-full bg-emerald-600 text-white py-2 rounded-md">
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>

        <div className="mt-3 text-center">
          <button onClick={resend} disabled={timer>0} className="text-sm text-teal-600">
            {timer>0 ? `Resend in ${timer}s` : 'Resend OTP'}
          </button>
        </div>

        {msg && <p className="mt-3 text-red-600">{msg}</p>}
      </div>
    </div>
  );
}
