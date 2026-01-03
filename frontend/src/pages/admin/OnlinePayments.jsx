import React, { useEffect, useState } from 'react';
import api from '../../api/api';

export default function OnlinePayments() {
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, transactions, analytics, reconciliation
    const [dashboard, setDashboard] = useState(null);
    const [transactions, setTransactions] = useState({ data: [], total: 0 });
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        from_date: '',
        to_date: '',
        payment_method: '',
        search: ''
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadData();
    }, [activeTab, currentPage, filters]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'dashboard') {
                const res = await api.get('/admin/online-payments/dashboard');
                setDashboard(res.data);
            } else if (activeTab === 'transactions') {
                const params = new URLSearchParams({
                    page: currentPage,
                    ...filters
                });
                const res = await api.get(`/admin/online-payments?${params}`);
                setTransactions(res.data);
            }
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const params = new URLSearchParams(filters);
            const res = await api.get(`/admin/online-payments/export?${params}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Export failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Online Payments (All Methods)</h2>
                <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                    📥 Export CSV
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    📊 Dashboard
                </button>
                <button
                    onClick={() => setActiveTab('transactions')}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'transactions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    💳 Transactions
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'analytics' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    📈 Analytics
                </button>
                <button
                    onClick={() => setActiveTab('reconciliation')}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'reconciliation' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    ✅ Reconciliation
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                ) : (
                    <>
                        {/* DASHBOARD TAB */}
                        {activeTab === 'dashboard' && dashboard && (
                            <div className="space-y-6">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                                        <p className="text-xs text-blue-600 font-semibold uppercase">Today's Revenue</p>
                                        <p className="text-2xl font-bold text-blue-900 mt-1">₹{Number(dashboard.today.revenue).toLocaleString()}</p>
                                        <p className="text-xs text-blue-700 mt-1">{dashboard.today.count} transactions</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                                        <p className="text-xs text-green-600 font-semibold uppercase">This Month</p>
                                        <p className="text-2xl font-bold text-green-900 mt-1">₹{Number(dashboard.month.revenue).toLocaleString()}</p>
                                        <p className="text-xs text-green-700 mt-1">{dashboard.month.count} transactions</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                                        <p className="text-xs text-orange-600 font-semibold uppercase">Unreconciled</p>
                                        <p className="text-2xl font-bold text-orange-900 mt-1">₹{Number(dashboard.unreconciled.amount).toLocaleString()}</p>
                                        <p className="text-xs text-orange-700 mt-1">{dashboard.unreconciled.count} pending</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
                                        <p className="text-xs text-red-600 font-semibold uppercase">Gateway Fees</p>
                                        <p className="text-2xl font-bold text-red-900 mt-1">₹{Number(dashboard.fees.total).toLocaleString()}</p>
                                        <p className="text-xs text-red-700 mt-1">Total fees paid</p>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-bold text-gray-800 mb-3">Payment Methods Breakdown</h3>
                                    <div className="space-y-2">
                                        {dashboard.payment_methods.map((method, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <span className="uppercase text-xs font-bold text-gray-600">{method.payment_method || 'Unknown'}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500"
                                                            style={{ width: `${(method.count / dashboard.payment_methods.reduce((a, b) => a + Number(b.count), 0)) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 w-16 text-right">{method.count} txns</span>
                                                    <span className="text-sm font-mono text-gray-700 w-24 text-right">₹{Number(method.total).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Failed Payments */}
                                {dashboard.recent_failed.length > 0 && (
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                        <h3 className="font-bold text-red-800 mb-3">⚠️ Recent Failed Payments</h3>
                                        <div className="space-y-2">
                                            {dashboard.recent_failed.map(txn => (
                                                <div key={txn.id} className="bg-white p-3 rounded text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="font-mono text-gray-600">{txn.payment_id}</span>
                                                        <span className="text-red-600 font-bold">₹{Number(txn.amount).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">{txn.error_description || 'Unknown error'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TRANSACTIONS TAB */}
                        {activeTab === 'transactions' && (
                            <div className="space-y-4">
                                {/* Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-gray-50 p-4 rounded-lg">
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                                    >
                                        <option value="">All Status</option>
                                        <option value="success">Success</option>
                                        <option value="failed">Failed</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                    <select
                                        value={filters.payment_method}
                                        onChange={(e) => setFilters({ ...filters, payment_method: e.target.value })}
                                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                                    >
                                        <option value="">All Methods</option>
                                        <option value="card">Card</option>
                                        <option value="upi">UPI</option>
                                        <option value="netbanking">Netbanking</option>
                                        <option value="wallet">Wallet</option>
                                    </select>
                                    <input
                                        type="date"
                                        value={filters.from_date}
                                        onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
                                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                                        placeholder="From Date"
                                    />
                                    <input
                                        type="date"
                                        value={filters.to_date}
                                        onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
                                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                                        placeholder="To Date"
                                    />
                                    <input
                                        type="text"
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                                        placeholder="Search payment ID..."
                                    />
                                </div>

                                {/* Transactions Table */}
                                {/* Desktop view */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                                            <tr>
                                                <th className="px-4 py-3">Payment ID</th>
                                                <th className="px-4 py-3">Order</th>
                                                <th className="px-4 py-3">Customer</th>
                                                <th className="px-4 py-3">Method</th>
                                                <th className="px-4 py-3 text-right">Amount</th>
                                                <th className="px-4 py-3 text-right">Fee</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {transactions.data.map(txn => (
                                                <tr key={txn.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-mono text-xs">{txn.payment_id.substring(0, 20)}...</td>
                                                    <td className="px-4 py-3">#{txn.order_id}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-gray-900 font-medium">{txn.user?.name || 'Guest'}</div>
                                                        <div className="text-xs text-gray-500">{txn.customer_email}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="uppercase text-xs font-bold text-gray-600">{txn.payment_method}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-mono font-bold">₹{Number(txn.amount).toLocaleString()}</td>
                                                    <td className="px-4 py-3 text-right font-mono text-red-600">₹{Number(txn.gateway_fee).toLocaleString()}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${txn.status === 'success' ? 'bg-green-100 text-green-700' :
                                                            txn.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {txn.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-500">
                                                        {new Date(txn.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                            {transactions.data.length === 0 && (
                                                <tr>
                                                    <td colSpan="8" className="text-center py-8 text-gray-400">
                                                        No transactions found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile view */}
                                <div className="md:hidden divide-y divide-gray-100">
                                    {transactions.data.map(txn => (
                                        <div key={txn.id} className="py-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {txn.payment_id.substring(0, 12)}...</p>
                                                    <p className="font-black text-slate-900">Order #{txn.order_id}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${txn.status === 'success' ? 'bg-green-100 text-green-700' :
                                                    txn.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {txn.status}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center text-sm font-bold">
                                                <div className="text-slate-700">{txn.user?.name || 'Guest'}</div>
                                                <div className="uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{txn.payment_method}</div>
                                            </div>

                                            <div className="flex justify-between items-end border-t border-slate-50 pt-2">
                                                <div className="text-[10px] text-slate-400">
                                                    Fee: ₹{Number(txn.gateway_fee).toLocaleString()}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Amount</p>
                                                    <p className="text-lg font-black text-slate-900">₹{Number(txn.amount).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {transactions.data.length === 0 && (
                                        <div className="text-center py-8 text-gray-400">No transactions found</div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {transactions.last_page > 1 && (
                                    <div className="flex justify-center gap-2 mt-4">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 border rounded disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-3 py-1">Page {currentPage} of {transactions.last_page}</span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(transactions.last_page, p + 1))}
                                            disabled={currentPage === transactions.last_page}
                                            className="px-3 py-1 border rounded disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ANALYTICS TAB */}
                        {activeTab === 'analytics' && (
                            <div className="text-center py-10 text-gray-500">
                                <p>Analytics charts coming soon...</p>
                                <p className="text-sm mt-2">Will show daily/weekly/monthly payment trends</p>
                            </div>
                        )}

                        {/* RECONCILIATION TAB */}
                        {activeTab === 'reconciliation' && (
                            <div className="text-center py-10 text-gray-500">
                                <p>Reconciliation tools coming soon...</p>
                                <p className="text-sm mt-2">Mark payments as reconciled with Razorpay settlements</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
