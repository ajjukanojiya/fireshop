import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Link to="/" className="text-3xl font-black uppercase tracking-tighter text-white">
                            Fire<span className="text-red-500">Shop</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            Premium firecrackers delivered safely to your doorstep. Experience the magic of celebration with our exclusive collection of high-quality fireworks.
                        </p>
                        <div className="flex gap-4 pt-4">
                            {/* Social Icons Placeholder */}
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                                <span className="font-bold text-xs">IG</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                                <span className="font-bold text-xs">FB</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                                <span className="font-bold text-xs">WA</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500">Quick Links</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link to="/" className="hover:text-red-500 transition-colors">Home</Link></li>
                            <li><Link to="/categories" className="hover:text-red-500 transition-colors">All Categories</Link></li>
                            <li><Link to="/my-orders" className="hover:text-red-500 transition-colors">Track Order</Link></li>
                            <li><Link to="/cart" className="hover:text-red-500 transition-colors">My Cart</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500">Contact Us</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-slate-300">
                                    Main Market, Firecracker Lane,<br />
                                    New Delhi, India - 110001
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="font-bold text-white tracking-wide">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:support@fireshop.com" className="text-slate-300 hover:text-white">support@fireshop.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-xs font-medium">
                        © {new Date().getFullYear()} FireShop. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">Privacy Policy</span>
                        <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
