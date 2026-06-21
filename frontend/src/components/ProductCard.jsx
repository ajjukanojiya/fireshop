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

  return (
    <div
      className="group flex flex-col gap-3 cursor-pointer"
      onClick={onQuickView}
    >
      {/* Media Container - Minimal with Standard View */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 mb-1">
        <img
          src={product.thumbnail_url}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          loading="lazy"
        />
        
        {/* Video Indicator */}
        {hasVideo && (
          <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-md text-white p-1.5 rounded-full">
            <svg className="w-3 h-3 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-3 mt-auto pt-1">
          <span className="text-gray-900 font-bold tracking-tight">₹{price.toLocaleString()}</span>
          {mrp > price && (
            <span className="text-xs text-gray-400 line-through">₹{mrp.toLocaleString()}</span>
          )}
          <span className="text-[10px] text-gray-400 ml-auto uppercase tracking-wider">{product.inner_unit || 'Item'}</span>
        </div>

        {/* Standard Visible Add to Cart Button */}
        <button
          onClick={add}
          disabled={stock === 0}
          className={`w-full py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-colors border ${stock === 0 ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-900 border-gray-300 hover:border-gray-900 hover:bg-gray-50 active:bg-gray-100'}`}
        >
          {stock === 0 ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
