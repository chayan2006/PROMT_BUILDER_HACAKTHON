import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Globe, BarChart3, ShieldCheck, Rocket, ArrowRight, DollarSign, Users, Sparkles, Terminal, ChevronRight } from 'lucide-react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';

export default function SellOnLumina() {
    const navigate = useNavigate();

    const benefits = [
        {
            icon: DollarSign,
            title: "3% Commission",
            desc: "The lowest commission rate in premium retail. Scale your brand without losing your margins.",
            color: "text-emerald-400"
        },
        {
            icon: Zap,
            title: "48h Payouts",
            desc: "Settlements processed at high frequency. Liquidity at the speed of light.",
            color: "text-amber-400"
        },
        {
            icon: BarChart3,
            title: "Deep Metrics",
            desc: "Real-time analytics dashboard with customer heatmaps and predictive supply chain logic.",
            color: "text-indigo-400"
        },
        {
            icon: ShieldCheck,
            title: "Secured Trust",
            desc: "Automated fraud prevention and chargeback protection powered by our Security Shield.",
            color: "text-purple-400"
        }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150%] max-w-7xl pointer-events-none opacity-20">
                    <div className="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/30 blur-[150px] animate-pulse" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
                    >
                        <Sparkles size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-black tracking-widest uppercase text-indigo-300">Merchant Growth Engine</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-9xl font-black tracking-tighter mb-12 leading-[0.8]"
                    >
                        Build your brand <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent italic">on the Lumina.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-2xl text-slate-400 max-w-3xl mb-16 font-medium leading-relaxed"
                    >
                        Join the world's most elite merchant network. We provide the infrastructure; you provide the artifacts. Scale globally from Day 1.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-6"
                    >
                        <button onClick={() => navigate('/register')} className="px-12 py-6 rounded-[2rem] bg-indigo-600 text-white font-black text-xl hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-600/30 flex items-center gap-4">
                            Start Selling <Rocket size={24} />
                        </button>
                        <button className="px-12 py-6 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black text-xl hover:bg-white/10 transition-all flex items-center gap-4 backdrop-blur-md">
                            Documentation <Terminal size={24} className="text-slate-500" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Metrics Section */}
            <section className="px-6 py-40 border-y border-white/5 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="text-indigo-400 font-black tracking-[0.2em] uppercase text-[10px] mb-6 block">Ecosystem Dynamics</span>
                            <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tight leading-tight">The Merchant Dashboard. <br />High Resolution.</h2>
                            <p className="text-slate-400 text-lg font-medium mb-12">Lumina gives you enterprise-grade visibility. Track order velocity, monitor geographical heatmaps, and optimize your inventory with AI-driven suggestions.</p>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="text-4xl font-black mb-2">350%</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Avg. Brand Growth</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="text-4xl font-black mb-2">10ms</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">API Latency</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative rounded-[3rem] overflow-hidden border border-white/10 aspect-square lg:aspect-video shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-transparent opacity-50" />
                            <div className="relative h-full w-full bg-[#0a0a0f] p-12 flex flex-col gap-8">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2"><div className="w-4 h-4 rounded-full bg-rose-500/50" /><div className="w-4 h-4 rounded-full bg-amber-500/50" /><div className="w-4 h-4 rounded-full bg-emerald-500/50" /></div>
                                    <div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Lumina Terminal v5</div>
                                </div>
                                <div className="flex-1 rounded-2xl bg-white/[0.03] border border-white/5 p-8 flex flex-col justify-end gap-6 overflow-hidden">
                                    <div className="flex items-end gap-2 h-32">
                                        {[60, 40, 80, 50, 90, 70, 100, 40, 60].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ delay: i * 0.1, duration: 1 }}
                                                className="flex-1 bg-indigo-500/30 rounded-t-lg border-t border-indigo-400/50"
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-600 tracking-widest uppercase">
                                        <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-8 flex justify-center">
                                <span className="px-6 py-2 rounded-full glass border border-white/10 text-xs font-black uppercase tracking-widest text-white shadow-2xl">Live Transaction Stream</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="px-6 py-40">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Everything you need. <br />Plus everything you want.</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">Lumina is the atomic unit of modern high-end commerce.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {benefits.map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group cursor-pointer p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all hover:bg-white/[0.04]"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-all group-hover:scale-110 shadow-xl group-hover:shadow-indigo-600/20`}>
                                    <benefit.icon className={`w-8 h-8 ${benefit.color} group-hover:text-white transition-colors`} />
                                </div>
                                <h4 className="text-xl font-black mb-4 group-hover:text-indigo-300 transition-colors">{benefit.title}</h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed group-hover:text-slate-400 transition-colors">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 pb-40">
                <div className="max-w-4xl mx-auto rounded-[3.5rem] bg-gradient-to-br from-indigo-600 to-purple-600 p-1 md:p-1.5 shadow-2xl shadow-indigo-600/20">
                    <div className="bg-[#020617] rounded-[3.3rem] p-12 md:p-24 flex flex-col items-center text-center">
                        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight italic">Ready to scale <br />your legacy?</h2>
                        <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-xl">Applications are currently open for the Q2 curation cohort. Reserve your node now.</p>
                        <button onClick={() => navigate('/register')} className="px-12 py-5 rounded-[2rem] bg-indigo-600 text-white font-black text-xl hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-4">
                            Start Selling <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
