import React, {useState} from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function GuestCheckout(){
  const [phone,setPhone] = useState('');
  const [name,setName] = useState('');
  const [address,setAddress] = useState('');
  const navigate = useNavigate();

  const placeOrder = async () => {
    try {
      // This is placeholder. Your order endpoint may need cart details.
      const res = await api.post('/orders/create', {});
      alert('Order created: '+(res.data.id || 'ok'));
      navigate('/');
    } catch(e){
      alert('Error: '+(e?.response?.data?.message || e.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Guest Checkout</h3>
        <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded-md px-3 py-2 mb-2" />
        <input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full border rounded-md px-3 py-2 mb-2" />
        <textarea placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} className="w-full border rounded-md px-3 py-2 mb-3" rows="4" />
        <button onClick={placeOrder} className="w-full bg-teal-500 text-white py-2 rounded-md">Place Order</button>
      </div>
      
    </div>

    
  );
}
