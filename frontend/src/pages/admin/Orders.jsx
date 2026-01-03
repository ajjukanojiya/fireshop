import React, { useEffect, useState } from 'react';
import api from '../../api/api';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    const loadOrders = async (status = '') => {
        setLoading(true);
        try {
            const url = status ? `/admin/orders?status=${status}` : '/admin/orders';
            const res = await api.get(url);
            setOrders(res.data.data); // paginate 'data'
        } catch (error) {
            console.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders(filter);
    }, [filter]);

    const updateStatus = async (id, newStatus) => {
        if (!window.confirm(`Mark order #${id} as ${newStatus}?`)) return;
        try {
            await api.patch(`/admin/orders/${id}/status`, { status: newStatus });
            // Refresh list
            loadOrders(filter);
        } catch (e) {
            alert("Failed to update status");
        }
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState(null);
    const [deliveryBoyId, setDeliveryBoyId] = useState("");
    const [deliveryBoys, setDeliveryBoys] = useState([]);

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    const loadDeliveryBoys = async () => {
        try {
            const res = await api.get('/admin/users?role=delivery_boy');
            setDeliveryBoys(res.data.data);
        } catch (e) {
            console.error("Failed to load delivery boys", e);
        }
    };

    const openAssignModal = (orderId) => {
        setSelectedOrderForDelivery(orderId);
        setDeliveryBoyId(""); // Reset
        setShowAssignModal(true);
        if (deliveryBoys.length === 0) {
            loadDeliveryBoys();
        }
    };

    const handleAssignDelivery = async () => {
        if (!deliveryBoyId) return alert("Please select a Delivery Boy");
        try {
            await api.post('/admin/deliveries/assign', {
                order_id: selectedOrderForDelivery,
                user_id: deliveryBoyId
            });
            alert("Order assigned successfully!");
            setShowAssignModal(false);
            loadOrders(filter);
        } catch (e) {
            alert(e?.response?.data?.message || "Failed to assign");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Orders Management</h2>
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-gray-50 text-sm"
                >
                    <option value="">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                </select>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Delivery</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-8">Loading orders...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8">No orders found.</td></tr>
                        ) : orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono font-medium text-gray-900">#{order.id}</td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-900">{order.user?.name || 'Guest'}</p>
                                    <p className="text-xs text-slate-500 font-bold">{order.user?.phone || order.guest_phone || 'No Phone'}</p>
                                    <p className="text-[10px] text-gray-400">{order.user?.email}</p>
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    <div className="flex flex-col">
                                        <span>₹ {order.total_amount.toLocaleString()}</span>
                                        {(order.delivery?.collected_amount !== undefined && order.delivery?.collected_amount !== null) || order.payment_method?.toLowerCase() === 'cod' ? (
                                            <div className="mt-1 flex flex-col gap-1 text-[10px]">
                                                {order.delivery?.collected_amount !== undefined && order.delivery?.collected_amount !== null ? (
                                                    Number(order.delivery.collected_amount) < Number(order.total_amount) ? (
                                                        <>
                                                            <span className="font-bold text-red-600 bg-red-50 border border-red-200 px-1 rounded w-fit">
                                                                Pending: ₹{(Number(order.total_amount) - Number(order.delivery.collected_amount)).toLocaleString()}
                                                            </span>
                                                            <span className="text-gray-500">Collected: ₹{Number(order.delivery.collected_amount).toLocaleString()}</span>
                                                        </>
                                                    ) : (
                                                        <span className="font-bold text-green-700 bg-green-50 border border-green-200 px-1 rounded w-fit">
                                                            Paid Full: ₹{Number(order.delivery.collected_amount).toLocaleString()}
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="text-gray-400 italic">COD Pending</span>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${statusColors[order.status] || 'bg-gray-100'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedOrderItems(order.items || []);
                                                setSelectedOrderDetails(order);
                                                setShowDetailsModal(true);
                                            }}
                                            className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded hover:bg-blue-100 transition-colors text-center"
                                        >
                                            View Details
                                        </button>
                                        <div className="flex flex-col">
                                            {order.delivery && order.delivery.delivery_boy ? (
                                                <div className="flex flex-col items-start gap-1">
                                                    <div className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100">
                                                        <span>✓ {order.delivery.delivery_boy.name}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => openAssignModal(order.id)}
                                                        className="text-[10px] text-gray-400 hover:text-blue-600 underline"
                                                    >
                                                        Re-assign
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => openAssignModal(order.id)}
                                                    className="text-xs bg-purple-50 text-purple-600 border border-purple-200 px-2 py-1 rounded hover:bg-purple-100"
                                                >
                                                    Assign
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <select
                                        className="text-xs border rounded px-2 py-1 bg-white hover:border-gray-400 cursor-pointer"
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4 bg-slate-50">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Loading Orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                        <span className="text-4xl mb-4 block">📦</span>
                        <p className="text-slate-500 font-bold tracking-tight">No orders found.</p>
                    </div>
                ) : orders.map(order => (
                    <div key={order.id} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 space-y-5 relative overflow-hidden">

                        {/* Status Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusColors[order.status]?.split(' ')[0] || 'bg-slate-200'}`} />

                        {/* Order ID & Status */}
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Priority Order</span>
                                <h3 className="font-black text-xl text-slate-900 leading-none">#{order.id}</h3>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${statusColors[order.status] || 'bg-slate-100 text-slate-400'}`}>
                                {order.status}
                            </span>
                        </div>

                        {/* Customer Info Box */}
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">👤</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-slate-800 truncate">{order.user?.name || 'Guest Customer'}</p>
                                <a
                                    href={`tel:${order.user?.phone || order.guest_phone}`}
                                    className="flex items-center gap-1 text-blue-600 font-black text-xs mt-0.5"
                                >
                                    <span className="text-xs">📞</span>
                                    {order.user?.phone || order.guest_phone || 'No Number'}
                                </a>
                                <p className="text-[9px] font-bold text-slate-400 truncate tracking-tight">{order.user?.email || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Financials & Payment */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block text-center">Amount</span>
                                <p className="text-lg font-black text-slate-900 text-center leading-none">₹{order.total_amount.toLocaleString()}</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Payment</span>
                                {(order.delivery?.collected_amount !== undefined && order.delivery?.collected_amount !== null) ? (
                                    <span className={`text-[10px] font-bold uppercase bg-green-50 text-green-600 px-2 py-0.5 rounded border border-green-100`}>
                                        PAID: ₹{order.delivery.collected_amount.toLocaleString()}
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-black text-orange-600 uppercase italic">COD / PENDING</span>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions Row */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setSelectedOrderItems(order.items || []);
                                    setSelectedOrderDetails(order);
                                    setShowDetailsModal(true);
                                }}
                                className="flex-1 py-4 bg-[#0f172a] text-white rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-100 hover:bg-slate-800 transition-all active:scale-95"
                            >
                                Details
                            </button>
                            {order.delivery && order.delivery.delivery_boy ? (
                                <button
                                    onClick={() => openAssignModal(order.id)}
                                    className="px-6 py-4 bg-green-50 text-green-700 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest border border-green-100 flex items-center gap-2"
                                >
                                    <span className="text-lg">🚚</span>
                                    <span>{order.delivery.delivery_boy.name.split(' ')[0]}</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => openAssignModal(order.id)}
                                    className="flex-1 py-4 bg-red-600 text-white rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-100 active:scale-95"
                                >
                                    Assign Boy
                                </button>
                            )}
                        </div>

                        {/* Inline Status Selection */}
                        <div className="pt-2 border-t border-slate-50">
                            <div className="flex flex-wrap gap-2">
                                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => updateStatus(order.id, s)}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${order.status === s ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Details Modal */}
            {showDetailsModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl animate-fade-in border border-gray-100">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-black text-2xl text-slate-900 tracking-tighter">Order #{selectedOrderDetails?.id} Items</h3>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Customer: <span className="text-slate-900">{selectedOrderDetails?.user?.name || 'Guest'}</span>
                                    </p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Phone: <span className="text-blue-600 underline">{selectedOrderDetails?.user?.phone || selectedOrderDetails?.guest_phone || 'N/A'}</span>
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">

                            {/* Legal Compliance Log */}
                            {selectedOrderDetails?.compliance_log && (
                                <div className="mb-6 p-4 bg-yellow-50/80 border border-yellow-100 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-base">📜</span>
                                        <span className="text-[10px] font-black text-yellow-700 uppercase tracking-widest">Legal Compliance Log</span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-700 font-mono bg-white p-3 rounded-xl border border-yellow-100 shadow-sm">
                                        Order #{selectedOrderDetails.id}: {selectedOrderDetails.compliance_log}
                                    </p>
                                </div>
                            )}

                            {selectedOrderItems.map((item, idx) => (
                                <div key={item.id || idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 overflow-hidden flex-shrink-0">
                                        <img src={item.product?.thumbnail_url} alt={item.product?.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-slate-800 leading-tight">{item.product?.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase bg-white px-2 py-0.5 rounded border border-slate-200">
                                                {item.product?.inner_unit || 'Packet'}
                                            </span>
                                            <span className="text-xs font-bold text-slate-500">₹{Number(item.unit_price || item.price || 0).toLocaleString()} / {item.product?.inner_unit || 'Packet'}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Quantity</div>
                                        <div className="text-xl font-black text-slate-900">{item.quantity}</div>
                                    </div>
                                    <div className="text-right min-w-[80px]">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</div>
                                        <div className="text-lg font-black text-red-600">₹{(Number(item.quantity) * Number(item.unit_price || item.price || 0)).toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                                <span className="text-3xl font-black text-slate-900">₹{Number(selectedOrderDetails?.total_amount || 0).toLocaleString()}</span>
                            </div>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assignment Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl animate-fade-in">
                        <h3 className="font-bold text-lg mb-4">Assign Delivery Boy</h3>
                        <p className="text-xs text-gray-500 mb-2">Select a delivery person from the list.</p>

                        <select
                            className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                            value={deliveryBoyId}
                            onChange={(e) => setDeliveryBoyId(e.target.value)}
                        >
                            <option value="">-- Select Delivery Boy --</option>
                            {deliveryBoys.map(boy => (
                                <option key={boy.id} value={boy.id}>
                                    {boy.name} ({boy.phone})
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowAssignModal(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                            <button onClick={handleAssignDelivery} className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700">Assign</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
