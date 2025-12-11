import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function AdminLayout() {
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;
    if (!user) return null; // Wait for redirect

    if (user.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-8">You do not have permission to view this page.</p>
                <div className="space-x-4">
                    <button onClick={() => navigate('/')} className="px-4 py-2 border rounded hover:bg-gray-100">Go Home</button>
                    <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout & Login as Admin</button>
                </div>
                <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200">
                    Debug: Current Role is '{user.role || 'none'}'
                </div>
            </div>
        );
    }

    const menuItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { label: 'Orders', path: '/admin/orders', icon: '📦' },
        { label: 'Products', path: '/admin/products', icon: '🏷️' },
        { label: 'Categories', path: '/admin/categories', icon: '📂' },
        { label: 'Delivery Staff', path: '/admin/delivery-boys', icon: '🚚' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold tracking-wider text-red-500">FIRESHOP <span className="text-white text-xs block font-normal tracking-normal opacity-50">ADMIN PANEL</span></h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map(item => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
                            {user.name?.[0] || 'A'}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8">
                    <h2 className="text-lg font-semibold text-gray-700 capitalize">
                        {location.pathname.split('/')[2] || 'Dashboard'}
                    </h2>
                    <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-red-600">
                        Exit to Store
                    </button>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
