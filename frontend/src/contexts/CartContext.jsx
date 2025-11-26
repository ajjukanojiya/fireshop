// src/contexts/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const CartContext = createContext();

export function useCart(){ return useContext(CartContext); }

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // items array: if guest shape: {id, product, quantity, meta}
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // helper: recalc total
  const recalc = (list) => {
    const t = list.reduce((s,it) => s + ((it.quantity||0) * (parseFloat(it.product?.price || 0))), 0);
    setTotal(Number(t));
  };

  // load cart: try server cart -> fallback to local
  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart'); // expects {data:[], total:...} or 401
      if (res.status === 200 && Array.isArray(res.data.data)) {
        setItems(res.data.data.map(it => ({
          id: it.id,
          product: it.product,
          quantity: it.quantity,
          meta: it.meta || null
        })));
        recalc(res.data.data);
        setLoading(false);
        return;
      }
    } catch(e){
      // unauth or network - fallback
      // console.warn('server cart load failed', e);
    }
    // fallback to localStorage
    const local = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(local);
    recalc(local);
    setLoading(false);
  };

  useEffect(()=> { loadCart(); }, []);

  // watch login token change via storage events (other tabs)
  useEffect(()=> {
    const h = (e) => {
      if (e.key === 'token') loadCart();
    };
    window.addEventListener('storage', h);
    return () => window.removeEventListener('storage', h);
  }, []);

  // persist guest cart
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  // merge guest cart into server cart after login (call this after login)
  const mergeGuestToServer = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const guest = JSON.parse(localStorage.getItem('cart') || '[]');
    for (const g of guest) {
      try {
        await api.post('/cart/add', { product_id: g.product.id, quantity: g.quantity, meta: g.meta || null });
      } catch(e){
        // ignore individual errors
      }
    }
    // clear local guest cart then reload server cart
    localStorage.removeItem('cart');
    await loadCart();
  };

  // add to cart
  const addToCart = async (product, quantity = 1, meta = null) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // guest local
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        const updated = items.map(i => i.product.id === product.id ? {...i, quantity: i.quantity + quantity} : i);
        setItems(updated); recalc(updated);
        return { ok:true, guest:true };
      } else {
        const newItem = { id: `g_${Date.now()}`, product, quantity, meta };
        const updated = [...items, newItem];
        setItems(updated); recalc(updated);
        return { ok:true, guest:true };
      }
    } else {
      try {
        const res = await api.post('/cart/add', { product_id: product.id, quantity, meta });
        // refresh server cart
        await loadCart();
        return { ok:true, guest:false, item: res.data.item };
      } catch(err){
        const message = err?.response?.data || err.message;
        return { ok:false, error: message };
      }
    }
  };

  const updateCartItem = async (itemId, quantity, meta) => {
    const token = localStorage.getItem('token');
    if (!token) {
      const updated = items.map(i => i.id === itemId ? {...i, quantity, meta: meta ?? i.meta} : i);
      setItems(updated); recalc(updated);
      return { ok:true, guest:true };
    } else {
      try {
        await api.patch(`/cart/${itemId}`, { quantity, meta });
        await loadCart();
        return { ok:true };
      } catch(e) { return { ok:false, error: e?.response?.data || e.message }; }
    }
  };

  const removeFromCart = async (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      const updated = items.filter(i => i.id !== itemId);
      setItems(updated); recalc(updated);
      return { ok:true, guest:true };
    } else {
      try {
        await api.delete(`/cart/${itemId}`);
        await loadCart();
        return { ok:true };
      } catch(e) { return { ok:false, error: e?.response?.data || e.message }; }
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setItems([]); setTotal(0); localStorage.removeItem('cart');
      return { ok:true };
    } else {
      try {
        await api.post('/cart/clear');
        await loadCart();
        return { ok:true };
      } catch(e){ return { ok:false, error: e?.response?.data || e.message }; }
    }
  };

  const value = {
    items, total, loading,
    addToCart, updateCartItem, removeFromCart, clearCart,
    reload: loadCart,
    mergeGuestToServer
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
