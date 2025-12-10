import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import AdminProductForm from './ProductForm';

export default function AdminProducts() {
    const [products, setProducts] = useState({ data: [] });
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null); // null = list, 'new' = add mode, obj = edit mode

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

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Price</th>
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
                                                {p.thumbnail_url && <img src={p.thumbnail_url} className="w-full h-full object-cover rounded" />}
                                            </div>
                                            <span className="font-medium text-gray-900 line-clamp-1">{p.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">₹ {p.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {p.stock}
                                        </span>
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
