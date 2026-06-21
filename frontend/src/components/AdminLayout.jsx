import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import api from '../api/api';

// Professional SVG Icons
const Icons = {
    Dashboard: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    Orders: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    Products: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
    Categories: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    Staff: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    Payments: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    Reports: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    Refunds: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>,
    More: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>,
    Logout: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
};

export default function AdminLayout() {
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const handleResetDatabase = async () => {
        if (!window.confirm("WARNING: This will wipe out all existing data and reset it to standard professional demo data! Only Admins can do this. Are you absolutely sure?")) {
            return;
        }
        setIsResetting(true);
        try {
            const res = await api.post('/admin/system/reset-demo-database');
            alert("Success: " + res.data.message);
            window.location.reload();
        } catch (error) {
            alert("Error resetting database: " + (error.response?.data?.message || error.message));
        } finally {
            setIsResetting(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-sm font-medium text-gray-500">Loading Workspace...</div>;
    if (!user) return null; // Wait for redirect

    if (user.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h1>
                    <p className="text-sm text-gray-500 mb-6">You need administrator privileges to view this workspace.</p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => navigate('/')} className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm">Return to Storefront</button>
                        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">Sign in as Administrator</button>
                    </div>
                </div>
            </div>
        );
    }

    const menuItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: 'Dashboard' },
        { label: 'Orders', path: '/admin/orders', icon: 'Orders' },
        { label: 'Products', path: '/admin/products', icon: 'Products' },
        { label: 'Categories', path: '/admin/categories', icon: 'Categories' },
        { label: 'Staff Directory', path: '/admin/delivery-boys', icon: 'Staff' },
        { label: 'Transactions', path: '/admin/online-payments', icon: 'Payments' },
        { label: 'Analytics', path: '/admin/reports', icon: 'Reports' },
        { label: 'Refunds', path: '/admin/refunds', icon: 'Refunds' },
    ];

    const mobileMenuItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: 'Dashboard' },
        { label: 'Orders', path: '/admin/orders', icon: 'Orders' },
        { label: 'Products', path: '/admin/products', icon: 'Products' },
        { label: 'More', path: '/admin/more', icon: 'More' },
    ];

    const pageTitle = location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard';

    return (
        <div className="flex min-h-screen bg-gray-50/50 font-sans">
            {/* Desktop Sidebar (Sleek SaaS Style) */}
            <aside className="hidden lg:flex w-64 bg-white flex-col sticky top-0 h-screen border-r border-gray-200 z-50">
                {/* Logo Area */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg leading-none mt-0.5">F</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                            FireShop
                        </h1>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Workspace</p>
                    {menuItems.map(item => {
                        const isActive = location.pathname.startsWith(item.path);
                        const Icon = Icons[item.icon];
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                                    isActive 
                                    ? 'bg-blue-50 text-blue-700' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <Icon />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom User Profile */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
                            {user.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                            <p className="text-[10px] text-gray-500 font-medium">Administrator</p>
                        </div>
                        <button 
                            onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} 
                            className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all p-1"
                            title="Sign Out"
                        >
                            <Icons.Logout />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Navigation & Content */}
            <div className="flex-1 flex flex-col min-h-screen pb-20 lg:pb-0">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-lg leading-none mt-0.5">F</span>
                        </div>
                        <h2 className="text-sm font-bold text-gray-900 capitalize">{pageTitle}</h2>
                    </div>
                    <button onClick={() => navigate('/')} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Icons.Logout />
                    </button>
                </header>

                {/* Desktop Top Bar */}
                <header className="hidden lg:flex bg-white/80 backdrop-blur-md sticky top-0 z-30 h-16 items-center justify-between px-8 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 font-medium">Workspace</span>
                        <span className="text-gray-300">/</span>
                        <h2 className="font-semibold text-gray-900 capitalize">{pageTitle}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleResetDatabase}
                            disabled={isResetting}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-white border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors shadow-sm"
                        >
                            {isResetting ? 'Resetting...' : 'Reset Demo'}
                        </button>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
                        >
                            <span>Storefront</span>
                            <span className="text-[10px]">↗</span>
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden">
                    <Outlet />
                </main>

                {/* Mobile Bottom Nav */}
                <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 pb-safe">
                    <div className="flex justify-around items-center h-16 px-2">
                        {mobileMenuItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            const Icon = Icons[item.icon];
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    <Icon />
                                    <span className="text-[10px] font-medium mt-1">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </div>
    );
}
