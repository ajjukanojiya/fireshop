import React, { useEffect, useState } from 'react';
import api from '../../api/api';

export default function AdminRefunds() {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRefund, setSelectedRefund] = useState(null);

    const loadRefunds = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/refunds');
            setRefunds(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRefunds();
    }, []);

    const handleUpdateStatus = async (id, status, note = '') => {
        if (!window.confirm(`Mark this refund as ${status}?`)) return;
        try {
            await api.patch(`/admin/refunds/${id}`, { status, admin_note: note });
            loadRefunds();
            setSelectedRefund(null);
        } catch (error) {
            alert("Failed to update status");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Refund Requests</h2>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Order</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Reason</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-8">Loading...</td></tr>
                        ) : refunds.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-8">No refund requests found.</td></tr>
                        ) : refunds.map(refund => (
                            <tr key={refund.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">#{refund.id}</td>
                                <td className="px-6 py-4 underline text-blue-600">#{refund.order_id}</td>
                                <td className="px-6 py-4">
                                    <p className="font-bold">{refund.order?.user?.name}</p>
                                    <p className="text-xs">{refund.order?.user?.phone}</p>
                                </td>
                                <td className="px-6 py-4 font-bold">₹{refund.amount}</td>
                                <td className="px-6 py-4 max-w-xs truncate" title={refund.reason}>{refund.reason}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${refund.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        refund.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {refund.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => setSelectedRefund(refund)} className="text-blue-600 hover:underline">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-gray-100 px-4">
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : refunds.length === 0 ? (
                    <div className="text-center py-8">No refund requests found.</div>
                ) : refunds.map(refund => (
                    <div key={refund.id} className="py-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="font-mono font-black text-slate-900 text-xs">REFUND #{refund.id}</p>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Order #{refund.order_id}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${refund.status === 'approved' ? 'bg-green-100 text-green-700' :
                                refund.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                {refund.status}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-black text-slate-900 text-sm">{refund.order?.user?.name || 'Customer'}</p>
                                <p className="text-xs text-slate-400">{refund.order?.user?.phone}</p>
                            </div>
                            <p className="text-lg font-black text-red-600">₹{refund.amount}</p>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 italic text-xs text-slate-500">
                            "{refund.reason}"
                        </div>

                        <button
                            onClick={() => setSelectedRefund(refund)}
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200"
                        >
                            Review Request
                        </button>
                    </div>
                ))}
            </div>

            {/* View/Action Modal */}
            {selectedRefund && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl animate-fade-in relative">
                        <button onClick={() => setSelectedRefund(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>

                        <h3 className="font-bold text-lg mb-4">Refund Details #{selectedRefund.id}</h3>

                        <div className="space-y-4 text-sm">
                            <div className="bg-gray-50 p-4 rounded border">
                                <p className="text-gray-500">Reason provided:</p>
                                <p className="font-medium text-gray-800 mt-1">{selectedRefund.reason}</p>
                            </div>

                            {/* Images */}
                            {selectedRefund.images && selectedRefund.images.length > 0 && (
                                <div>
                                    <p className="text-gray-500 mb-2">Proof Images:</p>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {selectedRefund.images.map((img, i) => (
                                            <a key={i} href={img} target="_blank" rel="noreferrer">
                                                <img src={img} className="w-20 h-20 object-cover rounded border hover:opacity-80" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedRefund.status === 'pending' && (
                                <div className="pt-4 border-t flex justify-end gap-3">
                                    <button
                                        onClick={() => handleUpdateStatus(selectedRefund.id, 'rejected')}
                                        className="px-4 py-2 border border-red-200 text-red-600 rounded hover:bg-red-50"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedRefund.id, 'approved')}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Approve Refund
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
