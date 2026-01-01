import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';
import Footer from './Footer';

export default function MainLayout() {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');
    const isDelivery = location.pathname.startsWith('/delivery');

    if (isAdmin || isDelivery) {
        return <Outlet />;
    }

    // Check if we should show mobile chrome (header/nav)
    // Usually we show it everywhere except maybe full-screen video pages

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex flex-col">
            {/* Desktop Header - Hidden on mobile */}
            <div className="hidden lg:block sticky top-0 z-[60]">
                <Header />
            </div>

            {/* Mobile Header - Specific to mobile view */}
            <MobileHeader />

            {/* Main Content Area */}
            {/* We add pt-16 for the mobile header and no padding for desktop since it handles its own sticky spacing */}
            <main className="flex-1 lg:pt-0 pt-16 pb-20 lg:pb-0 transition-all duration-300">
                <Outlet />
            </main>

            {/* Global Footer (Visible on all sizes) */}
            <div className="pb-24 lg:pb-0">
                <Footer />
            </div>

            {/* Mobile Bottom Nav */}
            <BottomNav />
        </div>
    );
}
