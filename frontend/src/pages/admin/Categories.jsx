import React, { useEffect, useState } from 'react';
import api from '../../api/api';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const loadCategories = async () => {
        try {
            const res = await api.get('/admin/categories');
            setCategories(res.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { loadCategories(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name) return;
        setLoading(true);
        try {
            await api.post('/admin/categories', { name });
            setName('');
            loadCategories();
        } catch (e) {
            alert("Failed to add category");
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete category?")) return;
        try {
            await api.delete(`/admin/categories/${id}`);
            loadCategories();
        } catch (e) {
            alert(e.response?.data?.message || "Failed to delete");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* List */}
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Categories</h2>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group">
                            <div>
                                <p className="font-semibold text-gray-900">{cat.name}</p>
                                <p className="text-xs text-gray-500">{cat.products_count || 0} Products</p>
                            </div>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-all text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Form */}
            <div className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                    <h3 className="font-bold text-gray-800 mb-4">Add New</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="e.g. Headphones"
                            />
                        </div>
                        <button
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Category'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
