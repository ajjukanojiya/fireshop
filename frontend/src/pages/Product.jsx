import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
// Header removed - managed by MainLayout

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setP(res.data);
      } catch (e) { console.error(e); }
    })();
  }, [id]);

  // Fix 1: Active Image State
  const [activeImage, setActiveImage] = useState(null);

  // Set default active image when product loads
  useEffect(() => {
    if (p) {
      setActiveImage(p.thumbnail_url);
    }
  }, [p]);

  const getFullUrl = (url) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    if (url.startsWith('/storage')) return url;
    return `/storage/${url}`;
  };

  // ... (AddToCart logic remains) ...

  const handleAddToCart = async () => {
    if (p.stock === 0) {
      addToast("This item is out of stock", "error");
      return;
    }
    setAdding(true);
    const res = await addToCart(p, 1);
    setAdding(false);

    if (res.ok) {
      addToast(`Added ${p.title} to cart`);
    } else {
      addToast('Failed to add to cart', 'error');
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  if (!p) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#991b1b]"></div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
            {/* Image/Media Column */}
            <div className="p-6 md:p-8 bg-gray-50 flex flex-col gap-4">
              <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-white shadow-inner border border-slate-100 relative group">
                <img key={activeImage} src={getFullUrl(activeImage || p.thumbnail_url)} alt={p.title} className="w-full h-full object-cover animate-fade-in" loading="lazy" />
              </div>

              {/* Gallery Scroll */}
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {/* Thumbnail as first option */}
                <button
                  onClick={() => setActiveImage(p.thumbnail_url)}
                  className={`h-20 aspect-square rounded-xl overflow-hidden border-2 flex-shrink-0 shadow-sm transition-all ${activeImage === p.thumbnail_url ? 'border-red-600 ring-2 ring-red-100' : 'border-slate-100 hover:border-red-200'}`}
                >
                  <img src={getFullUrl(p.thumbnail_url)} className="w-full h-full object-cover" alt="Main" />
                </button>

                {p.images && p.images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImage(img.url)}
                    className={`h-20 aspect-square rounded-xl overflow-hidden border-2 flex-shrink-0 shadow-sm transition-all ${activeImage === img.url ? 'border-red-600 ring-2 ring-red-100' : 'border-slate-100 hover:border-red-200'}`}
                  >
                    <img src={getFullUrl(img.url)} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                  </button>
                ))}
              </div>
              {p.videos && p.videos.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Product Demonstrations</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {p.videos.map((vid, idx) => {
                      const vUrl = getFullUrl(vid.url);
                      return (
                        <div key={vid.id || idx} className="rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/10 bg-black">
                          <video controls className="w-full" playsInline>
                            <source src={vUrl} />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>



            {/* Details Column */}
            <div className="p-6 md:p-12 flex flex-col justify-center">
              <div className="mb-2">
                <span className="bg-[#fef2f2] text-[#991b1b] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-red-100">
                  {p.category?.name || 'Exclusive Selection'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">{p.title}</h1>
              <div className="text-3xl font-black text-[#991b1b] mb-2">₹ {p.price.toLocaleString()}</div>

              <div className="mb-8">
                <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${p.stock > 0 ? 'text-teal-600 bg-teal-50 border border-teal-100' : 'text-red-600 bg-red-50 border border-red-100'}`}>
                  {p.stock > 0 ? `${p.stock} ${p.inner_unit || 'Packets'} Available` : 'Out of Stock'}
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8 text-lg">{p.description || "No description available for this product."}</p>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={adding || (p.stock === 0)}
                  className={`flex-1 px-8 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${p.stock === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#0f172a] hover:bg-slate-800 text-white shadow-xl shadow-slate-200'}`}
                >
                  {p.stock === 0 ? 'Sold Out' : (adding ? 'Adding...' : 'Add to Collection')}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={p.stock === 0}
                  className={`flex-1 px-8 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${p.stock === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#991b1b] hover:bg-[#7f1d1d] text-white shadow-xl shadow-red-900/20'}`}
                >
                  Secure Acquisition
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
