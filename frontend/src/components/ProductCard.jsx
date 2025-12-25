import React from "react";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const add = async (e) => {
    e.stopPropagation();
    const currentStock = product.stock ?? 0;
    if (currentStock === 0) {
      addToast("This product is currently out of stock", "error");
      return;
    }

    const r = await addToCart(product, 1);
    if (r.ok) {
      addToast(`Added ${product.title} to cart`);
    } else {
      addToast('Failed to add to cart', 'error');
    }
  };

  const hasVideo = product.videos && product.videos.length > 0;
  const mrp = product.mrp ? parseFloat(product.mrp) : 0;
  const price = parseFloat(product.price);
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const stock = product.stock ?? 0;
  const isLowStock = stock > 0 && stock < 20;

  return (
    <div
      className="group bg-white rounded-[2rem] border border-slate-100 hover:border-red-100 transition-all duration-500 relative flex flex-col h-full hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden"
    >
      {/* Discount Badge - Floating Design */}
      {discount > 0 && (
        <div className="absolute top-4 left-4 z-10 bg-[#991b1b] text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-red-900/10 uppercase tracking-widest">
          {discount}% Save
        </div>
      )}

      {/* Media Container */}
      <div
        className="relative aspect-[1/1] overflow-hidden cursor-pointer group/img"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.thumbnail_url}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-slate-900/0 group-hover/img:bg-slate-900/5 transition-colors duration-500" />

        {hasVideo && (
          <div className="absolute right-4 bottom-4 bg-white/90 backdrop-blur-md text-[#991b1b] p-3 rounded-2xl shadow-xl border border-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          {/* Category tag simulated if needed, or just better spacing */}
          <h3
            className="font-black text-slate-800 text-lg leading-tight line-clamp-2 cursor-pointer hover:text-[#991b1b] transition-colors"
            onClick={() => onQuickView(product)}
          >
            {product.title}
          </h3>
        </div>

        <div className="mt-auto space-y-4">
          {/* Pricing Row */}
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900 leading-none">₹{price.toLocaleString()}</span>
              <div className="flex items-center gap-1.5 mt-1">
                {mrp > price && <span className="text-xs text-slate-400 line-through">₹{mrp.toLocaleString()}</span>}
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">/ {product.inner_unit || 'Pack'}</span>
              </div>
            </div>
            {stock > 0 && (
              <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isLowStock ? 'text-amber-600 bg-amber-50' : 'text-teal-600 bg-teal-50'}`}>
                {isLowStock ? 'Low Stock' : 'In Stock'}
              </div>
            )}
          </div>

          {/* Quick Stats Helper */}
          {((product.unit_value > 1) || (product.inner_unit_value > 1)) && (
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl w-fit">
              Pack of {product.unit_value || 1} {product.unit || 'Unit'}
            </div>
          )}

          {/* Add Action */}
          <button
            onClick={add}
            disabled={stock === 0}
            className={`w-full py-4 rounded-[1.2rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${stock === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#0f172a] hover:bg-[#991b1b] text-white shadow-xl shadow-slate-200 hover:shadow-red-900/20'}`}
          >
            {stock === 0 ? 'Sold Out' : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
