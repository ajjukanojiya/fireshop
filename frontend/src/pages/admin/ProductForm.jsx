import React, { useState, useEffect } from 'react';
import api from '../../api/api';

export default function AdminProductForm({ product, onSuccess, onCancel }) {
    // Initial State following the 10-Step Flow
    const [formData, setFormData] = useState({
        // Step 1: Category
        category_id: '',

        // Step 2: Basic Details
        title: '',
        brand: '',
        size: '', // Size/Shots/Type dynamic
        description: '',

        // Step 3: Unit & Packing (Hierarchy)
        package_type: 'Box', // Peti/Carton
        packets_per_peti: 1,
        pieces_per_packet: 1,

        // Step 4: Purchase (Cost)
        purchase_price: '', // Per Peti

        // Step 5: Selling Price
        selling_price_peti: '',
        selling_price_packet: '',
        selling_price_piece: '',

        // Step 6: Stock
        opening_stock_peti: '', // We input Peti, calc total packets

        // Step 7: Attributes
        noise_level: 'Medium',
        is_kids_safe: false,
        use_type: 'Outdoor',
        season: 'Diwali',

        // Step 8: Tax
        hsn_code: '',
        gst_percentage: '',

        // Step 9: Media check
        video_downloadable: false,
        is_featured: false
    });

    const [calculated, setCalculated] = useState({
        costPerPacket: 0,
        costPerPiece: 0,
        totalPackets: 0,
        totalPieces: 0
    });

    const [files, setFiles] = useState({ thumbnail: null, images: [], video: null });
    const [previews, setPreviews] = useState({ thumbnail: null, images: [], video: null });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // 0-100%

    // Fetch Categories
    useEffect(() => {
        api.get('/admin/categories').then(res => setCategories(res.data));

        if (product) {
            // Populate form if editing
            setFormData({
                category_id: product.category_id,
                title: product.title,
                brand: product.brand || '',
                size: product.size || '',
                description: product.description || '',
                package_type: product.package_type || 'Box',
                packets_per_peti: product.packets_per_peti || 1,
                pieces_per_packet: product.pieces_per_packet || 1,
                purchase_price: product.purchase_price || '',
                selling_price_peti: product.selling_price_peti || '',
                selling_price_packet: product.selling_price_packet || product.price || '',
                selling_price_piece: product.selling_price_piece || '',
                opening_stock_peti: product.stock ? (product.stock / (product.packets_per_peti || 1)).toFixed(1) : '',
                noise_level: product.noise_level || 'Medium',
                is_kids_safe: Boolean(product.is_kids_safe),
                use_type: product.use_type || 'Outdoor',
                season: product.season || 'Diwali',
                hsn_code: product.hsn_code || '',
                gst_percentage: product.gst_percentage || '',
                video_downloadable: Boolean(product.video_downloadable),
                is_featured: Boolean(product.is_featured)
            });
        }
    }, [product]);

    // Auto Calculate Costs & Stock
    useEffect(() => {
        const packetsInPeti = parseFloat(formData.packets_per_peti) || 1;
        const piecesInPacket = parseFloat(formData.pieces_per_packet) || 1;
        const petiCost = parseFloat(formData.purchase_price) || 0;
        const stockPeti = parseFloat(formData.opening_stock_peti) || 0;

        setCalculated({
            costPerPacket: (petiCost / packetsInPeti).toFixed(2),
            costPerPiece: (petiCost / (packetsInPeti * piecesInPacket)).toFixed(2),
            totalPackets: Math.round(stockPeti * packetsInPeti),
            totalPieces: Math.round(stockPeti * packetsInPeti * piecesInPacket)
        });

    }, [formData.purchase_price, formData.packets_per_peti, formData.pieces_per_packet, formData.opening_stock_peti]);


    const formatSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    // Handle File Changes
    const handleFileChange = (type, e) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles.length) return;

        // Constants
        const MAX_IMG = 5 * 1024 * 1024; // 5MB
        const MAX_VID = 50 * 1024 * 1024; // 50MB

        if (type === 'thumbnail') {
            const file = selectedFiles[0];
            if (file.size > MAX_IMG) { alert("Thumbnail too large! Max 5MB."); return; }
            setFiles(prev => ({ ...prev, thumbnail: file }));
            setPreviews(prev => ({ ...prev, thumbnail: URL.createObjectURL(file) }));
        } else if (type === 'images') {
            const fileArray = Array.from(selectedFiles);
            const validFiles = fileArray.filter(f => {
                if (f.size > MAX_IMG) { alert(`Skipped ${f.name} (Too large > 5MB)`); return false; }
                return true;
            });
            setFiles(prev => ({ ...prev, images: validFiles }));
            setPreviews(prev => ({ ...prev, images: validFiles.map(f => URL.createObjectURL(f)) }));
        } else if (type === 'video') {
            const file = selectedFiles[0];
            if (file.size > MAX_VID) { alert("Video too large! Max 50MB."); return; }
            setFiles(prev => ({ ...prev, video: file }));
            setPreviews(prev => ({ ...prev, video: URL.createObjectURL(file) }));
        }
    };

    const clearSelection = (type) => {
        if (type === 'images') {
            setFiles(prev => ({ ...prev, images: [] }));
            setPreviews(prev => ({ ...prev, images: [] }));
        } else if (type === 'video') {
            setFiles(prev => ({ ...prev, video: null }));
            setPreviews(prev => ({ ...prev, video: null }));
        } else {
            setFiles(prev => ({ ...prev, [type]: null }));
            setPreviews(prev => ({ ...prev, [type]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // Prevent double submission
        setLoading(true);

        const payload = new FormData();
        // Append all text fields
        Object.keys(formData).forEach(key => {
            if (typeof formData[key] === 'boolean') {
                payload.append(key, formData[key] ? 1 : 0);
            } else {
                payload.append(key, formData[key]);
            }
        });

        // Final Stock Override (We save Total Packets as 'stock')
        payload.append('stock', calculated.totalPackets);

        // Files
        if (files.thumbnail) payload.append('thumbnail', files.thumbnail);
        Array.from(files.images).forEach(f => payload.append('images[]', f));
        if (files.video) payload.append('videos[]', files.video);

        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            };
            if (product) {
                payload.append('_method', 'PUT');
                await api.post(`/admin/products/${product.id}`, payload, config);
            } else {
                await api.post('/admin/products', payload, config);
            }
            onSuccess();
        } catch (e) {
            alert("Failed: " + (e.response?.data?.message || e.message));
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    // Dynamic Label Helper
    const getSizeLabel = () => {
        const catName = categories.find(c => c.id == formData.category_id)?.name?.toLowerCase() || '';
        if (catName.includes('shot')) return 'Number of Shots (e.g. 12 Shot)';
        if (catName.includes('ladi') || catName.includes('wala')) return 'Wala Type (e.g. 1000 Wala)';
        if (catName.includes('rocket')) return 'Size (e.g. 6 Inch)';
        return 'Size / Type / Specification';
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-8">
            <h1 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">{product ? 'Update Product' : 'Add New Product'}</h1>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">

                {/* STEP 1: CATEGORY */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">1</span>
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Category Select</h2>
                    </div>
                    <select
                        className="w-full text-lg p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none bg-blue-50/30"
                        value={formData.category_id}
                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                        required
                    >
                        <option value="">-- Choose Category --</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                {/* STEP 2: BASIC DETAILS */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">2</span>
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Product Details</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Product Name</label>
                            <input className="w-full border-b-2 border-gray-200 p-2 focus:border-blue-500 outline-none font-bold text-lg"
                                placeholder="Deluxe Anar" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{getSizeLabel()}</label>
                            <input className="w-full border-b-2 border-gray-200 p-2 focus:border-blue-500 outline-none font-bold text-lg"
                                placeholder="e.g. 15 cm" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Brand (Optional)</label>
                            <input className="w-full border-b-2 border-gray-200 p-2 focus:border-blue-500 outline-none"
                                placeholder="Standard Fireworks" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Short Description</label>
                            <input className="w-full border-b-2 border-gray-200 p-2 focus:border-blue-500 outline-none"
                                placeholder="One line description..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* STEP 3: UNIT & PACKING */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 ring-4 ring-orange-50/50">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">3</span>
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Packing Configuration</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4 items-end">
                        <div className="text-center bg-gray-50 p-4 rounded-xl">
                            <label className="text-xs font-bold text-gray-500 block mb-2">1. Master Unit</label>
                            <select className="w-full font-bold text-center bg-transparent outline-none border-b border-gray-300"
                                value={formData.package_type} onChange={e => setFormData({ ...formData, package_type: e.target.value })}>
                                <option value="Box">Box (Peti)</option>
                                <option value="Carton">Carton</option>
                                <option value="Sack">Sack (Bori)</option>
                            </select>
                        </div>
                        <div className="text-center font-black text-gray-300 text-xl">=</div>
                        <div className="text-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <label className="text-xs font-bold text-blue-500 block mb-2">2. Packets inside</label>
                            <input type="number" className="w-full font-black text-xl text-center text-blue-700 bg-transparent outline-none"
                                value={formData.packets_per_peti} onChange={e => setFormData({ ...formData, packets_per_peti: e.target.value })} />
                            <span className="text-[10px] uppercase font-bold text-blue-300">Packets</span>
                        </div>
                        {/* Pieces only relevant if packets contain multiple pieces */}
                        <div className="col-span-3 flex justify-center mt-2">
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                                <span className="text-xs font-bold text-gray-500">Each packet contains</span>
                                <input type="number" className="w-16 text-center font-bold border-b border-gray-400 bg-transparent outline-none"
                                    value={formData.pieces_per_packet} onChange={e => setFormData({ ...formData, pieces_per_packet: e.target.value })} />
                                <span className="text-xs font-bold text-gray-500">Pieces</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 4: PURCHASE PRICE */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">4</span>
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Purchase (Cost) Price</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Purchase Price (Per {formData.package_type})</label>
                            <input type="number" className="w-full border p-3 rounded-xl bg-blue-50 border-blue-200 font-bold text-lg outline-none"
                                placeholder="0.00" value={formData.purchase_price} onChange={e => setFormData({ ...formData, purchase_price: e.target.value })} />
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl flex flex-col justify-center">
                            <span className="text-xs text-gray-400 uppercase font-bold">Auto-Calc: Packet Cost</span>
                            <span className="text-lg font-black text-gray-700">₹{calculated.costPerPacket}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl flex flex-col justify-center">
                            <span className="text-xs text-gray-400 uppercase font-bold">Auto-Calc: Piece Cost</span>
                            <span className="text-lg font-black text-gray-700">₹{calculated.costPerPiece}</span>
                        </div>
                    </div>
                </div>

                {/* STEP 5: SELLING PRICE */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 ring-4 ring-green-50/50">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">5</span>
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Selling Price</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sell {formData.package_type}</label>
                            <input type="number" className="w-full border border-gray-200 p-2 rounded bg-white font-bold"
                                placeholder="0" value={formData.selling_price_peti} onChange={e => setFormData({ ...formData, selling_price_peti: e.target.value })} />
                        </div>
                        <div className="scale-105 transform origin-bottom">
                            <label className="block text-xs font-bold text-green-600 uppercase mb-1">Sell Packet (Main)</label>
                            <input type="number" className="w-full border-2 border-green-400 p-2 rounded-lg bg-green-50 font-black text-xl outline-none"
                                placeholder="0" value={formData.selling_price_packet} onChange={e => setFormData({ ...formData, selling_price_packet: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sell Piece (Optional)</label>
                            <input type="number" className="w-full border border-gray-200 p-2 rounded bg-white font-bold"
                                placeholder="0" value={formData.selling_price_piece} onChange={e => setFormData({ ...formData, selling_price_piece: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* STEP 6: STOCK */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">6</span>
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Opening Stock</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qty in {formData.package_type}s</label>
                            <input type="number" className="w-full border-b-2 border-gray-300 p-2 font-bold text-xl outline-none"
                                placeholder="0" value={formData.opening_stock_peti} onChange={e => setFormData({ ...formData, opening_stock_peti: e.target.value })} />
                        </div>
                        <div className="flex-none text-gray-300 text-3xl">→</div>
                        <div className="flex-1 bg-gray-100 p-4 rounded-xl">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-500 uppercase">Total Packets</span>
                                <span className="text-xl font-black text-gray-800">{calculated.totalPackets}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-gray-200 pt-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Total Pieces</span>
                                <span className="text-sm font-bold text-gray-500">{calculated.totalPieces}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 7: ATTRIBUTES */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">7</span>
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Product Attributes</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Noise Level</label>
                            <select className="w-full border p-2 rounded" value={formData.noise_level} onChange={e => setFormData({ ...formData, noise_level: e.target.value })}>
                                <option>Low</option><option>Medium</option><option>High</option><option>Boom!</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Usage</label>
                            <select className="w-full border p-2 rounded" value={formData.use_type} onChange={e => setFormData({ ...formData, use_type: e.target.value })}>
                                <option>Outdoor</option><option>Indoor</option><option>Both</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Season</label>
                            <select className="w-full border p-2 rounded" value={formData.season} onChange={e => setFormData({ ...formData, season: e.target.value })}>
                                <option>Diwali</option><option>Wedding</option><option>All Year</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer bg-green-50 px-3 py-2 rounded-lg w-full border border-green-100">
                                <input type="checkbox" className="w-4 h-4 accent-green-600" checked={formData.is_kids_safe} onChange={e => setFormData({ ...formData, is_kids_safe: e.target.checked })} />
                                <span className="text-xs font-bold text-green-700 uppercase">Kids Safe?</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* STEP 8: TAX (Combined with Attributes for space or separate) - User asked for Step 8: Tax */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">8</span>
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Tax & Compliance</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">HSN Code</label>
                            <input className="w-full border p-2 rounded" placeholder="3604" value={formData.hsn_code} onChange={e => setFormData({ ...formData, hsn_code: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">GST %</label>
                            <select className="w-full border p-2 rounded" value={formData.gst_percentage} onChange={e => setFormData({ ...formData, gst_percentage: e.target.value })}>
                                <option value="">Exempt</option><option value="5">5%</option><option value="12">12%</option><option value="18">18%</option><option value="28">28%</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* STEP 9: MEDIA */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">9</span>
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Media Upload</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Thumbnail */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600 uppercase flex justify-between">
                                <span>Main Image</span>
                                <span className="text-[10px] text-gray-400">Max 5MB</span>
                            </label>
                            <div className="relative group overflow-hidden rounded-xl border-dashed border-2 border-gray-300 aspect-square bg-gray-50 flex items-center justify-center hover:bg-white transition-colors">
                                {previews.thumbnail || product?.thumbnail_url ? (
                                    <img src={previews.thumbnail || (product?.thumbnail_url?.startsWith('http') ? product.thumbnail_url : (product?.thumbnail_url?.startsWith('/') ? product.thumbnail_url : `/storage/${product.thumbnail_url}`))} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-gray-400 font-bold">Upload</span>
                                )}
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange('thumbnail', e)} />
                            </div>
                            {files.thumbnail && (
                                <p className="text-[10px] text-blue-600 font-bold mt-1">Size: {formatSize(files.thumbnail.size)}</p>
                            )}
                        </div>
                        {/* Gallery */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-gray-600 uppercase">Gallery <span className="text-[10px] text-gray-400 font-normal">(Max 5MB/each)</span></label>
                                {previews.images.length > 0 && <button type="button" onClick={() => clearSelection('images')} className="text-[10px] text-red-500 font-bold">CLEAR</button>}
                            </div>
                            <div className="relative rounded-xl border-dashed border-2 border-gray-300 h-32 bg-gray-50 flex items-center justify-center">
                                <span className="text-xs text-gray-400 font-bold text-center px-4">
                                    {previews.images.length > 0 ? `${previews.images.length} Selected (${formatSize(files.images.reduce((acc, f) => acc + f.size, 0))})` : 'Select Images'}
                                </span>
                                <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange('images', e)} />
                            </div>
                        </div>
                        {/* Video */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-gray-600 uppercase">Video (Single)</label>
                                {previews.video && <button type="button" onClick={() => clearSelection('video')} className="text-[10px] text-red-500 font-bold">CLEAR</button>}
                            </div>
                            <div className="relative rounded-xl border-dashed border-2 border-gray-300 h-32 bg-gray-50 flex items-center justify-center">
                                {previews.video ? (
                                    <div className="text-center">
                                        <span className="text-xs font-bold text-green-600">Video Selected</span>
                                        {files.video && <p className="text-[10px] text-blue-600 font-bold">Size: {formatSize(files.video.size)}</p>}
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400 font-bold tracking-tight text-center px-4">Select Video<br />(MP4, Max 50MB)</span>
                                )}
                                <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange('video', e)} />
                            </div>
                            <label className="flex items-center gap-2 mt-2">
                                <input type="checkbox" checked={formData.video_downloadable} onChange={e => setFormData({ ...formData, video_downloadable: e.target.checked })} className="rounded text-blue-600" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Allow Download key?</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* STEP 10: SAVE */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky bottom-4 z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">10</span>
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Publish</h2>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all flex-1">
                            <input type="checkbox" className="w-5 h-5 accent-red-600 rounded" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} />
                            <div>
                                <p className="text-xs font-black text-gray-700 uppercase">Mark as Featured</p>
                            </div>
                        </label>
                        <button type="button" onClick={onCancel} className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 bg-white border border-gray-200">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-[2] bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    {uploadProgress > 0 && uploadProgress < 100 ? `Uploading: ${uploadProgress}%` : 'Processing...'}
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                </span>
                            ) : 'Save Product'}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
}
