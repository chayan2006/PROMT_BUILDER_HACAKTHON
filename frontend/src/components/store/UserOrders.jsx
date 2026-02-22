import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, ChevronRight, ArrowLeft, CreditCard, User, MapPin, LogOut, Clock, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const HQA_IMAGES = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop"
];

export default function UserOrders() {
    const navigate = useNavigate();

    const [orders] = useState([
        {
            id: "LUM-9082X",
            date: "February 18, 2026",
            status: "In Transit",
            total: 160.00 * 83,
            items: [
                { name: "Premium Curated Sneaker Collection", qty: 1, img: HQA_IMAGES[0] }
            ]
        },
        {
            id: "LUM-7711B",
            date: "January 24, 2026",
            status: "Delivered",
            total: 299.99 * 83,
            items: [
                { name: "Sony WH-1000XM4 Noise Cancelling", qty: 1, img: HQA_IMAGES[1] }
            ]
        }
    ]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'In Transit': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] font-sans text-white selection:bg-indigo-500/30">

            <Navbar />


            <main className="max-w-7xl mx-auto px-6 pt-40 pb-40">
                <div className="flex flex-col lg:flex-row gap-20">

                    {/* Account Sidebar */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="sticky top-40 space-y-1">
                            <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase mb-8 ml-4">Account Workspace</h3>

                            {[
                                { icon: Layers, label: "Acquisitions", active: true },
                                { icon: User, label: "Profile Identity", active: false },
                                { icon: MapPin, label: "Dispatch Hubs", active: false },
                                { icon: CreditCard, label: "Payment Vault", active: false },
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${item.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <item.icon size={18} className={item.active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400 transition-colors'} />
                                    {item.label}
                                </button>
                            ))}

                            <div className="mt-12 pt-8 border-t border-white/5 px-4">
                                <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="flex items-center gap-4 text-slate-500 hover:text-rose-400 transition-colors text-sm font-bold">
                                    <LogOut size={18} /> Termination Pulse
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Orders List */}
                    <div className="flex-1">
                        <div className="mb-16">
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">Acquisitions.</h1>
                            <p className="text-slate-400 text-lg font-medium">History of your premium curated artifacts.</p>
                        </div>

                        {orders.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 glass rounded-[3rem] border border-white/5">
                                <Package size={48} className="mx-auto text-slate-700 mb-6" />
                                <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Vault is empty.</h2>
                                <p className="text-slate-500 text-lg font-medium mx-auto mb-10 max-w-sm">Start your first curated acquisition to build your collection.</p>
                                <button onClick={() => navigate('/products')} className="bg-white text-black px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl shadow-white/5">
                                    Browse Collection
                                </button>
                            </motion.div>
                        ) : (
                            <div className="space-y-10">
                                {orders.map((order, idx) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1, duration: 0.6 }}
                                        className="bg-[#0f172a]/30 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-12 overflow-hidden group hover:border-white/10 transition-all shadow-2xl"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-12">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 flex-1">
                                                <div>
                                                    <span className="block text-[10px] font-black tracking-widest text-slate-500 uppercase mb-3">Identifier</span>
                                                    <span className="font-bold text-white tracking-widest text-sm">{order.id}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-[10px] font-black tracking-widest text-slate-500 uppercase mb-3">Timestamp</span>
                                                    <span className="font-bold text-white text-sm">{order.date}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-[10px] font-black tracking-widest text-slate-500 uppercase mb-3">Total Value</span>
                                                    <span className="font-bold text-white text-sm">₹{order.total.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-white/5 bg-white/5">
                                                <div className={`w-2 h-2 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${order.status === 'Delivered' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-8 mb-12">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex items-center gap-8 group/item cursor-pointer">
                                                    <div className="w-24 h-28 bg-slate-900 rounded-2xl overflow-hidden relative border border-white/5 group-hover/item:border-indigo-500/30 transition-colors">
                                                        <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-60 group-hover/item:opacity-100 group-hover/item:scale-110 transition-all duration-700" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Artifact</div>
                                                        <h4 className="font-bold text-xl text-white group-hover/item:text-indigo-300 transition-colors">{item.name}</h4>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-2 flex items-center gap-2">
                                                            <Clock size={12} /> Allocation: {item.qty} Unit
                                                        </p>
                                                    </div>
                                                    <button className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                                                        Inspect <ChevronRight size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {order.status === 'In Transit' && (
                                            <div className="bg-white/5 rounded-2xl p-8 border border-white/5">
                                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">
                                                    <span className="text-indigo-400">Confirmed</span>
                                                    <span className="text-indigo-400">Dispatched</span>
                                                    <span>En Route</span>
                                                    <span>Secured</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-800 rounded-full relative overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "65%" }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                                                    />
                                                </div>
                                                <div className="mt-6 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                            <Truck size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-white tracking-wide">Last Checkpoint: New Delhi Distribution</p>
                                                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Estimated arrival: Tomorrow by EOD</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] hover:text-indigo-300 transition-colors">Track Node</button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
