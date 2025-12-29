import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminMore() {
    const menuItems = [
        { label: 'Categories', path: '/admin/categories', icon: '📂', color: 'from-purple-500 to-purple-600' },
        { label: 'Delivery Staff', path: '/admin/delivery-boys', icon: '🚚', color: 'from-blue-500 to-blue-600' },
        { label: 'COD Payments', path: '/admin/payments', icon: '💰', color: 'from-green-500 to-green-600' },
        { label: 'Online Payments', path: '/admin/online-payments', icon: '💳', color: 'from-indigo-500 to-indigo-600' },
        { label: 'Reports', path: '/admin/reports', icon: '📈', color: 'from-orange-500 to-orange-600' },
        { label: 'Refunds', path: '/admin/refunds', icon: '↩️', color: 'from-red-500 to-red-600' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">More Options</h1>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Admin Tools</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

            <div className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                <div className="flex items-start gap-4">
                    <div className="text-3xl">💡</div>
                    <div>
                        <h3 className="font-bold text-slate-900 mb-1">Quick Tip</h3>
                        <p className="text-sm text-slate-600">
                            Use the bottom navigation to quickly switch between Dashboard, Orders, and Products.
                            Access all other admin features from this page.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
