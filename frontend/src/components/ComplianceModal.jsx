import React, { useState, useEffect } from 'react';
import { shopConfig } from '../config/shopConfig';

export default function ComplianceModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [lang, setLang] = useState('en');

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

    const t = {
        en: {
            title: "Safety Declaration",
            welcome: <>Welcome to <span className="font-bold text-red-600">{shopConfig.shopName}</span>. Before entering, please confirm:</>,
            age: <>I am <span className="font-bold text-slate-900">{shopConfig.minAge}+ years</span> old.</>,
            location: <>I am located in <span className="font-bold text-slate-900">{shopConfig.city}</span> ({shopConfig.maxDeliveryRange} radius).</>,
            terms: <>I understand this is a <span className="font-bold text-slate-900">Booking Platform</span>, not an online store. Delivery by shop staff only.</>,
            agree: "I Agree & Enter",
            disagree: "I do not agree (Exit)",
            license: "Authorized Temporary License Holder"
        },
        hi: {
            title: "सुरक्षा घोषणा (Declaration)",
            welcome: <><span className="font-bold text-red-600">{shopConfig.shopName}</span> में आपका स्वागत है। प्रवेश करने से पहले कृपया पुष्टि करें:</>,
            age: <>मेरी उम्र <span className="font-bold text-slate-900">{shopConfig.minAge}+ वर्ष</span> से अधिक है।</>,
            location: <>मैं <span className="font-bold text-slate-900">{shopConfig.city}</span> ({shopConfig.maxDeliveryRange} क्षेत्र) में स्थित हूँ।</>,
            terms: <>यह केवल <span className="font-bold text-slate-900">बुकिंग प्लेटफॉर्म</span> (Booking Platform) है। डिलीवरी दुकान के स्टाफ द्वारा ही की जाएगी।</>,
            agree: "मैं सहमत हूँ (I Agree)",
            disagree: "मैं सहमत नहीं हूँ (Exit)",
            license: "अधिकृत अस्थायी लाइसेंस धारक"
        }
    };

    const content = t[lang];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl border border-white/20 relative overflow-hidden text-center">

                {/* Language Toggle */}
                <div className="absolute top-4 right-4 z-10 flex bg-gray-100 rounded-full p-1 border border-gray-200">
                    <button
                        onClick={() => setLang('en')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLang('hi')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'hi' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        हिंदी
                    </button>
                </div>

                {/* Warning Icon/Graphic */}
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 mt-4 ring-4 ring-red-50">
                    <span className="text-3xl">🔞</span>
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                    {content.title}
                </h2>

                <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                    {content.welcome}
                </p>

                <div className="space-y-3 text-left bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-8">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-green-600 font-bold text-xs">✓</div>
                        <p className="text-sm font-medium text-slate-700">{content.age}</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-green-600 font-bold text-xs">✓</div>
                        <p className="text-sm font-medium text-slate-700">{content.location}</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-green-600 font-bold text-xs">✓</div>
                        <p className="text-sm font-medium text-slate-700">{content.terms}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleAccept}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-red-200"
                    >
                        {content.agree}
                    </button>
                    <a href="https://google.com" className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider py-2">
                        {content.disagree}
                    </a>
                </div>

                <div className="mt-4 text-[10px] text-slate-300 font-medium uppercase tracking-widest">
                    {content.license}
                </div>
            </div>
        </div>
    );
}
