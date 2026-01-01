import React, { useState, useEffect } from 'react';
import { shopConfig } from '../config/shopConfig';

export default function ComplianceModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has already accepted
        const accepted = localStorage.getItem('compliance_accepted');
        if (!accepted) {
            setIsOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('compliance_accepted', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl border border-white/20 relative overflow-hidden text-center">

                {/* Warning Icon/Graphic */}
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🔞</span>
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                    Safety Declaration
                </h2>

                <p className="text-slate-500 mb-8 leading-relaxed">
                    Welcome to <span className="font-bold text-red-600">{shopConfig.shopName}</span>.
                    Before entering, please confirm that you meet the following legal requirements:
                </p>

                <div className="space-y-4 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-green-600 font-bold text-xs">✓</div>
                        <p className="text-sm font-medium text-slate-700">I am <span className="font-bold text-slate-900">{shopConfig.minAge}+ years</span> old.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-green-600 font-bold text-xs">✓</div>
                        <p className="text-sm font-medium text-slate-700">I am located in <span className="font-bold text-slate-900">{shopConfig.city}</span> ({shopConfig.maxDeliveryRange} radius).</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-green-600 font-bold text-xs">✓</div>
                        <p className="text-sm font-medium text-slate-700">I understand this is a <span className="font-bold text-slate-900">Digital Booking Platform</span>, not an online store. Delivery is by shop staff only.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleAccept}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-red-200"
                    >
                        I Agree & Enter
                    </button>
                    <a href="https://google.com" className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider py-2">
                        I do not agree (Exit)
                    </a>
                </div>

                <div className="mt-6 text-[10px] text-slate-300 font-medium uppercase tracking-widest">
                    Authorized Temporary License Holder
                </div>
            </div>
        </div>
    );
}
