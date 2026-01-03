import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import AdminProductForm from './ProductForm';

export default function AdminProducts() {
    const [products, setProducts] = useState({ data: [] });
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null); // null = list, 'new' = add mode, obj = edit mode

    const getFullUrl = (url) => {
        if (!url) return "";
        if (url.startsWith('http')) return url;
        if (url.startsWith('/storage')) return url;
        return `/storage/${url}`;
    };

    const loadProducts = async (page = 1) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/products?page=${page}`);
            setProducts(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadProducts(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete product?")) return;
        try {
            await api.delete(`/admin/products/${id}`);
            loadProducts(products.current_page);
        } catch (e) { alert("Delete failed"); }
    };

    if (editingProduct) {
        return (
            <div className="max-w-2xl mx-auto">
                <AdminProductForm
                    product={editingProduct === 'new' ? null : editingProduct}
                    onSuccess={() => { setEditingProduct(null); loadProducts(); }}
                    onCancel={() => setEditingProduct(null)}
                />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Products</h2>
                <button
                    onClick={() => setEditingProduct('new')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 shadow-md shadow-red-200"
                >
                    + Add Product
                </button>
            </div>

            {/* Mobile Card View (< md) */}
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden bg-gray-50">
                {loading ? <div className="text-center py-8 text-gray-500">Loading products...</div> :
                    products.data.map(p => (
                        <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                                {p.thumbnail_url ?
                                    <img src={getFullUrl(p.thumbnail_url)} className="w-full h-full object-cover" alt={p.title} /> :
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight mb-1">{p.title}</h3>
                                    {p.is_featured === 1 && (
                                        <span className="text-[10px] bg-red-50 text-red-600 px-1.5 rounded border border-red-100 font-bold ml-2 whitespace-nowrap">HOT</span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 mb-2">{p.category?.name} • {p.unit_value} {p.unit}</div>

                                <div className="flex justify-between items-end mt-2">
                                    <div>
                                        <div className="text-lg font-black text-slate-800">₹{p.price}</div>
                                        <div className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded w-fit ${p.stock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                            Stock: {p.stock}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setEditingProduct(p)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Unit Info</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr> :
                            products.data.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded border flex-shrink-0">
                                                {p.thumbnail_url && <img src={getFullUrl(p.thumbnail_url)} className="w-full h-full object-cover rounded" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 line-clamp-1">{p.title}</span>
                                                {p.is_featured === 1 && (
                                                    <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded w-fit mt-0.5">
                                                        FEATURED
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">₹ {p.price}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-[10px] uppercase font-black text-gray-400 tracking-wider">
                                            {p.unit_value} {p.unit}
                                        </div>
                                        {p.inner_unit_value && (
                                            <div className="text-[10px] text-blue-500 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 inline-block mt-1">
                                                {p.inner_unit_value} {p.inner_unit}s
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className={`px-2 py-1 rounded text-xs font-black uppercase text-center mb-1 ${p.stock < 5 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                                                {p.stock} {p.inner_unit || 'Items'}
                                            </span>
                                            {p.inner_unit_value > 1 && (
                                                <div className="text-[10px] text-gray-500 font-bold bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 whitespace-nowrap">
                                                    {Math.floor(p.stock / p.inner_unit_value)} {p.unit}{p.stock % p.inner_unit_value > 0 ? ` + ${p.stock % p.inner_unit_value} ${p.inner_unit}` : ''}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{p.category?.name}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => setEditingProduct(p)} className="text-blue-600 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Simple */}
            <div className="p-4 flex justify-between bg-gray-50 text-xs font-medium text-gray-500">
                <button disabled={!products.prev_page_url} onClick={() => loadProducts(products.current_page - 1)} className="disabled:opacity-50 hover:text-gray-900">Previous</button>
                <span>Page {products.current_page} of {products.last_page}</span>
                <button disabled={!products.next_page_url} onClick={() => loadProducts(products.current_page + 1)} className="disabled:opacity-50 hover:text-gray-900">Next</button>
            </div>
        </div>
    );
}
