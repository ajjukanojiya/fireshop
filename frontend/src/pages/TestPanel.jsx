import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Header from '../components/Header';
import { useToast } from '../contexts/ToastContext';

export default function TestPanel() {
    const [orders, setOrders] = useState([]);
    const [refunds, setRefunds] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [myDeliveries, setMyDeliveries] = useState([]);
    const [users, setUsers] = useState([]); // For assigning delivery boys
    const { addToast } = useToast();

    // Refund Form State
    const [refundOrderId, setRefundOrderId] = useState('');
    const [refundReason, setRefundReason] = useState('');

    // Delivery Assign State
    const [assignOrderId, setAssignOrderId] = useState('');
    const [assignUserId, setAssignUserId] = useState('');

    // Delivery Update State
    const [updateDeliveryId, setUpdateDeliveryId] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState('picked');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // 1. Get Orders (Admin)
            try {
                const resOrders = await api.get('/admin/orders');
                setOrders(resOrders.data.data || resOrders.data);
            } catch (e) { console.log("Not admin or error fetching orders") }

            // 2. Get Refunds (Admin)
            try {
                const resRefunds = await api.get('/admin/refunds');
                setRefunds(resRefunds.data.data || []);
            } catch (e) { }

            // 3. Get My Deliveries (Delivery Boy)
            try {
                const resMy = await api.get('/delivery/my-deliveries');
                setMyDeliveries(resMy.data.data || []);
            } catch (e) { }

            // 4. Get Users (to find ID for delivery boy) - assuming no dedicated endpoint, we might have to just input ID manually or mock it if no users list endpoint exists.
            // For now we will just use manual input of User ID to keep it simple as we didn't make a users list API.

        } catch (e) {
            console.error(e);
            addToast('Error fetching initial data', 'error');
        }
    };

    // --- REFUND ACTIONS ---

    const requestRefund = async () => {
        try {
            await api.post('/refunds', { order_id: refundOrderId, reason: refundReason });
            addToast('Refund Requested!', 'success');
            fetchData();
        } catch (e) {
            addToast(e.response?.data?.message || 'Error', 'error');
        }
    };

    const approveRefund = async (id) => {
        try {
            await api.patch(`/admin/refunds/${id}`, { status: 'approved', admin_note: 'Auto approved by Test Panel' });
            addToast('Refund Approved!', 'success');
            fetchData();
        } catch (e) {
            addToast('Error approving refund', 'error');
        }
    };

    // --- DELIVERY ACTIONS ---

    const assignDelivery = async () => {
        try {
            await api.post('/admin/deliveries/assign', { order_id: assignOrderId, user_id: assignUserId });
            addToast('Order Assigned!', 'success');
            fetchData();
        } catch (e) {
            addToast(e.response?.data?.message || 'Error', 'error');
        }
    };

    const updateDeliveryStatus = async () => {
        try {
            await api.patch(`/delivery/update-status/${updateDeliveryId}`, { status: deliveryStatus });
            addToast('Status Updated!', 'success');
            fetchData();
        } catch (e) {
            addToast(e.response?.data?.message || 'Error', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
                    Feature Test Panel
                </h1>

                <p className="mb-6 bg-yellow-50 text-yellow-800 p-4 rounded border border-yellow-200">
                    <b>Note:</b> Login as the appropriate user role (User, Admin, or Delivery Boy) to test specific sections properly.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* --- REFUND MODULE --- */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold border-b pb-2">1. Refund Module</h2>

                        {/* User: Request Refund */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-4 text-blue-600">User: Request Refund</h3>
                            <div className="flex gap-2 mb-2">
                                <input className="border p-2 rounded flex-1" placeholder="Order ID" value={refundOrderId} onChange={e => setRefundOrderId(e.target.value)} />
                                <input className="border p-2 rounded flex-1" placeholder="Reason" value={refundReason} onChange={e => setRefundReason(e.target.value)} />
                            </div>
                            <button onClick={requestRefund} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Submit Request</button>
                        </div>

                        {/* Admin: Approve Refunds */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-4 text-purple-600">Admin: Pending Refunds</h3>
                            {refunds.length === 0 ? <p className="text-gray-400">No refunds found</p> : (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {refunds.map(r => (
                                        <div key={r.id} className="border p-3 rounded flex justify-between items-center bg-gray-50">
                                            <div>
                                                <div className="font-bold">Order #{r.order_id}</div>
                                                <div className="text-sm text-gray-500">{r.reason}</div>
                                                <span className={`text-xs px-2 py-0.5 rounded ${r.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span>
                                            </div>
                                            {r.status === 'pending' && (
                                                <button onClick={() => approveRefund(r.id)} className="bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700">Approve</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* --- DELIVERY MODULE --- */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold border-b pb-2">2. Delivery Module</h2>

                        {/* Admin: Assign Delivery */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-4 text-purple-600">Admin: Assign Order</h3>
                            <div className="flex gap-2 mb-2">
                                <input className="border p-2 rounded flex-1" placeholder="Order ID" value={assignOrderId} onChange={e => setAssignOrderId(e.target.value)} />
                                <input className="border p-2 rounded flex-1" placeholder="User ID (Delivery Boy)" value={assignUserId} onChange={e => setAssignUserId(e.target.value)} />
                            </div>
                            <button onClick={assignDelivery} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full">Assign Order</button>
                        </div>

                        {/* Delivery Boy: My Jobs */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-4 text-orange-600">Delivery Boy: My Jobs</h3>
                            {myDeliveries.length === 0 ? <p className="text-gray-400">No deliveries assigned</p> : (
                                <div className="space-y-4 max-h-60 overflow-y-auto">
                                    {myDeliveries.map(d => (
                                        <div key={d.id} className="border p-3 rounded bg-orange-50">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold">Delivery #{d.id} (Order #{d.order_id})</span>
                                                <span className="text-sm font-medium uppercase">{d.status}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <select className="border p-1 rounded text-sm w-full" onChange={(e) => { setUpdateDeliveryId(d.id); setDeliveryStatus(e.target.value) }}>
                                                    <option value="">Select Action...</option>
                                                    <option value="picked">Picked Up</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="failed">Failed</option>
                                                </select>
                                                <button onClick={updateDeliveryStatus} className="bg-orange-600 text-white px-3 py-1 rounded text-sm">Update</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </section>

                </div>
            </div>
        </div>
    );
}
