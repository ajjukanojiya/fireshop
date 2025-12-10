import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import Header from "../components/Header";

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
      <Header />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    </div>
  );

  const videoUrl = p.videos?.length ? `http://127.0.0.1:8000/stream/${p.videos[0].url}` : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
            {/* Image/Media Column */}
            <div className="p-6 md:p-8 bg-gray-50 flex flex-col gap-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
                <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              {videoUrl && (
                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-black">
                  <video controls className="w-full" crossOrigin="anonymous">
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="p-6 md:p-12 flex flex-col justify-center">
              <div className="mb-2">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {p.category?.name || 'Firework'}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{p.title}</h1>
              <div className="text-2xl font-bold text-gray-900 mb-6">₹ {p.price.toLocaleString()}</div>

              <p className="text-gray-600 leading-relaxed mb-8 text-lg">{p.description || "No description available for this product."}</p>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={adding || (p.stock === 0)}
                  className={`flex-1 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:shadow-none ${p.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 text-white disabled:bg-gray-400'}`}
                >
                  {p.stock === 0 ? 'Out of Stock' : (adding ? 'Adding...' : 'Add to Cart')}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={p.stock === 0}
                  className={`flex-1 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl ${p.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'}`}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
