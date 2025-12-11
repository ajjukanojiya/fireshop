import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useToast } from '../../contexts/ToastContext';

export default function AdminDeliveryBoys() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    // Form State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [createLoading, setCreateLoading] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users?role=delivery_boy');
            setUsers(res.data.data);
        } catch (e) {
            console.error(e);
            addToast("Failed to load delivery boys", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        try {
            await api.post('/admin/users', {
                name,
                phone,
                role: 'delivery_boy'
            });
            addToast("Delivery Boy created successfully!", "success");
            setName('');
            setPhone('');
            loadUsers();
        } catch (e) {
            addToast(e?.response?.data?.message || "Failed to create user", "error");
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Manage Delivery Staff</h2>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Create Form */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4">Add New Staff</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                            <input
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={name} onChange={e => setName(e.target.value)}
                                placeholder="e.g. Rahul Sharma"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                            <input
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={phone} onChange={e => setPhone(e.target.value)}
                                placeholder="+91 9876543210"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={createLoading}
                            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {createLoading ? 'Creating...' : 'Create Account'}
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-4">
                        * The user can login using this phone number via OTP directly.
                    </p>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <h3 className="font-bold text-gray-900 mb-4">Current Staff ({users.length})</h3>
                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-xl">No delivery staff found.</div>
                    ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {users.map(user => (
                                <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg hover:border-blue-200 transition-colors bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                            {user.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{user.name || 'Unnamed'}</div>
                                            <div className="text-xs text-gray-500 font-mono">{user.phone}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">ID: {user.id}</div>
                                        {/* Future: Add Delete/Edit buttons */}
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
