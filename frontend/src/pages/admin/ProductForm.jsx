import React, { useState, useEffect } from 'react';
import api from '../../api/api';

export default function AdminProductForm({ product, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        title: '', price: '', cost_price: '', mrp: '', stock: '', category_id: '', description: '',
        unit: 'Unit', unit_value: 1, inner_unit: 'Packet', inner_unit_value: '', is_featured: false
    });
    const [bulkPrice, setBulkPrice] = useState(''); // Bulk Purchase Price (Peti ka Rate)
    const [files, setFiles] = useState({ thumbnail: null, images: [], videos: [] });
    const [previews, setPreviews] = useState({ thumbnail: null, images: [], videos: [] });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Handle Local Previews
    const handleFileChange = (type, e) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles.length) return;

        if (type === 'thumbnail') {
            const file = selectedFiles[0];
            setFiles(prev => ({ ...prev, thumbnail: file }));
            setPreviews(prev => ({ ...prev, thumbnail: URL.createObjectURL(file) }));
        } else if (type === 'images') {
            const fileArray = Array.from(selectedFiles);
            setFiles(prev => ({ ...prev, images: fileArray }));
            setPreviews(prev => ({ ...prev, images: fileArray.map(f => URL.createObjectURL(f)) }));
        } else if (type === 'videos') {
            const fileArray = Array.from(selectedFiles);
            setFiles(prev => ({ ...prev, videos: fileArray }));
            setPreviews(prev => ({ ...prev, videos: fileArray.map(f => URL.createObjectURL(f)) }));
        }
    };

    const clearSelection = (type) => {
        setFiles(prev => ({ ...prev, [type]: type === 'thumbnail' ? null : [] }));
        setPreviews(prev => ({ ...prev, [type]: type === 'thumbnail' ? null : [] }));
    };

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
                inner_unit_value: product.inner_unit_value || '',
                is_featured: product.is_featured === 1 || product.is_featured === true || false
            });
        }
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Create FormData
        const payload = new FormData();
        Object.keys(formData).forEach(key => {
            // Convert boolean for is_featured for PHP/Laravel
            if (key === 'is_featured') {
                payload.append(key, formData[key] ? 1 : 0);
            } else {
                payload.append(key, formData[key]);
            }
        });

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

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-1">Bulk Purchase Price ({formData.unit} Rate)</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded font-bold bg-white"
                            value={bulkPrice}
                            onChange={e => {
                                const val = e.target.value;
                                setBulkPrice(val);
                                if (val && formData.inner_unit_value > 0) {
                                    const calculatedCost = (parseFloat(val) / parseFloat(formData.inner_unit_value)).toFixed(2);
                                    setFormData(prev => ({ ...prev, cost_price: calculatedCost }));
                                }
                            }}
                            placeholder="e.g. 1200"
                        />
                        <p className="text-[9px] text-blue-400 mt-1 italic">Peti ka kharid daam dale</p>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-1">Cost Price (per {formData.inner_unit})</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded font-bold bg-gray-50 mb-1"
                            value={formData.cost_price}
                            onChange={e => setFormData({ ...formData, cost_price: e.target.value })}
                            placeholder="Auto-calculated"
                        />
                        <p className="text-[9px] text-blue-400 italic">1 {formData.inner_unit} ka daam</p>
                    </div>
                    <div className="flex flex-col justify-center">
                        {formData.cost_price > 0 && (
                            <div className="bg-white p-2 rounded border border-blue-200">
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Suggested Sell</p>
                                <p className="text-sm font-black text-green-600">₹{(parseFloat(formData.cost_price) * 1.5).toFixed(0)} - ₹{(parseFloat(formData.cost_price) * 2).toFixed(0)}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Selling Price (Final)</label>
                        <input type="number" className="w-full border p-2 rounded font-bold border-green-300 bg-green-50 focus:bg-white" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">MRP (Printed)</label>
                        <input type="number" className="w-full border p-2 rounded" value={formData.mrp} onChange={e => setFormData({ ...formData, mrp: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                        <select className="w-full border p-2 rounded" value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} required>
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center pt-5">
                        <label className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl cursor-pointer hover:bg-red-100 transition-colors w-full">
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-red-600 rounded"
                                checked={formData.is_featured}
                                onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                            />
                            <div>
                                <p className="text-xs font-black text-red-600 uppercase tracking-tighter">Promote this Product</p>
                                <p className="text-[10px] text-red-400 font-bold">Show on Home Page Hero Section</p>
                            </div>
                        </label>
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
                                    <input type="number" className="w-full border p-2 rounded font-bold" value={formData.inner_unit_value} onChange={e => {
                                        const val = e.target.value === '' ? '' : parseInt(e.target.value);
                                        setFormData(prev => ({ ...prev, inner_unit_value: val }));

                                        // Auto update cost price if bulk price exists
                                        if (bulkPrice && val > 0) {
                                            const calculatedCost = (parseFloat(bulkPrice) / parseFloat(val)).toFixed(2);
                                            setFormData(prev => ({ ...prev, cost_price: calculatedCost }));
                                        }
                                    }} placeholder="e.g. 10" />
                                </div>
                                <div className="flex-[2]">
                                    <span className="text-[10px] text-gray-400 block mb-1">Items Type</span>
                                    <select className="w-full border p-2 rounded font-bold bg-white" value={formData.inner_unit} onChange={e => setFormData({ ...formData, inner_unit: e.target.value })}>
                                        <option value="Packet">Packet</option>
                                        <option value="Box">Box</option>
                                        <option value="Piece">Piece (Nang)</option>
                                        <option value="Roll">Roll</option>
                                        <option value="Unit">Unit</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-6">
                        {formData.inner_unit_value > 1 && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-600 block italic">Step 1: Stock in {formData.unit}s (Bulk)</label>
                                <input
                                    type="number"
                                    step="any"
                                    className="w-full border p-2 rounded font-bold bg-yellow-50 border-yellow-200 focus:bg-yellow-100 outline-none transition-all"
                                    placeholder={`e.g. 10 ${formData.unit}s`}
                                    value={formData.inner_unit_value > 0 ? (Number(formData.stock || 0) / Number(formData.inner_unit_value)).toFixed(2).replace(/\.00$/, '') : ''}
                                    onChange={e => {
                                        const bulkVal = e.target.value;
                                        const bulkUnits = bulkVal === '' ? 0 : parseFloat(bulkVal);
                                        const convRate = Number(formData.inner_unit_value) || 1;
                                        const total = Math.round(bulkUnits * convRate);
                                        setFormData(prev => ({ ...prev, stock: total }));
                                    }}
                                />
                                <p className="text-[10px] text-yellow-700 font-bold uppercase tracking-tight">Bulk Entry (Optional)</p>
                            </div>
                        )}
                        <div className={`${formData.inner_unit_value > 1 ? '' : 'col-span-2'} space-y-1`}>
                            <label className="text-xs font-bold text-gray-800 block">Total {formData.inner_unit}s (Stock Item)</label>
                            <input
                                type="number"
                                className="w-full border-2 p-3 rounded-lg font-black text-lg bg-blue-50 border-blue-200 focus:bg-white focus:border-blue-500 outline-none transition-all"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value === '' ? '' : parseInt(e.target.value) })}
                                placeholder="Enter total packets here"
                                required
                            />
                            <p className="text-[10px] text-blue-700 font-bold uppercase tracking-tight">Total count yahan dale (Bas yahi zaroori hai)</p>
                        </div>
                    </div>

                    {formData.inner_unit_value > 1 && (
                        <div className="mt-3 text-[11px] bg-red-50 text-red-600 p-3 rounded-lg border border-red-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                <span>Calculation: <b>{formData.stock || 0} {formData.inner_unit}s</b> contains <b>{formData.inner_unit_value > 0 ? Math.floor(Number(formData.stock || 0) / Number(formData.inner_unit_value)) : 0} {formData.unit}s</b> and <b>{formData.stock % (formData.inner_unit_value || 1)}</b> loose items.</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Thumbnail Display */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-500 uppercase">Thumbnail</label>
                            {previews.thumbnail && (
                                <button type="button" onClick={() => clearSelection('thumbnail')} className="text-[10px] text-red-500 font-bold uppercase hover:underline">Clear</button>
                            )}
                        </div>
                        <div className="relative group overflow-hidden rounded-xl border aspect-square bg-gray-50 flex items-center justify-center shadow-sm">
                            {previews.thumbnail ? (
                                <img src={previews.thumbnail} className="w-full h-full object-cover" alt="New Thumbnail" />
                            ) : (product && product.thumbnail_url) ? (
                                <img src={product.thumbnail_url} className="w-full h-full object-cover" alt="Existing Thumbnail" />
                            ) : (
                                <span className="text-xs text-gray-400">No Thumbnail</span>
                            )}
                        </div>
                        <input type="file" accept="image/*" className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" onChange={e => handleFileChange('thumbnail', e)} />
                    </div>

                    {/* Gallery Images Display */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-500 uppercase">Gallery ({(product?.images?.length || 0) + previews.images.length})</label>
                            {previews.images.length > 0 && (
                                <button type="button" onClick={() => clearSelection('images')} className="text-[10px] text-red-500 font-bold uppercase hover:underline">Clear New</button>
                            )}
                        </div>
                        <div className="flex gap-2 border rounded-xl p-2 bg-gray-50 overflow-x-auto shadow-inner h-32">
                            {/* New Previews */}
                            {previews.images.map((url, i) => (
                                <div key={`new-img-${i}`} className="h-full aspect-square relative flex-shrink-0">
                                    <img src={url} className="h-full w-full object-cover rounded-lg border shadow-sm" alt="New Gallery" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                        <span className="text-white font-black text-[10px] uppercase">New</span>
                                    </div>
                                    <span className="absolute top-0 right-0 bg-red-600 text-white text-[8px] px-1 rounded-bl-md font-bold shadow-sm">NEW</span>
                                </div>
                            ))}
                            {/* Existing Images */}
                            {product && product.images?.map(img => (
                                <div key={img.id} className="h-full aspect-square relative flex-shrink-0 group">
                                    <img src={img.url} className="h-full w-full object-cover rounded-lg border shadow-sm" alt="Gallery" />
                                </div>
                            ))}
                            {!previews.images.length && (!product || !product.images?.length) && (
                                <div className="w-full h-full flex flex-col items-center justify-center italic text-xs text-gray-400">
                                    <svg className="w-6 h-6 opacity-20 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    Empty
                                </div>
                            )}
                        </div>
                        <input type="file" multiple accept="image/*" className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" onChange={e => handleFileChange('images', e)} />
                    </div>

                    {/* Videos Display */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-500 uppercase">Videos ({(product?.videos?.length || 0) + previews.videos.length})</label>
                            {previews.videos.length > 0 && (
                                <button type="button" onClick={() => clearSelection('videos')} className="text-[10px] text-red-500 font-bold uppercase hover:underline">Clear New</button>
                            )}
                        </div>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 border rounded-xl p-3 bg-gray-50 shadow-inner" style={{ scrollbarWidth: 'auto' }}>
                            {/* New Video Previews */}
                            {previews.videos.map((url, i) => (
                                <div key={`new-vid-${i}`} className="p-2 bg-white rounded-xl border border-red-100 shadow-sm relative group">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                            <span className="font-black text-[9px] text-red-600 uppercase tracking-tighter">Ready to upload</span>
                                        </div>
                                        <span className="text-[8px] text-gray-400 font-mono truncate max-w-[100px]">{files.videos[i]?.name}</span>
                                    </div>
                                    <video controls className="w-full rounded-lg bg-black shadow-md border border-gray-200" style={{ maxHeight: '120px' }}>
                                        <source src={url} />
                                    </video>
                                </div>
                            ))}

                            {/* Existing Videos */}
                            {product && product.videos?.map(vid => {
                                const vUrl = vid.url.startsWith('http') ? vid.url : `${api.defaults.baseURL.replace('/api/v1', '')}/storage/${vid.url}`;
                                return (
                                    <div key={vid.id} className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm group">
                                        <div className="flex items-center justify-between mb-1.5 px-1">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                                                </div>
                                                <span className="truncate max-w-[120px] font-bold text-[9px] text-gray-500 uppercase tracking-tight">Active Video</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    if (window.confirm('Permanent Delete? This cannot be undone.')) {
                                                        try {
                                                            await api.delete(`/admin/products/videos/${vid.id}`);
                                                            onSuccess();
                                                        } catch (e) { alert('Failed to delete video'); }
                                                    }
                                                }}
                                                className="text-[#991b1b] bg-red-50 hover:bg-red-100 px-2 py-1 rounded font-black uppercase text-[8px] border border-red-100 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        <video controls className="w-full rounded-lg bg-black shadow-lg" style={{ maxHeight: '100px' }}>
                                            <source src={vUrl} />
                                        </video>
                                    </div>
                                );
                            })}
                            {!previews.videos.length && (!product || !product.videos?.length) && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-6 italic text-xs">
                                    <svg className="w-10 h-10 opacity-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                    <p className="text-[10px] font-bold uppercase tracking-widest">No Product Videos</p>
                                </div>
                            )}
                        </div>
                        <input type="file" multiple accept="video/*" className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" onChange={e => handleFileChange('videos', e)} />
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
