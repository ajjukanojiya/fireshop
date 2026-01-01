import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white py-6 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">

                {/* Brand & Copyright */}
                <div>
                    <h2 className="text-lg font-black uppercase tracking-tighter">
                        Fire<span className="text-red-500">Shop</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">© {new Date().getFullYear()} All rights reserved.</p>
                </div>

                {/* Contact Info - Compact */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-xs text-slate-300 font-medium">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="text-red-500">📍</span> New Delhi, India
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="text-red-500">📞</span> +91 98765 43210
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <a href="mailto:support@fireshop.com" className="hover:text-white transition-colors">
                            <span className="text-red-500">✉️</span> support@fireshop.com
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
