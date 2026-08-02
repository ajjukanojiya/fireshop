import React, { useState, useEffect } from 'react';
import api from '../../api/api';

export default function AdminProductForm({ product, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        category_id: '',
        title: '',
        brand: '',
        size: '',
        description: '',
        package_type: 'Box',
        packets_per_peti: 1,
        pieces_per_packet: 1,
        purchase_price: '',
        selling_price_peti: '',
        selling_price_packet: '',
        selling_price_piece: '',
        opening_stock_peti: '',
        noise_level: 'Medium',
        is_kids_safe: false,
        use_type: 'Outdoor',
        season: 'Diwali',
        hsn_code: '',
        gst_percentage: '',
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
    const [allProducts, setAllProducts] = useState([]);
    const [isBundle, setIsBundle] = useState(false);
    const [bundleItems, setBundleItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        api.get('/admin/categories').then(res => setCategories(res.data));
        api.get('/products?limit=1000').then(res => setAllProducts(res.data.data || res.data)).catch(e => {
            api.get('/admin/products').then(res => setAllProducts(res.data.data || res.data));
        });

        if (product) {
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
                video_downloadable: product.video_downloadable == 1 || product.video_downloadable === true,
                is_featured: product.is_featured == 1 || product.is_featured === true
            });
            setIsBundle(product.is_bundle == 1 || product.is_bundle === true);
            if (product.bundle_items && product.bundle_items.length > 0) {
                setBundleItems(product.bundle_items.map(b => ({ product_id: b.product_id, title: b.product?.title || 'Unknown', quantity: b.quantity })));
            }
        }
    }, [product]);

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

    const getFullUrl = (url) => {
        if (!url) return "";
        if (url.startsWith('http')) return url;
        const apiBase = import.meta.env.VITE_API_BASE || '';
        const host = apiBase.replace(/\/api\/v1\/?$/, ''); // Extract https://domain.com
        let cleanUrl = url.replace(/https?:\/\/localhost:8000/g, '');
        if (!cleanUrl.startsWith('/')) cleanUrl = '/' + cleanUrl;
        if (!cleanUrl.startsWith('/storage/')) cleanUrl = '/storage' + cleanUrl;
        return `${host}${cleanUrl}`;
    };

    const formatSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const handleFileChange = (type, e) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles.length) return;

        const MAX_IMG = 5 * 1024 * 1024;
        const MAX_VID = 50 * 1024 * 1024;

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
        if (loading) return;
        setLoading(true);

        const payload = new FormData();
        Object.keys(formData).forEach(key => {
            if (typeof formData[key] === 'boolean') {
                payload.append(key, formData[key] ? 1 : 0);
            } else {
                payload.append(key, formData[key]);
            }
        });

        payload.append('stock', calculated.totalPackets);
        payload.append('is_bundle', isBundle ? 1 : 0);
        if (isBundle) {
            payload.append('bundle_items', JSON.stringify(bundleItems));
        }

        if (files.thumbnail) payload.append('thumbnail', files.thumbnail);
        Array.from(files.images).forEach(f => payload.append('images[]', f));
        if (files.video) payload.append('videos[]', files.video);

        try {
            const config = {
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

    const getSizeLabel = () => {
        const catName = categories.find(c => c.id == formData.category_id)?.name?.toLowerCase() || '';
        if (catName.includes('shot')) return 'Number of Shots (e.g. 12)';
        if (catName.includes('ladi') || catName.includes('wala')) return 'Wala Type (e.g. 1000)';
        if (catName.includes('rocket')) return 'Size (e.g. 6 Inch)';
        return 'Size / Type / Spec';
    };

    // Shared input class for professional SaaS look
    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-colors text-gray-900";
    const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5";
    const cardClass = "bg-white rounded-xl p-5 shadow-sm border border-gray-200/60";

    return (
        <div className="bg-gray-50/50 min-h-full p-4 md:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={onCancel} className="text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-1.5 text-sm font-semibold shadow-sm transition-colors flex items-center gap-2">
                            <span>&larr;</span> Back
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{product ? 'Edit Product' : 'Add New Product'}</h1>
                    </div>
                </div>

                {/* SLEEK TAB NAVIGATION */}
                <div className="flex gap-1 p-1 bg-gray-200/50 rounded-lg mb-6 w-max">
                    <button type="button" onClick={() => setActiveTab('basic')} 
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'basic' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-900/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}>
                        Basic Details
                    </button>
                    <button type="button" onClick={() => setActiveTab('pricing')} 
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'pricing' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-900/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}>
                        Pricing & Inventory
                    </button>
                    <button type="button" onClick={() => setActiveTab('advanced')} 
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'advanced' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-900/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}>
                        Advanced Settings
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* =======================================================
                                          TAB: BASIC INFO 
                        ======================================================= */}
                    {activeTab === 'basic' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className={cardClass}>
                                <h2 className="text-sm font-bold text-gray-900 mb-4">General Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Category <span className="text-red-500">*</span></label>
                                        <select className={inputClass} value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} required>
                                            <option value="">Select a category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Product Name <span className="text-red-500">*</span></label>
                                            <input className={inputClass} placeholder="e.g. Deluxe Anar" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                        </div>
                                        <div>
                                            <label className={labelClass}>{getSizeLabel()} <span className="text-gray-400 font-normal">(Optional)</span></label>
                                            <input className={inputClass} placeholder="e.g. 15 cm" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Brand (Optional)</label>
                                            <input className={inputClass} placeholder="e.g. Standard" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={labelClass}>Short Description <span className="text-gray-400 font-normal">(Optional)</span></label>
                                            <textarea rows="2" className={inputClass} placeholder="Describe the item..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={cardClass}>
                                <h2 className="text-sm font-bold text-gray-900 mb-4">Media Assets</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Thumbnail */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className={labelClass + " !mb-0"}>Thumbnail</label>
                                            <span className="text-[10px] text-gray-400">Max 5MB</span>
                                        </div>
                                        <div className="relative group overflow-hidden rounded-lg border-dashed border-2 border-gray-300 aspect-square bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center">
                                            {previews.thumbnail || product?.thumbnail_url ? (
                                                <img src={previews.thumbnail || (product?.thumbnail_url?.startsWith('http') ? product.thumbnail_url : (product?.thumbnail_url?.startsWith('/') ? product.thumbnail_url : `/storage/${product.thumbnail_url}`))} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-medium text-gray-500">Select Image</span>
                                            )}
                                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange('thumbnail', e)} />
                                        </div>
                                    </div>
                                    
                                    {/* Gallery */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className={labelClass + " !mb-0"}>Gallery</label>
                                            {previews.images.length > 0 && <button type="button" onClick={() => clearSelection('images')} className="text-[10px] font-semibold text-red-500">Clear</button>}
                                        </div>
                                        {product?.images?.length > 0 && previews.images.length === 0 && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {product.images.map((img, i) => (
                                                    <img key={i} src={getFullUrl(img.url)} className="w-8 h-8 object-cover rounded border border-gray-200" alt="Existing" />
                                                ))}
                                                <span className="text-[10px] text-gray-500 self-center ml-1">Current</span>
                                            </div>
                                        )}
                                        <div className="relative rounded-lg border-dashed border-2 border-gray-300 h-24 md:h-auto md:aspect-square bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center overflow-hidden">
                                            {previews.images.length > 0 ? (
                                                <div className="flex gap-1 p-1 overflow-x-auto">
                                                    {previews.images.map((url, i) => <img key={i} src={url} className="w-10 h-10 object-cover rounded" />)}
                                                </div>
                                            ) : (
                                                <span className="text-xs font-medium text-gray-500">Multiple Images</span>
                                            )}
                                            <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange('images', e)} />
                                        </div>
                                    </div>

                                    {/* Video */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className={labelClass + " !mb-0"}>Video</label>
                                            {previews.video && <button type="button" onClick={() => clearSelection('video')} className="text-[10px] font-semibold text-red-500">Clear</button>}
                                        </div>
                                        <div className="relative rounded-lg border-dashed border-2 border-gray-300 h-24 md:h-auto md:aspect-square bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center">
                                            {previews.video ? (
                                                <span className="text-xs font-medium text-green-600">Video Added</span>
                                            ) : (
                                                <span className="text-xs font-medium text-gray-500">{product?.videos?.length > 0 ? 'Replace Video' : 'Add MP4'}</span>
                                            )}
                                            <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange('video', e)} />
                                        </div>
                                        <label className="flex items-center gap-2 mt-2">
                                            <input type="checkbox" checked={formData.video_downloadable} onChange={e => setFormData({ ...formData, video_downloadable: e.target.checked })} className="rounded border-gray-300 text-blue-600" />
                                            <span className="text-xs font-medium text-gray-600">Downloadable?</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* =======================================================
                                          TAB: PRICING & STOCK 
                        ======================================================= */}
                    {activeTab === 'pricing' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className={cardClass}>
                                <h2 className="text-sm font-bold text-gray-900 mb-4">Packaging Configuration</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelClass}>Master Unit (Outer) <span className="text-gray-400 font-normal">(Optional)</span></label>
                                        <select className={inputClass} value={formData.package_type} onChange={e => setFormData({ ...formData, package_type: e.target.value })}>
                                            <option value="Box">Box (Peti)</option>
                                            <option value="Carton">Carton</option>
                                            <option value="Sack">Sack (Bori)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Packets per {formData.package_type} <span className="text-gray-400 font-normal">(Optional)</span></label>
                                        <input type="number" className={inputClass} value={formData.packets_per_peti} onChange={e => setFormData({ ...formData, packets_per_peti: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Pieces per packet <span className="text-gray-400 font-normal">(Optional)</span></label>
                                        <input type="number" className={inputClass} value={formData.pieces_per_packet} onChange={e => setFormData({ ...formData, pieces_per_packet: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={cardClass}>
                                    <h2 className="text-sm font-bold text-gray-900 mb-4">Costing</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className={labelClass}>Purchase Price (Per {formData.package_type}) <span className="text-gray-400 font-normal">(Optional)</span></label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                                                <input type="number" className={inputClass + " pl-7"} placeholder="0.00" value={formData.purchase_price} onChange={e => setFormData({ ...formData, purchase_price: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex-1">
                                                <span className="text-[10px] text-gray-500 font-medium block">Cost / Packet</span>
                                                <span className="text-sm font-semibold text-gray-900">₹{calculated.costPerPacket}</span>
                                            </div>
                                            <div className="flex-1 border-l border-gray-200 pl-4">
                                                <span className="text-[10px] text-gray-500 font-medium block">Cost / Piece</span>
                                                <span className="text-sm font-semibold text-gray-900">₹{calculated.costPerPiece}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cardClass}>
                                    <h2 className="text-sm font-bold text-gray-900 mb-4">Selling Price</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className={labelClass}>Price per Packet (Main Price) <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                                                <input type="number" className={inputClass + " pl-7 border-blue-300 focus:ring-blue-500/30"} placeholder="0" value={formData.selling_price_packet} onChange={e => setFormData({ ...formData, selling_price_packet: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClass}>Sell {formData.package_type} (Opt)</label>
                                                <input type="number" className={inputClass} placeholder="0" value={formData.selling_price_peti} onChange={e => setFormData({ ...formData, selling_price_peti: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Sell Piece (Opt)</label>
                                                <input type="number" className={inputClass} placeholder="0" value={formData.selling_price_piece} onChange={e => setFormData({ ...formData, selling_price_piece: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={cardClass}>
                                <h2 className="text-sm font-bold text-gray-900 mb-4">Inventory</h2>
                                <div className="flex items-center gap-6">
                                    <div className="w-1/2">
                                        <label className={labelClass}>Opening Qty ({formData.package_type}s) <span className="text-gray-400 font-normal">(Optional)</span></label>
                                        <input type="number" className={inputClass} placeholder="0" value={formData.opening_stock_peti} onChange={e => setFormData({ ...formData, opening_stock_peti: e.target.value })} />
                                    </div>
                                    <div className="w-1/2 p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex flex-col justify-center">
                                        <span className="text-xs text-blue-600 font-medium mb-1">Total Salable Packets</span>
                                        <span className="text-2xl font-bold text-blue-900">{calculated.totalPackets}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* =======================================================
                                          TAB: ADVANCED 
                        ======================================================= */}
                    {activeTab === 'advanced' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className={cardClass}>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-sm font-bold text-gray-900">Combo Pack (Bundle)</h2>
                                        <p className="text-xs text-gray-500">Sell multiple products together as one item.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={isBundle} onChange={e => setIsBundle(e.target.checked)} />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                {isBundle && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex gap-2 mb-4">
                                            <select id="bundleProductSelect" className={inputClass + " flex-1"}>
                                                <option value="">Search to add product...</option>
                                                {allProducts.filter(p => p.id !== product?.id).map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                            </select>
                                            <input type="number" id="bundleQty" className={inputClass + " w-20 text-center"} defaultValue={1} min={1} />
                                            <button type="button" onClick={() => {
                                                const sel = document.getElementById('bundleProductSelect');
                                                const qty = parseInt(document.getElementById('bundleQty').value);
                                                if(sel.value && qty > 0) {
                                                    const pid = parseInt(sel.value);
                                                    const title = sel.options[sel.selectedIndex].text;
                                                    setBundleItems(prev => {
                                                        const ex = prev.find(i => i.product_id === pid);
                                                        if(ex) return prev.map(i => i.product_id === pid ? {...i, quantity: i.quantity + qty} : i);
                                                        return [...prev, {product_id: pid, title, quantity: qty}];
                                                    });
                                                    sel.value = '';
                                                    document.getElementById('bundleQty').value = 1;
                                                }
                                            }} className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">Add</button>
                                        </div>
                                        
                                        {bundleItems.length > 0 && (
                                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                {bundleItems.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0 bg-gray-50/50">
                                                        <span className="text-sm font-medium text-gray-700">{item.title}</span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">Qty: {item.quantity}</span>
                                                            <button type="button" onClick={() => setBundleItems(bundleItems.filter(i => i.product_id !== item.product_id))} className="text-gray-400 hover:text-red-500 transition-colors">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={cardClass}>
                                    <h2 className="text-sm font-bold text-gray-900 mb-4">Attributes</h2>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClass}>Noise Level <span className="text-gray-400 font-normal">(Optional)</span></label>
                                                <select className={inputClass} value={formData.noise_level} onChange={e => setFormData({ ...formData, noise_level: e.target.value })}>
                                                    <option>Low</option><option>Medium</option><option>High</option><option>Boom!</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelClass}>Usage <span className="text-gray-400 font-normal">(Optional)</span></label>
                                                <select className={inputClass} value={formData.use_type} onChange={e => setFormData({ ...formData, use_type: e.target.value })}>
                                                    <option>Outdoor</option><option>Indoor</option><option>Both</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Season Focus <span className="text-gray-400 font-normal">(Optional)</span></label>
                                            <select className={inputClass} value={formData.season} onChange={e => setFormData({ ...formData, season: e.target.value })}>
                                                <option>Diwali</option><option>Wedding</option><option>All Year</option>
                                            </select>
                                        </div>
                                        <label className="flex items-center gap-2 mt-2">
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={formData.is_kids_safe} onChange={e => setFormData({ ...formData, is_kids_safe: e.target.checked })} />
                                            <span className="text-sm text-gray-700">Safe for kids</span>
                                        </label>
                                    </div>
                                </div>

                                <div className={cardClass}>
                                    <h2 className="text-sm font-bold text-gray-900 mb-4">Tax & Compliance</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className={labelClass}>HSN Code <span className="text-gray-400 font-normal">(Optional)</span></label>
                                            <input className={inputClass} placeholder="e.g. 3604" value={formData.hsn_code} onChange={e => setFormData({ ...formData, hsn_code: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>GST Percentage <span className="text-gray-400 font-normal">(Optional)</span></label>
                                            <select className={inputClass} value={formData.gst_percentage} onChange={e => setFormData({ ...formData, gst_percentage: e.target.value })}>
                                                <option value="">Exempt (0%)</option>
                                                <option value="5">5%</option>
                                                <option value="12">12%</option>
                                                <option value="18">18%</option>
                                                <option value="28">28%</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STATIC ACTION BAR (Bottom of form) */}
                    <div className="pt-6 border-t border-gray-200 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <button type="button" onClick={onCancel} className="w-full md:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Discard
                        </button>
                        
                        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} />
                                <span className="text-sm font-medium text-gray-700">Publish as Featured</span>
                            </label>
                            
                            <button type="submit" disabled={loading} className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Saving...'}
                                    </span>
                                ) : (product ? 'Update Product' : 'Save Product')}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
