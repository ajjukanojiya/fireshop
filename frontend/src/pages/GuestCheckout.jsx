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
      // Build items array from cart. For now demo use single hard-coded item or integrate cart state
      const items = [
        // replace with real cart data
        { product_id: 1, quantity: 1 }
      ];
  
      const payload = {
        name,
        phone,
        address,
        items
      };
  
      const res = await api.post('/checkout/guest', payload);
    //  alert('Order created: ' + (res.data.order_id || 'ok'));
      localStorage.removeItem('cart');     // persistent storage
    alert('Order created: ' + res.data.order_id);
    navigate(`/order-success/${res.data.order_id || ''}`);

     // navigate('/');
    } catch (e) {
      console.error(e);
      alert('Error: ' + (e?.response?.data?.message || e.message));
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
