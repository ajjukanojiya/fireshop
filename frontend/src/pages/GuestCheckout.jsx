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
     let cart = [];
    try {
      const cartString = localStorage.getItem("cart");
      cart = cartString ? JSON.parse(cartString) : [];
    } catch (err) {
      console.error("Invalid cart JSON", err);
      cart = [];
    }

// map to backend format expected by Laravel
const itemsdata = cart.map(item => {
  // defensive checks
  const productId = item.product?.id ?? item.product_id ?? null;
  const qty = Number.isInteger(item.quantity) ? item.quantity : (item.qty ?? item.quantity ?? 1);

  return {
    product_id: productId !== null ? Number(productId) : null,
    quantity: qty,
    meta: item.meta ?? null, // agar zaroorat ho to bhejein
  };
});

// filter-out invalid items
const items = itemsdata.filter(i => Number.isFinite(i.product_id));

console.log("Payload items:", items);
      

      console.log("Items from cart:", items);


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
    const guest_token = res.data.guest_token;
if (guest_token) localStorage.setItem('guest_token', guest_token);
const order = res.data.order;
   // navigate(`/order-success/${res.data.order_id || ''}`);
    navigate(`/order-success/${order.id}`, { state: { order } });

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
