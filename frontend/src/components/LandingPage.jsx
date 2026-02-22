import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, PieChart, ShieldAlert, Zap, Globe, Lock, PlayCircle, Sparkles, Box, Rocket, Terminal, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';

export default function LandingPage() {
    const navigate = useNavigate();

    // Smooth scroll progress for background effects
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">

            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 px-6 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
                    <div className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" />
                </div>

                <motion.div
                    style={{ opacity, scale }}
                    className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
                    >
                        <Sparkles size={14} className="text-indigo-400" />
                        <span className="text-xs font-bold tracking-widest uppercase text-indigo-300">Investor Ready Platform v5.0</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.9]"
                    >
                        Modern Commerce, <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent italic">Curated for the Elite.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-2xl text-slate-400 max-w-3xl mb-12 font-medium leading-relaxed"
                    >
                        Lumina is more than a store. It's a premium ecosystem designed for the next generation of commerce. Scale faster, secure every transaction, and wow your customers.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <button
                            onClick={() => navigate('/products')}
                            className="px-8 py-5 rounded-2xl bg-white text-black font-black text-lg hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.05)] flex items-center justify-center gap-3"
                        >
                            Explore Collection <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-md group"
                        >
                            Become a Vendor <Rocket size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                        </button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Premium Artifacts Preview */}
            <section className="px-6 py-32 bg-white/[0.01] border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <span className="text-indigo-400 font-black tracking-[0.2em] uppercase text-[10px] mb-4 block">The Retail Experience</span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">Built for founders. <br />Loved by users.</h2>
                            <p className="text-slate-400 text-lg font-medium">Every product on Lumina undergoes a rigorous 20-point quality check. We don't just sell artifacts; we curate legacies.</p>
                        </div>
                        <button onClick={() => navigate('/products')} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2 group">
                            Explore All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="aspect-[3/4] rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden relative group cursor-pointer"
                                onClick={() => navigate('/products')}
                            >
                                <img
                                    src={`https://images.unsplash.com/photo-${[
                                        '1505740420928-5e560c06d30e',
                                        '1523275335684-37898b6baf30',
                                        '1542291026-7eec264c27ff',
                                        '1526170375885-4d8ecf77b99f'
                                    ][i - 1]}?q=80&w=600&auto=format&fit=crop`}
                                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
                                    alt="Product"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="text-[10px] font-black uppercase text-indigo-400 mb-2">Collection 0{i}</div>
                                    <div className="text-xl font-bold text-white uppercase tracking-widest leading-tight">Limited Edition</div>
                                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Details <ChevronRight size={12} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vendor Benefits Section */}
            <section className="px-6 py-40 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
                    <div className="flex-1 relative">
                        <div className="absolute -left-20 -top-20 w-80 h-80 bg-purple-600/20 blur-[100px]" />
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Empowering <br /> Premium Vendors.</h2>
                        <div className="space-y-6">
                            {[
                                { title: "Low Commission", desc: "Keep more of your revenue with our industry-leading 3% flat commission rate." },
                                { title: "Fast Payouts", desc: "Settlements processed within 48 hours directly to your business account." },
                                { title: "Advanced Analytics", desc: "Deep insights into customer behavior and supply chain efficiency." }
                            ].map((item, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i}
                                    className="flex gap-4 items-start"
                                >
                                    <div className="mt-1"><CheckCircle2 size={24} className="text-emerald-400" /></div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                                        <p className="text-slate-400 font-medium">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <button onClick={() => navigate('/register')} className="mt-12 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20">
                            Start Selling Today
                        </button>
                    </div>
                    <div className="flex-1 w-full max-w-xl">
                        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0a0a0f] p-8 aspect-square shadow-2xl">
                            <div className="grid grid-cols-2 gap-4 h-full">
                                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col justify-between">
                                    <Zap className="text-amber-400" />
                                    <div>
                                        <div className="text-3xl font-black">99.9%</div>
                                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Uptime</div>
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col justify-between">
                                    <Globe className="text-indigo-400" />
                                    <div>
                                        <div className="text-3xl font-black">120+</div>
                                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Countries</div>
                                    </div>
                                </div>
                                <div className="col-span-2 rounded-2xl bg-white/5 border border-white/10 p-8 flex flex-col items-center justify-center text-center">
                                    <PieChart size={40} className="text-purple-400 mb-4" />
                                    <div className="text-4xl font-black text-white">$142k</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Avg. Vendor Growth</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Indicators Bar */}
            <div className="bg-white/5 border-y border-white/5 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-wrap justify-between items-center gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    {/* Placeholder Trust Logos or Icons */}
                    <div className="flex items-center gap-3 font-black text-xl tracking-tighter"><ShieldAlert size={24} /> SECURE PAYMENTS</div>
                    <div className="flex items-center gap-3 font-black text-xl tracking-tighter"><Globe size={24} /> WORLDWIDE LOGISTICS</div>
                    <div className="flex items-center gap-3 font-black text-xl tracking-tighter"><Zap size={24} /> INSTANT SETTLEMENT</div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
