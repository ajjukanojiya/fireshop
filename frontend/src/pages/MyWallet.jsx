import React, { useEffect, useState } from "react";
import api from "../api/api";
import Header from "../components/Header";

export default function MyWallet() {
    const [balance, setBalance] = useState(0);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/wallet');
                setBalance(res.data.balance);
                setHistory(res.data.history.data);
            } catch (e) {
                console.error("Failed to load wallet", e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex justify-center items-center h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Wallet</h1>

                {/* Balance Card */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 text-white shadow-xl mb-8">
                    <p className="text-red-100 font-medium mb-2">Available Balance</p>
                    <h2 className="text-5xl font-bold">₹ {balance.toLocaleString()}</h2>
                    <p className="mt-4 text-sm text-red-200 opacity-80">
                        Use this balance for your next purchase automatically.
                    </p>
                </div>

                {/* Transaction History */}
                <h3 className="text-xl font-bold text-gray-800 mb-4">Transaction History</h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {history.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No transactions yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {history.map((tx) => (
                                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${tx.type === 'refund' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {tx.type === 'refund' ? '↩️' : '🛍️'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 capitalize">{tx.type} {tx.description ? `- ${tx.description}` : ''}</p>
                                            <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.amount > 0 ? '+' : ''} ₹ {Number(tx.amount).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
