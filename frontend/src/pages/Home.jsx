import React, {useEffect, useState} from "react";
import api from "../api/api";
import Header from "../components/Header";
import CategoryChips from "../components/CategoryChips";
import ProductCard from "../components/ProductCard";

export default function Home(){
  const [products,setProducts] = useState([]);
  const [categories,setCategories] = useState([]);
  const [selected,setSelected] = useState(null);

  useEffect(()=> {
    (async ()=>{
      try {
        const res = await api.get('/products');
        const list = res.data.data || res.data;
        console.log('aaaa',res);
        setProducts(list || []);
        // derive category names if present
        const cats = Array.from(new Set((list||[]).map(p=> p.category?.name || 'General')));
        setCategories(cats);
      } catch(e){ console.error(e); }
    })();
  },[]);

  const filtered = selected ? products.filter(p => (p.category?.name || 'General')===selected) : products;

  const onQuickView = (product) => {
    window.location.href = `/product/${product.id}`;
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <CategoryChips categories={categories} selected={selected} onSelect={setSelected}/>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} onQuickView={onQuickView} />)}
        </div>
      </main>
    </div>
  );
}
