import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';

export default function MainLayout() {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');
    const isDelivery = location.pathname.startsWith('/delivery');

    if (isAdmin || isDelivery) {
        return <Outlet />;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Desktop Header */}
            <div className="hidden lg:block">
                <Header />
            </div>

            {/* Mobile Header */}
            <MobileHeader />

            {/* Main Content */}
            <main className="pt-16 pb-20 lg:pt-0 lg:pb-0">
                <Outlet />
            </main>

            {/* Mobile Bottom Nav */}
            <BottomNav />
        </div>
    );
}
