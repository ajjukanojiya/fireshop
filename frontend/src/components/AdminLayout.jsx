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
        { label: 'Staff', path: '/admin/delivery-boys', icon: '🚚' },
        { label: 'Payments', path: '/admin/online-payments', icon: '💳' },
        { label: 'Reports', path: '/admin/reports', icon: '📈' },
        { label: 'Refunds', path: '/admin/refunds', icon: '↩️' },
    ];

    const mobileMenuItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { label: 'Orders', path: '/admin/orders', icon: '📦' },
        { label: 'Products', path: '/admin/products', icon: '🏷️' },
        { label: 'More', path: '/admin/categories', icon: '⋯' },
    ];

    const pageTitle = location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard';

    return (
        <div className="flex min-h-screen bg-[#fcfcfc] font-sans selection:bg-red-50">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-72 bg-[#050505] text-white flex-col sticky top-0 h-screen border-r border-white/5">
                <div className="p-8 border-b border-white/5">
                    <h1 className="text-2xl font-black bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent tracking-tighter uppercase italic">
                        FIRE<span className="text-[#991b1b]">SHOP</span>
                        <span className="text-white/20 text-[10px] block font-black tracking-[0.3em] mt-1 not-italic">ADMINISTRATOR</span>
                    </h1>
                </div>
                <nav className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar">
                    {menuItems.map(item => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#991b1b] text-white shadow-xl shadow-red-900/20 scale-[1.02]' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-bold text-sm uppercase tracking-widest">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-6 border-t border-white/5 bg-white/5 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#991b1b] to-red-600 flex items-center justify-center font-black text-white shadow-lg">
                            {user.name?.[0] || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate uppercase tracking-tight">{user.name}</p>
                            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">Master Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Navigation & Content */}
            <div className="flex-1 flex flex-col min-h-screen pb-20 lg:pb-0">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5 px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#991b1b] to-red-600 flex items-center justify-center font-black text-white text-xs shadow-lg">
                            {user.name?.[0] || 'A'}
                        </div>
                        <h2 className="text-sm font-black text-white uppercase tracking-widest italic">{pageTitle}</h2>
                    </div>
                    <button onClick={() => navigate('/')} className="p-2 text-white/40 hover:text-[#991b1b] transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" />
                        </svg>
                    </button>
                </header>

                {/* Desktop Top Bar (only breadcrumb/exit) */}
                <header className="hidden lg:flex bg-white/80 backdrop-blur-md sticky top-0 z-30 h-20 items-center justify-between px-12 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-[#991b1b]" />
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.5em]">{pageTitle}</h2>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-3 px-6 py-2.5 rounded-full border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 hover:border-[#991b1b] hover:text-[#991b1b] transition-all"
                    >
                        Storefront
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Mobile Bottom Nav */}
                <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#050505]/90 backdrop-blur-2xl border-t border-white/5 pb-safe">
                    <div className="flex justify-around items-center h-16">
                        {mobileMenuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? 'text-[#991b1b] scale-110 drop-shadow-[0_0_8px_rgba(153,27,27,0.5)]' : 'text-white/40'}`}
                                >
                                    <span className="text-xl mb-1">{item.icon}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </div>
    );
}
