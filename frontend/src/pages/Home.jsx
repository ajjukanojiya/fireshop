import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import CategoryChips from "../components/CategoryChips";
import ProductCard from "../components/ProductCard";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        const list = prodRes.data?.data || prodRes.data;
        setProducts(Array.isArray(list) ? list : []);
        const catData = catRes.data?.data || catRes.data;
        setCategories(Array.isArray(catData) ? catData : []);

        const catId = searchParams.get("category");
        if (catId) setSelected(parseInt(catId));
      } catch (e) { console.error("Failed to load data", e); }
    })();
  }, []);

  const featured = products.filter(p => Number(p.is_featured) === 1);

  const filtered = products.filter(p => {
    const matchesCategory = selected ? p.category_id === selected : true;
    const matchesSearch = searchQuery ? (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : true;
    return matchesCategory && matchesSearch;
  });

  const getFullUrl = (url) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    const apiBase = import.meta.env.VITE_API_BASE || '';
    const host = apiBase.replace(/\/api\/v1\/?$/, '');
    let cleanUrl = url.replace(/https?:\/\/localhost:8000/g, '');
    if (!cleanUrl.startsWith('/')) cleanUrl = '/' + cleanUrl;
    if (!cleanUrl.startsWith('/storage/')) cleanUrl = '/storage' + cleanUrl;
    return `${host}${cleanUrl}`;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-900 selection:text-white">
      
      {/* 1. MULTI-VIDEO SHOWCASE HERO */}
      {featured.length > 0 && !searchQuery && !selected && (
        <section className="bg-[#050505] pt-12 pb-10 border-b border-gray-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">Trending Now</h1>
                <p className="text-sm text-gray-400 font-medium">Discover our most spectacular additions.</p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Live Showcase
              </div>
            </div>

            {/* Video Wall: Horizontal Scroll on Mobile, Grid on Desktop */}
            <div className="flex overflow-x-auto gap-3 md:gap-6 pb-6 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-3 lg:grid-cols-4 px-1">
              {featured.slice(0, 4).map(p => (
                <div 
                  key={p.id} 
                  className="min-w-[65vw] sm:min-w-[40vw] md:min-w-0 snap-center flex-none relative group cursor-pointer flex flex-col"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  {/* Media Aspect Container - Reels/Stories ratio */}
                  <div className="aspect-[4/5] bg-gray-900 rounded-[1.25rem] overflow-hidden mb-3 border border-gray-800 relative shadow-2xl">
                    {p.videos && p.videos[0] ? (
                      <video autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                        <source src={getFullUrl(p.videos[0].url)} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={p.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p.title} />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                    
                    {/* Hover indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                      <div className="bg-white/90 text-black px-6 py-2.5 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">
                        View Product
                      </div>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
                      <div className="flex-1 pr-3">
                        <h3 className="text-white font-bold text-base line-clamp-1 drop-shadow-md">{p.title}</h3>
                        <p className="text-gray-300 text-[10px] mt-0.5 uppercase tracking-widest font-semibold">{p.inner_unit || 'Premium Item'}</p>
                      </div>
                      <span className="text-black font-extrabold text-sm whitespace-nowrap bg-white px-3 py-1.5 rounded-xl shadow-md">₹{p.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 2. SLIM TRUST BAR */}
      {!searchQuery && !selected && (
        <div className="border-b border-gray-100 bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Premium Quality
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Express Delivery
              </div>
              <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATALOG & FILTERS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 pt-8" id="shop-grid">
        
        {/* Sleek Filtering Header */}
        <div className="sticky top-[70px] z-30 bg-white/90 backdrop-blur-xl py-4 mb-8 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CategoryChips categories={categories} selected={selected} onSelect={setSelected} />
            
            <div className="flex items-center gap-4">
               <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{filtered.length} Items Found</span>
            </div>
          </div>
          
          {searchQuery && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xl font-bold text-gray-900 tracking-tight">Search Results for "{searchQuery}"</span>
              <button onClick={() => setSearchParams({})} className="text-sm font-medium text-gray-500 hover:text-gray-900 underline underline-offset-4">Clear Search</button>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 gap-y-6 sm:gap-4 md:gap-x-6 md:gap-y-10">
            {filtered.map(p => <ProductCard key={p.id} product={p} onQuickView={() => navigate(`/product/${p.id}`)} />)}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4M12 20V4" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nothing Found</h3>
            <p className="text-gray-500 text-sm font-medium">Try adjusting your category or search filters.</p>
          </div>
        )}
      </main>
      
    </div>
  );
}
