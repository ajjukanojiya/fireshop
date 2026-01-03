import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";
import Header from "../components/Header";
import CategoryChips from "../components/CategoryChips";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

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
        if (Array.isArray(catData)) {
          setCategories(catData); // Store full category objects
        } else {
          setCategories([]);
        }

        // Initialize from URL param
        const catId = searchParams.get("category");
        if (catId) {
          setSelected(parseInt(catId));
        }

      } catch (e) { console.error("Failed to load data", e); }
    })();
  }, []);

  const featured = products.filter(p => p.is_featured === 1 || p.is_featured === true);

  // Auto-slide featured products
  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const filtered = products.filter(p => {
    const matchesCategory = selected ? p.category_id === selected : true;
    const matchesSearch = searchQuery ? (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : true;
    return matchesCategory && matchesSearch;
  });

  const onQuickView = (product) => {
    window.location.href = `/product/${product.id}`;
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 selection:bg-red-100 selection:text-red-600">

      {/* Hero Section - Ultra Premium Stage */}
      <section className="relative min-h-[70vh] lg:min-h-[85vh] flex items-center overflow-hidden bg-[#050505] text-white">
        {/* Dynamic Ambient Background - Royal Ruby Tint */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(153,27,27,0.18)_0%,transparent_70%)] opacity-60" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          {/* Animated Glow Orbs - Ruby Theme */}
          <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-red-900/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[20%] left-[5%] w-[30rem] h-[30rem] bg-slate-900/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full py-10 lg:py-20">
          {featured.length > 0 ? (
            <div className="relative">
              {featured.map((p, idx) => (
                <div
                  key={p.id}
                  className={`flex flex-col lg:flex-row items-center gap-16 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${idx === featuredIndex ? 'opacity-100 scale-100 relative' : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'}`}
                >
                  <div className="flex-1 space-y-8 text-center lg:text-left order-2 lg:order-1">
                    <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-2xl px-5 py-2 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-[#991b1b] shadow-2xl">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-900/50 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#991b1b]"></span>
                      </span>
                      Global Premiere
                    </div>

                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.95] bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent">
                        {p.title}
                      </h1>
                      <div className="h-1 w-16 lg:w-24 bg-[#991b1b] rounded-full mx-auto lg:mx-0 shadow-[0_0_20px_rgba(153,27,27,0.5)]" />
                    </div>

                    <p className="text-lg md:text-xl lg:text-2xl text-white/40 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed tracking-tight">
                      {p.description || "The pinnacle of pyrotechnic craftsmanship, designed for the most elite celebrations."}
                    </p>

                    <div className="flex flex-wrap gap-4 lg:gap-6 justify-center lg:justify-start items-center pt-2 lg:pt-4">
                      <button
                        onClick={() => onQuickView(p)}
                        className="group relative bg-white text-black px-8 lg:px-12 py-4 lg:py-5 rounded-[2rem] font-black text-lg lg:text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_30px_60px_rgba(255,255,255,0.1)] overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          Acquire Now <span className="text-2xl transition-transform group-hover:translate-x-2">→</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>

                      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 px-8 py-4 rounded-[2rem] shadow-2xl flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Exclusive Value</span>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black">₹{p.price}</span>
                          <span className="text-xs font-bold text-white/20">/ {p.inner_unit || 'Pack'}</span>
                        </div>
                      </div>
                    </div>

                    {featured.length > 1 && (
                      <div className="flex gap-4 justify-center lg:justify-start pt-10">
                        {featured.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            onClick={() => setFeaturedIndex(dotIdx)}
                            className={`h-2 rounded-full transition-all duration-700 ${dotIdx === featuredIndex ? 'bg-[#991b1b] w-16 shadow-[0_0_15px_rgba(153,27,27,0.6)]' : 'bg-white/10 w-4 hover:bg-white/25'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full max-w-4xl order-1 lg:order-2">
                    <div className="relative group focus:outline-none">
                      <div className="absolute -inset-10 bg-[#991b1b]/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                      <div className="relative aspect-[16/11] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-black group-hover:border-white/20 transition-colors duration-700">
                        {p.videos && p.videos.length > 0 ? (
                          <video
                            key={p.videos[0].url}
                            autoPlay muted loop playsInline
                            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2000ms]"
                          >
                            <source src={p.videos[0].url.startsWith('http') ? p.videos[0].url : `${api.defaults.baseURL.replace('/api/v1', '')}/storage/${p.videos[0].url}`} />
                          </video>

                        ) : (
                          <img src={p.thumbnail_url} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2000ms]" alt={p.title} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent pointer-events-none" />
                      </div>
                      <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-[#991b1b] text-white px-8 py-4 rounded-[1.5rem] shadow-2xl skew-x-[-6deg] hidden sm:block">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-white/50">Heritage Quality</span>
                        <span className="text-xl font-black">Hand-Crafted</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-8">
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none">THE SPECTACLE</h1>
              <p className="text-white/40 text-xl max-w-2xl mx-auto font-medium">Extraordinary celebrations deserve extraordinary light. Begin your journey.</p>
              <button onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })} className="bg-[#991b1b] px-16 py-6 rounded-[2rem] font-black text-xl hover:bg-[#7f1d1d] transition-all shadow-[0_20px_50px_rgba(153,27,27,0.3)]">Enter Showroom</button>
            </div>
          )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16" id="shop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Enhanced Sticky Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-28 space-y-8">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Browse by Scene</h3>
                <CategoryChips categories={categories} selected={selected} onSelect={setSelected} />
              </div>

              {/* Modern Promo Card - Midnight Slate theme */}
              <div className="group relative overflow-hidden rounded-[2rem] bg-[#0f172a] p-8 text-white shadow-xl">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl transition-transform group-hover:scale-150" />
                <h4 className="text-2xl font-black mb-2 leading-tight uppercase tracking-tight">Premium <br />Gifting</h4>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Elegant curated boxes for your most distinguished guests.</p>
                <button className="bg-[#991b1b] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#7f1d1d] transition-all">Explore</button>
              </div>

              <div className="bg-white border border-slate-100 rounded-[2rem] p-8">
                <div className="flex items-center gap-4 mb-4 text-[#d97706]">
                  <span className="text-2xl">⚡</span>
                  <span className="text-xs font-black uppercase tracking-widest">Express Service</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">Next-day delivery guaranteed for all premium boutique orders.</p>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  {searchQuery ? `Search: ${searchQuery}` : (selected ? categories.find(c => c.id === selected)?.name : 'All Collection')}
                </h2>
                <p className="text-slate-400 text-sm font-medium mt-1">Showing {filtered.length} premium selections</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchParams({})}
                    className="text-[#991b1b] text-xs font-black mt-3 hover:underline underline-offset-4 uppercase tracking-widest"
                  >
                    Clear Search
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Sort by: <span className="text-[#991b1b] cursor-pointer hover:underline underline-offset-8 transition-colors">Featured First</span>
              </div>
            </header>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map(p => <ProductCard key={p.id} product={p} onQuickView={onQuickView} />)}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-slate-400 text-lg font-medium">We couldn't find items matching your request.</p>
                <button onClick={() => setSelected(null)} className="mt-4 text-[#991b1b] font-black uppercase text-xs tracking-widest hover:underline underline-offset-8">Return to Boutique</button>
              </div>
            )}
          </div>
        </div>
      </main>


    </div>
  );
}
