import React, { useEffect, useState } from 'react';
import api from '../api/api';
import Header from '../components/Header';
import { useToast } from '../contexts/ToastContext';

export default function MyAddresses() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        label: 'Home',
        name: '',
        phone: '',
        street: '',
        city: '',
        zip: '',
        is_default: false,
    });

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const res = await api.get('/addresses');
            setAddresses(res.data.data || []);
        } catch (error) {
            addToast('Failed to load addresses', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAddress) {
                await api.put(`/addresses/${editingAddress.id}`, formData);
                addToast('Address updated successfully', 'success');
            } else {
                await api.post('/addresses', formData);
                addToast('Address saved successfully', 'success');
            }
            setShowModal(false);
            setEditingAddress(null);
            resetForm();
            loadAddresses();
        } catch (error) {
            addToast(error?.response?.data?.message || 'Failed to save address', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            await api.delete(`/addresses/${id}`);
            addToast('Address deleted', 'success');
            loadAddresses();
        } catch (error) {
            addToast('Failed to delete address', 'error');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await api.post(`/addresses/${id}/set-default`);
            addToast('Default address updated', 'success');
            loadAddresses();
        } catch (error) {
            addToast('Failed to update default', 'error');
        }
    };

    const openEditModal = (address) => {
        setEditingAddress(address);
        setFormData({
            label: address.label,
            name: address.name,
            phone: address.phone,
            street: address.street,
            city: address.city,
            zip: address.zip,
            is_default: address.is_default,
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            label: 'Home',
            name: '',
            phone: '',
            street: '',
            city: '',
            zip: '',
            is_default: false,
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
                    <button
                        onClick={() => { resetForm(); setEditingAddress(null); setShowModal(true); }}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                        + Add New Address
                    </button>
                </div>

                {addresses.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center">
                        <p className="text-gray-500 mb-4">No saved addresses yet</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-red-600 font-medium hover:underline"
                        >
                            Add your first address
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`bg-white rounded-xl p-6 border-2 transition-all ${address.is_default ? 'border-red-500 shadow-lg' : 'border-gray-100'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                            {address.label}
                                        </span>
                                        {address.is_default && (
                                            <span className="ml-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                                                DEFAULT
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(address)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(address.id)}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="text-gray-700 space-y-1">
                                    <p className="font-semibold">{address.name}</p>
                                    <p className="text-sm">{address.street}</p>
                                    <p className="text-sm">{address.city}, {address.zip}</p>
                                    <p className="text-sm">Phone: {address.phone}</p>
                                </div>
                                {!address.is_default && (
                                    <button
                                        onClick={() => handleSetDefault(address.id)}
                                        className="mt-4 text-red-600 text-sm font-medium hover:underline"
                                    >
                                        Set as Default
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                                <select
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                >
                                    <option value="Home">Home</option>
                                    <option value="Office">Office</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.street}
                                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.zip}
                                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.is_default}
                                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                                <label className="ml-2 text-sm text-gray-700">Set as default address</label>
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditingAddress(null); }}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
                                >
                                    {editingAddress ? 'Update' : 'Save'} Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
