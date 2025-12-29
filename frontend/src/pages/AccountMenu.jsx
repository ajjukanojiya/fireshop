import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function AccountMenu() {
    const { user } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    if (!user) {
        // Guest user - Show Sign In / Register options
        return (
            <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#991b1b] to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome!</h1>
                        <p className="text-slate-500">Sign in to access your account</p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            to="/login"
                            className="block w-full bg-[#991b1b] hover:bg-[#7f1d1d] text-white py-4 rounded-2xl font-bold text-center transition-all shadow-xl shadow-red-900/20 active:scale-95"
                        >
                            Sign In
                        </Link>

                        <Link
                            to="/signup"
                            className="block w-full bg-white border-2 border-slate-200 hover:border-[#991b1b] text-slate-900 py-4 rounded-2xl font-bold text-center transition-all active:scale-95"
                        >
                            Create Account
                        </Link>

                        <button
                            onClick={() => navigate('/')}
                            className="block w-full text-slate-500 hover:text-slate-700 py-3 text-sm font-medium transition-colors"
                        >
                            Continue as Guest
                        </button>
                    </div>

                    <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🎁</span>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm mb-1">Member Benefits</h3>
                                <ul className="text-xs text-slate-600 space-y-1">
                                    <li>• Track your orders</li>
                                    <li>• Save addresses</li>
                                    <li>• Wallet & refunds</li>
                                    <li>• Exclusive offers</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Logged in user - Show account menu
    const menuItems = [
        { label: 'My Orders', path: '/my-orders', icon: '📦', color: 'from-blue-500 to-blue-600' },
        { label: 'My Wallet', path: '/my-wallet', icon: '💰', color: 'from-green-500 to-green-600' },
        { label: 'My Addresses', path: '/my-addresses', icon: '📍', color: 'from-purple-500 to-purple-600' },
    ];

    if (user.role === 'admin') {
        menuItems.push({ label: 'Admin Panel', path: '/admin/dashboard', icon: '🛡️', color: 'from-red-500 to-red-600' });
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] p-4 pb-24">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* User Profile Card */}
                <div className="bg-gradient-to-br from-[#991b1b] to-red-600 rounded-3xl p-8 text-white shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center font-black text-2xl border-2 border-white/30">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-black mb-1">{user.name || 'User'}</h2>
                            <p className="text-white/60 text-sm">{user.phone || user.email || 'Member'}</p>
                        </div>
                    </div>
                    {user.role && (
                        <div className="inline-block bg-white/20 backdrop-blur-xl px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/30">
                            {user.role}
                        </div>
                    )}
                </div>

                {/* Menu Items */}
                <div className="grid grid-cols-2 gap-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="group relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 transition-all hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                            <div className="relative z-10 flex flex-col items-center text-center gap-3">
                                <div className="text-4xl">{item.icon}</div>
                                <div className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                                    {item.label}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 py-4 rounded-2xl font-bold transition-all active:scale-95"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}
