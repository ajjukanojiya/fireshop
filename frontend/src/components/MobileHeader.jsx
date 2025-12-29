import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';

export default function MobileHeader() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { items } = useCart();
    const { user } = useUser();
    const itemsCount = items ? items.reduce((s, it) => s + (it.quantity || 1), 0) : 0;

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/?search=${encodeURIComponent(search.trim())}`);
        } else {
            navigate('/');
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5 lg:hidden">
            <div className="px-4 h-16 flex items-center gap-2">
                {/* Logo */}
                <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                    <span className="text-xl font-black bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent tracking-tighter uppercase italic">
                        FIRE<span className="text-[#991b1b]">SHOP</span>
                    </span>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1 relative mx-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 pl-3 pr-10 text-sm font-medium text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#991b1b]/30 focus:border-[#991b1b]/50 transition-all"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </form>

                <div className="flex items-center gap-1">
                    {/* User Icon */}
                    <Link to="/account" className="p-2 text-white/60 hover:text-[#991b1b] transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </Link>

                    {/* Cart Icon */}
                    <Link to="/cart" className="relative p-2 text-white/60 hover:text-[#991b1b] transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        {itemsCount > 0 && (
                            <span className="absolute -top-0 -right-0 bg-[#991b1b] text-white text-[10px] font-black h-4 w-4 flex items-center justify-center rounded-full border border-black shadow-[0_0_10px_rgba(153,27,27,0.5)]">
                                {itemsCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
