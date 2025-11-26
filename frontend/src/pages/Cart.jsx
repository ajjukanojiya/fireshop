// src/pages/Cart.jsx
import React from "react";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage(){
  const { items, total, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const inc = async (it) => { await updateCartItem(it.id, it.quantity + 1, it.meta); };
  const dec = async (it) => { if (it.quantity <= 1) return; await updateCartItem(it.id, it.quantity - 1, it.meta); };
  const removeItem = async (it) => { if (!confirm("Remove this item?")) return; await removeFromCart(it.id); };
  const doClear = async () => { if (!confirm("Clear cart?")) return; await clearCart(); };

  const handleCheckout = () => {
    navigate('/checkout'); // create checkout later
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div className="p-8 bg-white rounded shadow text-center">
          <p className="mb-4">Your cart is empty.</p>
          <Link to="/" className="inline-block bg-slate-900 text-white px-4 py-2 rounded">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-4 bg-white p-4 rounded shadow">
                <img src={it.product?.thumbnail_url} alt={it.product?.title} className="w-28 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{it.product?.title}</div>
                  <div className="text-sm text-slate-600">₹ {it.product?.price}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={()=>dec(it)} className="w-8 h-8 rounded border flex items-center justify-center">-</button>
                    <div className="w-10 text-center">{it.quantity}</div>
                    <button onClick={()=>inc(it)} className="w-8 h-8 rounded border flex items-center justify-center">+</button>

                    <button onClick={()=>removeItem(it)} className="ml-4 text-sm text-red-600">Remove</button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹ { (it.quantity * (it.product?.price || 0)).toFixed(2) }</div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between mt-4">
              <button onClick={doClear} className="text-sm text-red-600">Clear cart</button>
              <Link to="/" className="text-sm text-slate-700">Continue shopping</Link>
            </div>
          </div>

          <aside className="bg-white p-4 rounded shadow">
            <div className="text-sm text-slate-600">Order summary</div>
            <div className="mt-3 text-2xl font-semibold">₹ {total.toFixed(2)}</div>
            <div className="mt-4 space-y-2">
              <button onClick={handleCheckout} className="w-full bg-emerald-600 text-white py-2 rounded">Checkout</button>
              <button onClick={doClear} className="w-full border border-slate-300 text-slate-700 py-2 rounded">Clear</button>
            </div>
          </aside>

          
        </div>
      )}
    </div>
  );
}
