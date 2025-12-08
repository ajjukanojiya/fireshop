import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendOtpForGuest, verifyOtpAndClaim } from '../services/authService';

export default function OrderSuccess() {
  const loc = useLocation();
  const navigate = useNavigate();
  // order may be passed via state or you can fetch by id
  const order = loc.state?.order ?? null;
  const [phone, setPhone] = useState(order?.guest_phone ?? '');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone) { setMsg('Enter mobile number'); return; }
    setLoading(true);
    try {
      await sendOtpForGuest(phone);
      setOtpSent(true);
      setMsg('OTP sent to ' + phone);
    } catch (e) {
      console.error(e);
      setMsg(e?.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleVerify = async () => {
    if (!otp) { setMsg('Enter OTP'); return; }
    setLoading(true);
    try {
      const data = await verifyOtpAndClaim({ phone, otp });
      setMsg('Verified! You are now logged in.');
      // optional: redirect to My Orders
      navigate('/my-orders');
    } catch (e) {
      console.error(e);
      setMsg(e?.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="p-4">
      <h2>Order placed successfully</h2>
      {order && <div>Order #{order.id} — ₹ {order.total_amount}</div>}

      <div style={{marginTop:16}}>
        <h4>Save this order to your account</h4>
        <p>Verify your phone and we will attach this order to your account so you can view it later.</p>

        {!otpSent ? (
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile number" />
            <button onClick={handleSendOtp} disabled={loading}>Send OTP</button>
          </div>
        ) : (
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" />
            <button onClick={handleVerify} disabled={loading}>Verify & Claim</button>
          </div>
        )}

        {msg && <div style={{marginTop:10, color: 'green'}}>{msg}</div>}
      </div>

      <div style={{marginTop:24}}>
        <button onClick={() => navigate('/')} className="btn">Continue shopping</button>
        <button onClick={() => navigate('/my-orders')} style={{marginLeft:12}}>View orders</button>
      </div>
    </div>
  );
}
