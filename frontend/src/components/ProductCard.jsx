import React from "react";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const add = async (e) => {
    e.stopPropagation(); // prevent quickview trigger if clicked on button
    const r = await addToCart(product, 1);
    if (r.ok) {
      addToast(`Added ${product.title} to cart`);
    } else {
      addToast('Failed to add to cart', 'error');
    }
  };

  const hasVideo = product.videos && product.videos.length > 0;

  // Mock Logic for Professional UI
  const mrp = Math.floor(product.price * 1.35); // Mock 35% higher MRP
  const discount = Math.floor(((mrp - product.price) / mrp) * 100);
  const stock = product.stock ?? (Math.floor(Math.random() * 20) + 1); // Mock random stock
  const isLowStock = stock < 10;
  const soldCount = Math.floor(Math.random() * 300) + 50; // Mock social proof

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative flex flex-col h-full">

      {/* Discount Badge */}
      <div className="absolute top-3 left-0 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-r-full shadow-md">
        {discount}% OFF
      </div>

      <div className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-gray-100" onClick={() => onQuickView(product)}>
        <img
          src={product.thumbnail_url}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          loading="lazy"
        />
        {hasVideo && (
          <div className="absolute right-3 bottom-3 bg-black/60 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-red-600 transition-colors shadow-lg border border-white/10">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3
          className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-2 cursor-pointer hover:text-red-600 transition-colors mb-2"
          onClick={() => onQuickView(product)}
        >
          {product.title}
        </h3>

        {/* Social Proof */}
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
          <div className="flex text-yellow-400">
            {'★'.repeat(4)}{'☆'.repeat(1)}
          </div>
          <span>({soldCount} sold)</span>
        </div>

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-end gap-2 mb-1">
            <span className="text-xl font-bold text-gray-900">₹ {product.price.toLocaleString()}</span>
            <span className="text-sm text-gray-400 line-through mb-1">₹ {mrp.toLocaleString()}</span>
          </div>

          {/* Stock Indicator */}
          {isLowStock ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-orange-600 mb-4 bg-orange-50 px-2 py-1 rounded w-fit">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Only {stock} left - Order soon!
            </div>
          ) : (
            <div className="text-xs text-green-600 font-medium mb-4 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              In Stock
            </div>
          )}

          <button
            onClick={add}
            className="w-full bg-gray-900 hover:bg-red-600 text-white py-2.5 rounded-lg font-semibold text-sm transition-all shadow hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
