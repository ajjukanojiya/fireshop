import React from "react";
import { useCart } from "../contexts/CartContext";

export default function ProductCard({product, onQuickView}){
  const { addToCart } = useCart();
  const add = async () => {
    const r = await addToCart(product, 1);
    if (r.ok) alert('Added to cart');
    else alert('Error: '+ JSON.stringify(r.error));
  };
  console.log('aaaa',product.video);
  const hasVideo = product.videos && product.videos.length;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="relative">
        <img src={product.thumbnail_url} alt={product.title} className="w-full h-44 object-cover" loading="lazy" />
        {hasVideo && (
          <button onClick={()=>onQuickView(product)} className="absolute right-2 bottom-2 bg-black/60 text-white p-2 rounded-full">
            ▶
          </button>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-slate-900 line-clamp-2">{product.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-lg font-semibold">₹ {product.price}</div>
         <button 
            onClick={add}
            className="text-sm bg-emerald-500 text-white px-3 py-1 rounded-md"
          >
            Add
          </button>

        </div>
      </div>
    </div>
  )
}
