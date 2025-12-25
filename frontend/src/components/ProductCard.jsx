import React from "react";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const add = async (e) => {
    e.stopPropagation(); // prevent quickview trigger if clicked on button

    // Check real stock
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

  // Real Logic from Database
  const mrp = product.mrp ? parseFloat(product.mrp) : 0;
  const price = parseFloat(product.price);
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const stock = product.stock ?? 0;
  const isLowStock = stock > 0 && stock < 20;
  const soldCount = product.id * 7 % 300 + 50; // Semi-stable stable count based on ID

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative flex flex-col h-full">

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-0 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-r-full shadow-md">
          {discount}% OFF
        </div>
      )}

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
          className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-2 cursor-pointer hover:text-red-600 transition-colors"
          onClick={() => onQuickView(product)}
        >
          {product.title}
        </h3>

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xl font-black text-gray-900">₹{price.toLocaleString()}</span>
            <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
              per {product.inner_unit || 'Packet'}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            {mrp > price && <span className="text-xs text-gray-400 line-through">₹{mrp.toLocaleString()}</span>}
            {discount > 0 && <span className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Save {discount}%</span>}
          </div>

          {/* Product Info Summary */}
          {((product.unit_value > 1) || (product.inner_unit_value > 1)) && (
            <div className="mb-4 text-[11px] text-gray-500 font-medium">
              Pack of {product.unit_value || 1} {product.unit || 'Unit'}
            </div>
          )}

          {/* Stock Indicator */}
          {stock > 0 ? (
            <div className={`flex items-center gap-1.5 text-xs font-bold mb-4 px-2 py-1 rounded w-fit ${isLowStock ? 'text-orange-600 bg-orange-50 border border-orange-100' : 'text-green-600 bg-green-50 border border-green-100'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isLowStock ? 'bg-orange-500' : 'bg-green-500'}`}></div>
              {stock} {product.inner_unit || 'Packets'} Available
            </div>
          ) : (
            <div className="text-xs text-red-600 font-bold mb-4 bg-red-50 px-2 py-1 rounded w-fit border border-red-100 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              Out of Stock
            </div>
          )}

          <button
            onClick={add}
            disabled={stock === 0}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all shadow hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${stock === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' : 'bg-gray-900 hover:bg-red-600 text-white'}`}
          >
            {stock === 0 ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                Out of Stock
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
