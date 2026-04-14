import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import api from '../../api/api';

export default function BulkImport({ onCancel, onSuccess }) {
    const [step, setStep] = useState(1); // 1: Upload, 2: Review, 3: Uploading, 4: Done
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [progress, setProgress] = useState(0);
    const [uploadErrors, setUploadErrors] = useState([]);
    const [aiImagePreview, setAiImagePreview] = useState(null);
    
    // For media uploading to a specific row
    const [activeRowIndex, setActiveRowIndex] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        api.get('/admin/categories').then(res => setCategories(res.data)).catch(console.error);
    }, []);

    const downloadTemplate = () => {
        const headers = ["title", "category_name", "description", "brand", "selling_price_packet", "package_type", "pieces_per_packet", "packets_per_peti", "stock"];
        const csv = Papa.unparse({ fields: headers, data: [["Sample Product", "Firecrackers", "Awesome cracker", "SuperBrand", 1500, "Box", 10, 5, 100]] });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "fireshop_bulk_template.csv";
        a.click();
    };

    const downloadDealerFormat = () => {
        const headers = ["S.No.", "Item Name / Patakha", "Brand", "Pack Type (Box/Pkt)", "Pcs Per Pack", "Stock (Total Quantity)", "Rate Per Pack (Rs)"];
        const csv = Papa.unparse({ fields: headers, data: [
            ["1", "Sky Shot Golden", "Standard", "Box", "10", "50", "280.00"],
            ["2", "Laxmi Bomb", "Cock", "Packet", "5", "120", "45.00"],
            ["3", "", "", "", "", "", ""]
        ] });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Ideal_Dealer_Invoice_Format.csv";
        a.click();
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsed = results.data.map((row, idx) => {
                    // Try to map category_name to category_id
                    let category_id = "";
                    if (row.category_name && categories.length > 0) {
                        const found = categories.find(c => c.name.toLowerCase() === row.category_name.trim().toLowerCase());
                        if (found) category_id = found.id;
                    }
                    return {
                        id: idx, // temporary id
                        title: row.title || '',
                        category_id: category_id,
                        description: row.description || '',
                        brand: row.brand || '',
                        package_type: row.package_type || '',
                        pieces_per_packet: row.pieces_per_packet || '',
                        packets_per_peti: row.packets_per_peti || '',
                        selling_price_packet: row.selling_price_packet || '',
                        stock: row.stock || '0',
                        // Media specific
                        thumbnail: null,
                        images: [],
                        videos: []
                    };
                });
                setData(parsed);
                setStep(2);
            }
        });
    };

    const handleAiUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Set preview for the Split-Screen UI
        setAiImagePreview(URL.createObjectURL(file));

        setStep('ai_loading');
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const res = await api.post('/admin/products/ai-extract', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data?.data) {
                const defaultCat = categories.length > 0 ? categories[0].id : "";
                const aiData = res.data.data.map((row, idx) => ({
                    id: idx,
                    title: row.title || '',
                    category_id: defaultCat,
                    description: "Auto Extracted by AI",
                    brand: row.brand || '',
                    package_type: row.package_type || '',
                    pieces_per_packet: row.pieces_per_packet || '',
                    packets_per_peti: row.packets_per_peti || '',
                    selling_price_packet: row.selling_price_packet || '',
                    stock: row.stock || '0',
                    thumbnail: null,
                    images: [],
                    videos: []
                }));
                setData(aiData);
                setStep(2);
            } else {
                alert("AI could not read any valid data.");
                setStep(1);
            }
        } catch (error) {
            alert(`AI Error: ${error.response?.data?.message || 'Missing Configuration'}`);
            setStep(1);
        }
        
        // Reset the file input to allow uploading again
        if(e.target) e.target.value = null;
    };

    const addEmptyRow = () => {
        const defaultCat = categories.length > 0 ? categories[0].id : "";
        setData([...data, {
            id: Date.now(), title: "", category_id: defaultCat, description: "", 
            brand: "", package_type: "", pieces_per_packet: "", packets_per_peti: "", 
            selling_price_packet: "", stock: "0", thumbnail: null, images: [], videos: []
        }]);
    };

    const handleDataChange = (index, field, value) => {
        const newData = [...data];
        newData[index][field] = value;
        setData(newData);
    };

    const openMediaSelector = (index) => {
        setActiveRowIndex(index);
        fileInputRef.current.click();
    };

    const handleMediaSelect = (e) => {
        if (!e.target.files || activeRowIndex === null) return;
        const files = Array.from(e.target.files);
        const newData = [...data];
        const row = newData[activeRowIndex];

        files.forEach(f => {
            if (f.type.startsWith('video/')) {
                row.videos.push(f);
            } else if (f.type.startsWith('image/')) {
                if (!row.thumbnail) row.thumbnail = f;
                else row.images.push(f);
            }
        });
        
        setData(newData);
        setActiveRowIndex(null);
        fileInputRef.current.value = "";
    };

    const startUpload = async () => {
        if (data.length === 0) return;

        // Front-end Validation
        const unselectedCatIndex = data.findIndex(row => !row.category_id);
        if (unselectedCatIndex !== -1) {
            alert(`⚠️ Error: Details missing!\nPlease select a Category for Row ${unselectedCatIndex + 1} (${data[unselectedCatIndex].title}) before importing.`);
            return;
        }

        setStep(3);
        setUploadErrors([]);
        
        const errors = [];
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const formData = new FormData();
            
            // Basic fields
            Object.keys(item).forEach(key => {
                if (!['id', 'thumbnail', 'images', 'videos'].includes(key)) {
                    if (item[key]) formData.append(key, item[key]);
                }
            });

            if (item.thumbnail) formData.append('thumbnail', item.thumbnail);
            if (item.images?.length > 0) item.images.forEach(img => formData.append('images[]', img));
            if (item.videos?.length > 0) item.videos.forEach(vid => formData.append('videos[]', vid));

            try {
                await api.post('/admin/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } catch (err) {
                errors.push(`Row ${i + 1} (${item.title}): ${err.response?.data?.message || 'Upload failed'}`);
            }
            
            setProgress(Math.round(((i + 1) / data.length) * 100));
        }

        if (errors.length > 0) setUploadErrors(errors);
        setStep(4);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span>⚡</span> Smart Bulk CSV Import
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Easily upload multiple products at once from Excel/CSV and attach visual media.</p>
                </div>
                <button onClick={onCancel} className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg">✕</button>
            </div>

            {step === 1 && (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
                        {/* Box 1: CSV Upload */}
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 p-8 flex flex-col items-center text-center transition-all hover:border-gray-300">
                            <div className="text-6xl mb-4">📄</div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Manual CSV Import</h3>
                            <p className="text-gray-500 mb-8 text-sm max-w-[250px]">Use our standard format to populate product fields in bulk via Excel.</p>
                            
                            <div className="flex flex-col gap-3 w-full mt-auto">
                                <button onClick={downloadTemplate} className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all">
                                    📥 Download Template
                                </button>
                                <label className="w-full py-3 bg-slate-900 border border-transparent text-white rounded-xl font-medium hover:bg-slate-800 transition-all cursor-pointer shadow-md shadow-slate-200">
                                    📂 Select CSV File
                                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </div>
                        </div>

                        {/* Box 2: AI Magic Scan */}
                        <div className="border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/40 p-8 flex flex-col items-center text-center relative overflow-hidden transition-all hover:border-indigo-400 hover:bg-indigo-50">
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl tracking-wider">NEW & MAGICAL ✨</div>
                            <div className="text-6xl mb-4">🤖</div>
                            <h3 className="text-xl font-bold text-indigo-900 mb-2">AI Magic Scan</h3>
                            <p className="text-indigo-600/80 mb-8 text-sm max-w-[280px]">Upload a photo of your supplier catalog or invoice. AI will read it and auto-fill the table format.</p>
                            
                            <div className="flex flex-col gap-3 w-full mt-auto">
                                <button onClick={downloadDealerFormat} className="w-full py-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2">
                                    📋 Download Dealer Format (Excel)
                                </button>
                                <label className="w-full py-3 bg-indigo-600 border border-transparent text-white rounded-xl font-bold hover:bg-indigo-700 transition-all cursor-pointer shadow-md shadow-indigo-200 flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                    Upload Photo / PDF
                                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleAiUpload} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 'ai_loading' && (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                    <div className="text-6xl animate-bounce mb-4" style={{ animationDuration: '2s' }}>🤖</div>
                    <h3 className="text-2xl font-bold text-indigo-800 mb-2">AI is reading your document...</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Extracting titles, pricing, packaging and converting to structured data.</p>
                    
                    <div className="w-full max-w-xs bg-indigo-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-indigo-600 h-2.5 rounded-full animate-pulse w-full"></div>
                    </div>
                    <p className="text-xs text-indigo-400 font-bold mt-4 animate-pulse">This usually takes around 5-10 seconds</p>
                </div>
            )}

            {step === 2 && (
                <div className={`flex-1 flex overflow-hidden gap-6 ${aiImagePreview ? 'flex-row' : 'flex-col'}`}>
                    
                    {/* Left Panel: Original Image */}
                    {aiImagePreview && (
                        <div className="w-1/3 flex flex-col bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner relative shrink-0">
                            <div className="absolute top-0 left-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-br-lg shadow z-10 w-full text-center tracking-wider">
                                📸 ORIGINAL PICTURE (COMPARE)
                            </div>
                            <div className="flex-1 overflow-auto p-2 mt-8 cursor-crosshair">
                                <img src={aiImagePreview} className="w-full h-auto object-contain rounded" alt="Original Scanned Document" />
                            </div>
                        </div>
                    )}

                    {/* Right Panel: Extracted Data */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex justify-between items-end mb-4 pr-1">
                            <h3 className="font-bold text-gray-800 text-lg">Review Table ({data.length} Detected)</h3>
                            {aiImagePreview && (
                                <button onClick={() => setAiImagePreview(null)} className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 hover:bg-blue-100 rounded-full font-bold transition-colors">
                                    X Hide Image
                                </button>
                            )}
                        </div>
                        
                        <div className="flex-1 overflow-auto border border-gray-200 rounded-xl shadow-sm bg-white">
                            <table className="w-full text-left text-sm whitespace-nowrap relative">
                            <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="p-3">#</th>
                                    <th className="p-3">Title</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">S. Price</th>
                                    <th className="p-3">Stock</th>
                                    <th className="p-3 text-center">Media (Img/Vid)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-3 text-gray-400 font-bold">{i + 1}</td>
                                        <td className="p-3">
                                            <input className="border border-gray-300 rounded px-2 py-1 w-48 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                                   value={row.title} onChange={e => handleDataChange(i, 'title', e.target.value)} />
                                        </td>
                                        <td className="p-3">
                                            <select className="border border-gray-300 rounded px-2 py-1 w-32 text-sm" 
                                                    value={row.category_id} onChange={e => handleDataChange(i, 'category_id', e.target.value)}>
                                                <option value="">Select Category</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <input type="number" className="border border-gray-300 rounded px-2 py-1 w-24 text-sm" 
                                                   value={row.selling_price_packet} onChange={e => handleDataChange(i, 'selling_price_packet', e.target.value)} />
                                        </td>
                                        <td className="p-3">
                                            <input type="number" className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" 
                                                   value={row.stock} onChange={e => handleDataChange(i, 'stock', e.target.value)} />
                                        </td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => openMediaSelector(i)} className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded hover:bg-blue-100 font-medium text-xs transition-colors">
                                                {row.thumbnail || row.images.length || row.videos.length ? 
                                                    `📎 ${row.thumbnail ? 1 : 0} Thmb, ${row.images.length} Img, ${row.videos.length} Vid` : 
                                                    "+ Attach Media"
                                                }
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="mt-4 flex justify-start">
                        <button onClick={addEmptyRow} className="px-4 py-2 border border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 font-bold flex items-center gap-2 transition-all">
                            <span>+</span> Add Missed Item (Empty Row)
                        </button>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={() => { setStep(1); setAiImagePreview(null); }} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50">Back</button>
                        <button onClick={startUpload} className="px-5 py-2.5 bg-green-600 shadow-md shadow-green-200 text-white rounded-xl font-bold hover:bg-green-700">
                            🚀 Import {data.length} Products
                        </button>
                    </div>
                    </div> {/* End Right Panel */}
                </div>
            )}

            {step === 3 && (
                <div className="flex-1 flex flex-col items-center justify-center p-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Importing Products...</h3>
                    <p className="text-gray-500 mb-8">Please do not close this window. Uploading data and media.</p>
                    
                    <div className="w-full max-w-md bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
                        <div className="bg-blue-600 h-4 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="font-bold text-blue-600 text-xl">{progress}%</div>
                </div>
            )}

            {step === 4 && (
                <div className="flex-1 flex flex-col items-center justify-center p-12">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Import Complete!</h3>
                    
                    {uploadErrors.length > 0 ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mt-4 w-full max-w-lg max-h-48 overflow-auto border border-red-100 text-sm">
                            <p className="font-bold mb-2">Some products failed to upload:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                {uploadErrors.map((err, i) => <li key={i}>{err}</li>)}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-500 mb-8 max-w-sm text-center">All your products and their respective media have been successfully uploaded and categorized.</p>
                    )}
                    
                    <button onClick={onSuccess} className="mt-8 px-8 py-3 bg-slate-900 border border-transparent shadow-md text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
                        Go to Products List
                    </button>
                </div>
            )}

            {/* Hidden Input for generic media selection */}
            <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*,video/*" onChange={handleMediaSelect} />
        </div>
    );
}
