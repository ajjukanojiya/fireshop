import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

export default function OrderDetail(){
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(()=> {
    (async ()=> {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.data);
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      }
    })();
  }, [id]);

  if (error) return <div style={{padding:20,color:'red'}}>Error: {error}</div>;
  if (!order) return <div style={{padding:20}}>Loading order...</div>;

  return (
    <div style={{padding:20}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3>Order #{order.id}</h3>
        <div>{new Date(order.created_at).toLocaleString()}</div>
      </div>

      <div style={{marginTop:12}}>
        <strong>Status:</strong> {order.status}
      </div>

      <div style={{marginTop:12}}>
        <strong>Total:</strong> ₹ {order.total_amount}
      </div>

      <div style={{marginTop:16}}>
        <h4>Items</h4>
        {order.items.map(item => (
          <div key={item.id} style={{display:'flex', gap:12, border:'1px solid #f0f0f0', padding:10, borderRadius:6, marginTop:8}}>
            <img src={item.product?.thumbnail_url} alt="" style={{width:80,height:60,objectFit:'cover'}} />
            <div>
              <div style={{fontWeight:600}}>{item.product?.title || `Product #${item.product_id}`}</div>
              <div>Qty: {item.quantity}</div>
              <div>Unit price: ₹ {item.unit_price}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:18}}>
        <Link to="/my-orders">← Back to Orders</Link>
      </div>
    </div>
  );
}
