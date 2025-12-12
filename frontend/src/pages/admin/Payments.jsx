import React, { useEffect, useState } from 'react';
import api from '../../api/api';

export default function AdminPayments() {
    const [activeTab, setActiveTab] = useState('wallet'); // wallet, transactions, settlements
    const [walletData, setWalletData] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(false);

    // Settlement Modal
    const [showSettleModal, setShowSettleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [settleAmount, setSettleAmount] = useState('');
    const [settleNotes, setSettleNotes] = useState('');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'wallet') {
                const res = await api.get('/admin/payments/wallet');
                setWalletData(res.data.data);
            } else if (activeTab === 'transactions') {
                const res = await api.get('/admin/payments/transactions');
                setTransactions(res.data.data);
            } else if (activeTab === 'settlements') {
                const res = await api.get('/admin/payments/settlements');
                setSettlements(res.data.data);
            }
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const openSettleModal = (user) => {
        setSelectedUser(user);
        setSettleAmount(user.cash_in_hand > 0 ? user.cash_in_hand : '');
        setSettleNotes('');
        setShowSettleModal(true);
    };

    const handleSettle = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/payments/settle', {
                user_id: selectedUser.user_id,
                amount: settleAmount,
                notes: settleNotes
            });
            alert("Settlement recorded successfully!");
            setShowSettleModal(false);
            loadData(); // Refresh
        } catch (error) {
            alert("Failed to record settlement");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Payments & Finance</h2>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('wallet')}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'wallet' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Delivery Wallets
                </button>
                <button
                    onClick={() => setActiveTab('transactions')}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'transactions' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    COD Collections
                </button>
                <button
                    onClick={() => setActiveTab('settlements')}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'settlements' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Settlement History
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 min-h-[400px]">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                ) : (
                    <>
                        {/* WALLET VIEW */}
                        {activeTab === 'wallet' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3">Delivery Boy</th>
                                            <th className="px-4 py-3 text-right">Total Collected</th>
                                            <th className="px-4 py-3 text-right">Total Settled</th>
                                            <th className="px-4 py-3 text-right">Cash In Hand</th>
                                            <th className="px-4 py-3 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {walletData.map(item => (
                                            <tr key={item.user_id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-900">
                                                    {item.name}
                                                    <div className="text-xs text-gray-400">{item.phone}</div>
                                                </td>
                                                <td className="px-4 py-3 text-right text-green-600 font-mono">₹{parseFloat(item.total_collected).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right text-gray-500 font-mono">₹{parseFloat(item.total_settled).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-900 font-mono text-lg">
                                                    ₹{parseFloat(item.cash_in_hand).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => openSettleModal(item)}
                                                        className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 shadow-sm"
                                                    >
                                                        Collect Cash
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {walletData.length === 0 && <tr><td colSpan="5" className="text-center py-8">No delivery boys found.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* TRANSACTION VIEW */}
                        {activeTab === 'transactions' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3">Order #</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Delivery Boy</th>
                                            <th className="px-4 py-3 text-right">Collected Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {transactions.map(t => (
                                            <tr key={t.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-mono">#{t.order_id}</td>
                                                <td className="px-4 py-3">{new Date(t.created_at).toLocaleDateString()}</td>
                                                <td className="px-4 py-3">{t.delivery_boy?.name || 'Unknown'}</td>
                                                <td className="px-4 py-3 text-right font-bold text-green-600">₹{parseFloat(t.collected_amount).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        {transactions.length === 0 && <tr><td colSpan="4" className="text-center py-8">No collections yet.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* SETTLEMENTS VIEW */}
                        {activeTab === 'settlements' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Delivery Boy</th>
                                            <th className="px-4 py-3">Notes</th>
                                            <th className="px-4 py-3 text-right">Amount Received</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {settlements.map(s => (
                                            <tr key={s.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">{new Date(s.created_at).toLocaleDateString()} {new Date(s.created_at).toLocaleTimeString()}</td>
                                                <td className="px-4 py-3">{s.user?.name || 'Unknown'}</td>
                                                <td className="px-4 py-3 text-gray-500 italic">{s.notes || '-'}</td>
                                                <td className="px-4 py-3 text-right font-bold text-blue-600">₹{parseFloat(s.amount).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        {settlements.length === 0 && <tr><td colSpan="4" className="text-center py-8">No settlements history.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* SETTLEMENT MODAL */}
            {showSettleModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <form onSubmit={handleSettle} className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative">
                        <button
                            type="button"
                            onClick={() => setShowSettleModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Collect Cash</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Receive cash from <span className="font-semibold text-gray-800">{selectedUser.name}</span>.
                            <br />
                            Current Cash in Hand: <span className="font-mono font-bold">₹{parseFloat(selectedUser.cash_in_hand).toLocaleString()}</span>
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    step="0.01"
                                    className="w-full border p-2 rounded-lg font-mono text-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    value={settleAmount}
                                    onChange={e => setSettleAmount(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Notes (Optional)</label>
                                <textarea
                                    className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                    rows="2"
                                    placeholder="e.g. Handed over at office"
                                    value={settleNotes}
                                    onChange={e => setSettleNotes(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowSettleModal(false)}
                                className="flex-1 py-2 text-gray-600 bg-gray-100 font-medium rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-2 text-white bg-purple-600 font-bold rounded-lg hover:bg-purple-700 shadow-lg shadow-purple-200"
                            >
                                Confirm Collection
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
