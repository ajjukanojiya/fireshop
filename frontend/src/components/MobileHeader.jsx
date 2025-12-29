import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MobileHeader() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/?search=${encodeURIComponent(search.trim())}`);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 lg:hidden">
            <div className="px-4 h-16 flex items-center gap-4">
                <div className="flex-shrink-0" onClick={() => navigate('/')}>
                    <span className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">
                        FIRE<span className="text-[#991b1b]">SHOP</span>
                    </span>
                </div>

                <form onSubmit={handleSearch} className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search premium fireworks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-4 pr-10 text-sm font-medium focus:ring-2 focus:ring-red-500/20"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </form>
            </div>
        </header>
    );
}
