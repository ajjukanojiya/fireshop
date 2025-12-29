import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data.data || res.data);
            } catch (e) {
                console.error("Failed to load categories", e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#991b1b]"></div>
        </div>
    );

    return (
        <div className="px-4 py-8">
            <h1 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter italic">Explore <span className="text-[#991b1b]">Categories</span></h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        onClick={() => navigate(`/?category=${cat.id}`)}
                        className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer bg-slate-100 border border-slate-200"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                        {cat.image_url && (
                            <img src={cat.image_url} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        )}
                        <div className="absolute bottom-4 left-4 z-20">
                            <h3 className="text-white font-black text-lg uppercase tracking-tight leading-tight">{cat.name}</h3>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{cat.products_count || 0} Products</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
