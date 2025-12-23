import React, { useState, useEffect } from 'react';
import api from '../../api/api';

export default function AdminProductForm({ product, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        title: '', price: '', cost_price: '', mrp: '', stock: '', category_id: '', description: '',
        unit: 'Unit', unit_value: 1, inner_unit: 'Packet', inner_unit_value: ''
    });
    const [files, setFiles] = useState({ thumbnail: null, images: [], videos: [] });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/admin/categories').then(res => setCategories(res.data)); // use public api
        if (product) {
            setFormData({
                title: product.title,
                price: product.price,
                cost_price: product.cost_price || '',
                mrp: product.mrp || '',
                stock: product.stock,
                category_id: product.category_id,
                description: product.description || '',
                unit: product.unit || 'Unit',
                unit_value: product.unit_value || 1,
                inner_unit: product.inner_unit || 'Packet',
                inner_unit_value: product.inner_unit_value || ''
            });
        }
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Create FormData
        const payload = new FormData();
        Object.keys(formData).forEach(key => payload.append(key, formData[key]));

        if (files.thumbnail) payload.append('thumbnail', files.thumbnail);
        Array.from(files.images).forEach(f => payload.append('images[]', f));
        Array.from(files.videos).forEach(f => payload.append('videos[]', f));

        // For update, we used PUT but with FormData + Laravel usually requires POST + _method=PUT
        try {
            if (product) {
                payload.append('_method', 'PUT');
                await api.post(`/admin/products/${product.id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/admin/products', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            onSuccess();
        } catch (e) {
            alert("Failed to save product: " + (e.response?.data?.message || e.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold mb-4">{product ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                    <input className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Price (Selling)</label>
                        <input type="number" className="w-full border p-2 rounded" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Cost Price (Purchase)</label>
                        <input type="number" className="w-full border p-2 rounded" value={formData.cost_price} onChange={e => setFormData({ ...formData, cost_price: e.target.value })} placeholder="Optional" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">MRP</label>
                        <input type="number" className="w-full border p-2 rounded" value={formData.mrp} onChange={e => setFormData({ ...formData, mrp: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Stock</label>
                        <input type="number" className="w-full border p-2 rounded" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                        <select className="w-full border p-2 rounded" value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} required>
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Packing Breakdown (Industry Standard)</label>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600 block italic">1. Outer Packing (Badi Packing)</label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <span className="text-[10px] text-gray-400 block mb-1">Pack of</span>
                                    <input type="number" className="w-full border p-2 rounded font-bold" value={formData.unit_value} onChange={e => setFormData({ ...formData, unit_value: e.target.value })} placeholder="1" />
                                </div>
                                <div className="flex-[2]">
                                    <span className="text-[10px] text-gray-400 block mb-1">Unit Type</span>
                                    <select className="w-full border p-2 rounded font-bold bg-white" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })}>
                                        <option value="Unit">Unit</option>
                                        <option value="Peti">Peti (Box)</option>
                                        <option value="Packet">Packet</option>
                                        <option value="Dozen">Dozen</option>
                                        <option value="Case">Case</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 border-l pl-6 border-gray-200">
                            <label className="text-xs font-bold text-gray-600 block italic">2. Inner Content (Choti Packing)</label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <span className="text-[10px] text-gray-400 block mb-1">Contains</span>
                                    <input type="number" className="w-full border p-2 rounded font-bold" value={formData.inner_unit_value} onChange={e => setFormData({ ...formData, inner_unit_value: e.target.value })} placeholder="e.g. 10" />
                                </div>
                                <div className="flex-[2]">
                                    <span className="text-[10px] text-gray-400 block mb-1">Items Type</span>
                                    <select className="w-full border p-2 rounded font-bold bg-white" value={formData.inner_unit} onChange={e => setFormData({ ...formData, inner_unit: e.target.value })}>
                                        <option value="Packet">Packet</option>
                                        <option value="Box">Box</option>
                                        <option value="Piece">Piece (Nang)</option>
                                        <option value="Roll">Roll</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 text-[10px] bg-blue-50 text-blue-600 p-2 rounded border border-blue-100 flex items-center gap-2">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                        <span>Logic: <b>{formData.unit_value || 1} {formData.unit}</b> will contain <b>{formData.inner_unit_value || 'X'} {formData.inner_unit}s</b>. Price per {formData.inner_unit} will be auto-calculated.</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Thumbnail Image</label>
                        <input type="file" accept="image/*" className="w-full border p-2 rounded" onChange={e => setFiles({ ...files, thumbnail: e.target.files[0] })} />
                        {product && product.thumbnail_url && <p className="text-xs text-gray-400 mt-1">Leave empty to keep current: <a href={product.thumbnail_url} target="_blank" className="text-blue-500 underline">View</a></p>}
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Gallery Images</label>
                        <input type="file" multiple accept="image/*" className="w-full border p-2 rounded" onChange={e => setFiles({ ...files, images: e.target.files })} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Product Videos</label>
                        <input type="file" multiple accept="video/*" className="w-full border p-2 rounded" onChange={e => setFiles({ ...files, videos: e.target.files })} />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                    <textarea className="w-full border p-2 rounded" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                    <button type="submit" disabled={loading} className="flex-1 bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700">
                        {loading ? 'Uploading & Saving...' : 'Save Product'}
                    </button>
                    <button type="button" onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                </div>
            </form>
        </div>
    );
}
