import React, { useEffect, useState } from "react";
import api from "../api/api";
import Header from "../components/Header";
import CategoryChips from "../components/CategoryChips";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);

        const list = prodRes.data.data || prodRes.data;
        setProducts(list || []);

        // Use fetched categories, fall back to derived if empty/fail (optional, but better to trust API)
        const cats = catRes.data.map(c => c.name);
        setCategories(cats);

      } catch (e) { console.error("Failed to load data", e); }
    })();
  }, []);

  const filtered = selected ? products.filter(p => (p.category?.name || 'General') === selected) : products;

  const onQuickView = (product) => {
    window.location.href = `/product/${product.id}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Light Up Your <br /><span className="text-yellow-300">Celebrations</span>
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-lg mx-auto md:mx-0">
              Premium fireworks, sparklers, and party packs delivered straight to your door. Safe, spectacular, and affordable.
            </p>
            <div className="pt-4">
              <button onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })} className="bg-white text-red-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors transform hover:scale-105">
                Shop Now
              </button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md">
            {/* Abstract Visual / Image Placeholder */}
            <div className="aspect-video bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex items-center justify-center p-8">
              <span className="text-6xl">🎆</span>
              <span className="text-6xl animate-pulse">✨</span>
              <span className="text-6xl">🧨</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12" id="shop">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Categories Sidebar (Desktop) / Topbar (Mobile) */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Categories</h3>
                <CategoryChips categories={categories} selected={selected} onSelect={setSelected} />
              </div>

              {/* Promo Card */}
              <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg hidden md:block">
                <h4 className="font-bold text-lg mb-2">Mega Deal!</h4>
                <p className="text-indigo-100 text-sm mb-4">Get 50% off on all Family Packs this weekend.</p>
                <button className="text-xs bg-white text-indigo-600 px-3 py-1 rounded font-bold uppercase tracking-wide">View Deal</button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selected || 'All Products'}</h2>
              <span className="text-gray-500 text-sm">{filtered.length} items</span>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filtered.map(p => <ProductCard key={p.id} product={p} onQuickView={onQuickView} />)}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No products found in this category.</p>
                <button onClick={() => setSelected(null)} className="mt-4 text-red-600 font-medium hover:underline">Clear Filters</button>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer Simple */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} FireShop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
