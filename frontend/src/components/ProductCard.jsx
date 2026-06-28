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
      addToast("Out of stock", "error");
      return;
    }

    const r = await addToCart(product, 1);
    if (r.ok) {
      addToast(`Added to cart`);
    } else {
      addToast('Failed to add to cart', 'error');
    }
  };

  const hasVideo = product.videos && product.videos.length > 0;
  const mrp = product.mrp ? parseFloat(product.mrp) : 0;
  const price = parseFloat(product.price);
  const stock = product.stock ?? 0;
  
  // Calculate discount percentage
  const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <div
      className="group flex flex-col cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/80"
      onClick={onQuickView}
    >
      {/* Media Container */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden isolate">
        <img
          src={product.thumbnail_url}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          loading="lazy"
        />
        
        {/* Subtle overlay on hover for premium feel */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />

        {/* Badges Container (Top Left) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wide shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {Number(product.is_featured) === 1 && (
            <span className="bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wide shadow-sm">
              HOT
            </span>
          )}
        </div>
        
        {/* Video Indicator (Top Right) */}
        {hasVideo && (
          <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md text-white p-1.5 rounded-full shadow-sm">
            <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-3 md:p-4">
        <div className="mb-1 flex justify-between items-start gap-2">
          <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </div>
        
        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-3">
          {product.inner_unit || 'Premium Item'}
        </p>
        
        <div className="mt-auto flex flex-col gap-3">
          {/* Price Block */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-gray-900 font-extrabold text-base md:text-lg tracking-tight">₹{price.toLocaleString()}</span>
            {mrp > price && (
              <span className="text-[11px] md:text-xs text-gray-400 font-medium line-through decoration-gray-300">₹{mrp.toLocaleString()}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={add}
            disabled={stock === 0}
            className={`
              relative w-full py-2.5 rounded-xl font-bold text-xs md:text-sm tracking-wide overflow-hidden transition-all duration-300
              ${stock === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-900 text-white hover:bg-black hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md'
              }
            `}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {stock === 0 ? 'Sold Out' : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
