import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#050B14] border-t border-white/5 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black text-sm">L</div>
                            <span className="text-xl font-bold tracking-tight text-white">Lumina</span>
                        </div>
                        <p className="text-slate-400 max-w-sm text-sm leading-relaxed mb-6">
                            The next generation of digital commerce for elite global brands. Built with precision, scale, and performance at its core.
                        </p>
                        <div className="flex gap-4">
                            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Twitter size={18} /></button>
                            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Github size={18} /></button>
                            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Linkedin size={18} /></button>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Ecosystem</h4>
                        <ul className="space-y-4 text-sm text-slate-400 font-medium">
                            <li className="hover:text-white cursor-pointer transition-colors">Marketplace</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Logistics</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Fraud Detection</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Global Supply</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-400 font-medium">
                            <li className="hover:text-white cursor-pointer transition-colors">About</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Infrastructure</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Status</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <p>© 2026 LUMINA INFRASTRUCTURES. ALL RIGHTS RESERVED.</p>
                    <div className="flex items-center gap-2">
                        MADE WITH <Heart size={12} className="text-rose-500 fill-rose-500" /> FOR THE FUTURE
                    </div>
                </div>
            </div>
        </footer>
    );
}
