import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Header from '../../components/Header';
import { useToast } from '../../contexts/ToastContext';

export default function DeliveryDashboard() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    // Modal State - Moved up to fix hooks order
    const [showCollectModal, setShowCollectModal] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [collectedAmount, setCollectedAmount] = useState("");

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const res = await api.get('/delivery/my-deliveries');
            setDeliveries(res.data.data);
        } catch (e) {
            console.error(e);
            addToast("Failed to fetch deliveries", "error");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/delivery/update-status/${id}`, { status });
            addToast("Status updated!", "success");
            fetchDeliveries();
        } catch (e) {
            addToast("Failed to update status", "error");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
    );



    const handleDeliverClick = (delivery) => {
        setSelectedDelivery(delivery);
        setCollectedAmount(delivery.order?.total_amount || "");
        setShowCollectModal(true);
    };

    const confirmDelivery = async () => {
        if (!selectedDelivery) return;
        try {
            await api.patch(`/delivery/update-status/${selectedDelivery.id}`, {
                status: 'delivered',
                collected_amount: collectedAmount
            });
            addToast("Order Delivered Successfully!", "success");
            setShowCollectModal(false);
            fetchDeliveries();
        } catch (e) {
            addToast("Failed to update status", "error");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        Delivery Dashboard
                    </h1>
                    <a href="/" className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline">
                        Go to Shop &rarr;
                    </a>
                </div>

                {deliveries.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                        <p className="text-gray-500">No deliveries assigned to you yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {deliveries.map(d => (
                            <div key={d.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded uppercase">{d.status}</span>
                                            <span className="text-gray-400 text-sm">•</span>
                                            <span className="font-bold text-gray-900">Order #{d.order_id}</span>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                                            <p className="font-medium">{d.order?.user?.name || d.order?.user?.phone || 'Guest Customer'}</p>
                                            <p className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {d.order?.address}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                {d.order?.user?.phone || d.order?.guest_phone}
                                            </p>
                                            {d.order?.payment_method === 'cod' && (
                                                <p className="text-red-600 font-bold bg-red-50 inline-block px-2 py-0.5 rounded text-xs mt-1">Collect Cash: ₹ {d.order?.total_amount}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 justify-center min-w-[140px]">
                                        {d.status === 'assigned' && <button onClick={() => updateStatus(d.id, 'picked')} className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">Start Delivery</button>}
                                        {d.status === 'picked' && <button onClick={() => handleDeliverClick(d)} className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">Mark Delivered</button>}
                                        {d.status === 'failed' && <div className="text-center text-red-500 font-medium">Failed Delivery</div>}
                                        {d.status === 'delivered' && (
                                            <div className="space-y-1 text-center">
                                                <div className="text-center text-green-500 font-bold flex items-center justify-center gap-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Completed</div>
                                                {d.collected_amount && <div className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">Collected: ₹{d.collected_amount}</div>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Collection Modal */}
            {showCollectModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="font-bold text-xl mb-2 text-center">Confirm Delivery</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">Please enter the exact cash amount collected from the customer.</p>

                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-500 mb-1 block uppercase tracking-wider">Cash Collected (₹)</label>
                            <input
                                type="number"
                                className="w-full border-b-2 border-gray-200 p-2 text-3xl font-bold text-center focus:border-green-500 outline-none transition-colors"
                                value={collectedAmount}
                                onChange={(e) => setCollectedAmount(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowCollectModal(false)} className="flex-1 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                            <button onClick={confirmDelivery} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-[0.98]">Confirm & Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
