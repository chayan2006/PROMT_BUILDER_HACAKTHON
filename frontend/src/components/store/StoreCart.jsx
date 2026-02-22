import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Trash2, ShieldCheck, CreditCard, Lock, ChevronRight, Minus, Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const HQA_IMAGES = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"
];

export default function StoreCart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([
        { id: 1, name: "Sony WH-1000XM4 Noise Cancelling", brand: "Sony", price: 299.99, quantity: 1, img: HQA_IMAGES[0] },
        { id: 2, name: "Minimalist Chronograph", brand: "MVMT", price: 145.00, quantity: 1, img: HQA_IMAGES[1] }
    ]);

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) return;
        setCart(cart.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    };

    const removeItem = (id) => setCart(cart.filter(item => item.id !== id));

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const savings = subtotal * 0.15; // Luxury loyalty discount
    const total = subtotal - savings;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#020617] font-sans text-white selection:bg-indigo-500/30 selection:text-white">

            <Navbar />


            <div className="max-w-7xl mx-auto px-6 pt-40 pb-40">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/10 pb-12">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
                        >
                            <ShoppingBag size={12} className="text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Procurement Queue</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Inventory.</h1>
                        <p className="text-slate-400 text-lg font-medium mt-4">Review your selected artifacts before finalizing procurement.</p>
                    </div>
                    <button onClick={() => navigate('/products')} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-3 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Continue Discovery
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-20 relative">
                    {/* Cart Items List */}
                    <div className="flex-1 space-y-12">
                        <AnimatePresence mode="popLayout">
                            {cart.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 rounded-[3.5rem] bg-white/[0.02] border border-white/5">
                                    <h2 className="text-3xl font-black tracking-tight text-white mb-6">Your queue is empty.</h2>
                                    <p className="text-slate-500 text-lg font-medium max-w-sm mx-auto mb-10">Discover our latest collection of premium artifacts and elevate your everyday lifestyle.</p>
                                    <button onClick={() => navigate('/products')} className="bg-white text-black px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all shadow-xl shadow-white/5">
                                        Explore Collection
                                    </button>
                                </motion.div>
                            ) : (
                                cart.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -50, scale: 0.95 }}
                                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                                        className="flex flex-col sm:flex-row gap-10 border-b border-white/5 pb-10 relative group"
                                    >
                                        <div className="w-full sm:w-44 aspect-square rounded-[2rem] bg-slate-900 relative overflow-hidden flex-shrink-0 cursor-pointer border border-white/5 group-hover:border-indigo-500/30 transition-colors" onClick={() => navigate(`/product/${item.id}`)}>
                                            <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-60 group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-110 transition-all duration-[2000ms]" />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between py-2">
                                            <div className="flex justify-between items-start gap-6">
                                                <div>
                                                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">{item.brand}</div>
                                                    <h3 className="font-bold text-2xl text-white group-hover:text-indigo-300 transition-colors">{item.name}</h3>
                                                </div>
                                                <button onClick={() => removeItem(item.id)} className="w-12 h-12 rounded-full flex items-center justify-center text-slate-600 hover:text-rose-400 hover:bg-rose-400/10 transition-all">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="flex items-end justify-between w-full mt-10">
                                                <div>
                                                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-4 block pl-1">Allocation</span>
                                                    <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/10 w-36">
                                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white transition-colors"><Minus size={16} /></button>
                                                        <span className="flex-1 text-center font-black text-white text-sm">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white transition-colors"><Plus size={16} /></button>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-3xl font-bold tracking-tighter text-white mb-2">
                                                        ₹{((item.price * 83) * item.quantity).toLocaleString()}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                                        <Sparkles size={12} /> SECURED PRICE
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sticky Sidebar */}
                    {cart.length > 0 && (
                        <div className="w-full lg:w-[420px] shrink-0">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="rounded-[3rem] glass border border-white/10 p-10 lg:p-12 sticky top-40 shadow-3xl shadow-black/50">
                                <h2 className="text-2xl font-black tracking-tighter text-white mb-10 border-b border-white/5 pb-8">Financial Summary</h2>

                                <div className="space-y-6 mb-10 text-sm">
                                    <div className="flex justify-between text-slate-400 font-bold">
                                        <span>Initial Procurement ({cart.length} nodes)</span>
                                        <span className="text-white">₹{(subtotal * 83).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 font-bold">
                                        <span>Lumina Node Logistics</span>
                                        <span className="text-indigo-400 uppercase tracking-[0.2em] font-black text-[10px]">Complimentary</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/20">
                                        <div className="flex items-center gap-3">
                                            <Sparkles size={16} className="text-indigo-400" />
                                            <span className="text-indigo-300 font-black tracking-widest text-[10px] uppercase">Loyalty Allocation</span>
                                        </div>
                                        <span className="text-indigo-300 font-black">- ₹{(savings * 83).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="border-t border-white/5 pt-10 mb-12 flex justify-between items-end">
                                    <div>
                                        <div className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-2">Net Settlement</div>
                                        <div className="text-5xl font-black text-white tracking-tighter transition-all">₹{(total * 83).toLocaleString()}</div>
                                    </div>
                                </div>

                                <button onClick={() => navigate('/checkout')} className="w-full py-6 bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-4 group mb-8 shadow-xl shadow-indigo-600/20 active:scale-95">
                                    Initialize Settlement <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="space-y-4 pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-indigo-400"><Lock size={14} /></div>
                                        AES-256 Encryption
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-indigo-400"><CreditCard size={14} /></div>
                                        Stripe Real-time Clear
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </motion.div>
    );
}
