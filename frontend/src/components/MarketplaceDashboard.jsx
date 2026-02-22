import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ShoppingBag, TrendingUp, AlertCircle, Search, Package, Star,
    LayoutDashboard, Settings, Users, Bell, MapPin, CheckCircle2,
    ArrowRight, Loader2, Plus, Minus, ArrowUpRight, ArrowDownRight,
    Filter, MoreVertical, ExternalLink, Activity, DollarSign, Hexagon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

const PRODUCT_IMAGES = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop", // Red Shoes
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop", // Watch
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop", // Headphones
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop"  // Camera
];

export default function MarketplaceDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [pincode, setPincode] = useState('');
    const [pincodeStatus, setPincodeStatus] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/p1/marketplace/products');
                setProducts(response.data);
            } catch (error) {
                setProducts([
                    { id: 1, name: "Premium Artifact v1.0", price: 299.00, stock_qty: 12, rating: 4.9, category: "Tech" },
                    { id: 2, name: "Minimalist Chronograph", price: 145.00, stock_qty: 4, rating: 4.8, category: "Lifestyle" },
                    { id: 3, name: "Studio Reference Audio", price: 540.00, stock_qty: 45, rating: 4.5, category: "Audio" },
                    { id: 4, name: "Optical Vanguard Camera", price: 890.00, stock_qty: 2, rating: 4.7, category: "Tech" }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const addToCart = (product) => {
        setCart(prev => {
            const exists = prev.find(i => i.id === product.id);
            if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    // Chart Data
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            fill: true,
            label: 'Revenue',
            data: [12000, 19000, 15000, 22000, 30000, 32450],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            pointRadius: 0,
        }]
    };

    const doughnutData = {
        labels: ['Tech', 'Lifestyle', 'Audio'],
        datasets: [{
            data: [55, 25, 20],
            backgroundColor: ['#6366f1', '#a855f7', '#ec4899'],
            hoverOffset: 4,
            borderWidth: 0,
        }]
    };

    return (
        <div className="flex-1 p-8 sm:p-12 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
                <div className="max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
                    >
                        <Hexagon size={12} className="text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Marketplace Control v5.0</span>
                    </motion.div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white leading-[0.9]">
                        Operational <br />
                        <span className="text-slate-500">Intelligence.</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium mt-6">Secure, scale, and manage premium dropshipping nodes with real-time financial tracking and inventory synchronization.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Query artifacts, nodes or vendors..."
                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-bold text-white placeholder:text-slate-600"
                        />
                    </div>
                    <button className="p-4 rounded-2xl glass border border-white/10 text-slate-400 hover:text-white transition-all">
                        <Bell size={20} />
                    </button>
                    <div className="relative">
                        <button className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white text-black font-black text-sm hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-95">
                            <ShoppingBag size={18} />
                            Cart Node ({cartItemsCount})
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">

                {/* Left Column: Analytics and Stats */}
                <div className="xl:col-span-1 space-y-12">
                    {/* Revenue Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-[2.5rem] glass border border-white/10 bg-indigo-600/5 relative overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[60px] rounded-full" />
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400">
                                <DollarSign size={20} />
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-400 font-black text-[10px] uppercase tracking-widest px-2 py-1 bg-emerald-400/10 rounded-full border border-emerald-400/20">
                                <ArrowUpRight size={12} /> 12.4%
                            </div>
                        </div>
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Settled Revenue</h4>
                        <h2 className="text-4xl font-black text-white tracking-tighter">$32,450.00</h2>

                        <div className="mt-8 h-24">
                            <Line data={revenueData} options={{
                                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                                scales: { x: { display: false }, y: { display: false } },
                                maintainAspectRatio: false
                            }} />
                        </div>
                    </motion.div>

                    {/* Stock & Assets */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="p-8 rounded-[2rem] glass border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                                    <Package size={18} />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Listings</h4>
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter">{products.length}</h2>
                            <p className="text-xs font-bold text-slate-600 mt-2 uppercase tracking-widest">4 Node groups connected</p>
                        </div>

                        <div className="p-8 rounded-[2rem] glass border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
                                    <AlertCircle size={18} />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Alerts</h4>
                            </div>
                            <h2 className="text-4xl font-black text-rose-400 tracking-tighter">02</h2>
                            <p className="text-xs font-bold text-slate-600 mt-2 uppercase tracking-widest">Low stock detected</p>
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="p-8 rounded-[2.5rem] glass border border-white/5">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 text-center">Protocol Allocation</h4>
                        <div className="h-48 flex justify-center">
                            <Doughnut data={doughnutData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
                        </div>
                        <div className="mt-8 space-y-4">
                            {['Tech', 'Lifestyle', 'Audio'].map((cat, i) => (
                                <div key={cat} className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-indigo-500' : i === 1 ? 'bg-purple-500' : 'bg-pink-500'}`} />
                                        <span className="text-slate-400">{cat}</span>
                                    </div>
                                    <span className="text-white">{i === 0 ? '55%' : i === 1 ? '25%' : '20%'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Marketplace Storefront */}
                <div className="xl:col-span-3 space-y-12">

                    {/* Discovery Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white/[0.02] border border-white/5 p-10 rounded-[3rem]">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-white mb-3">Discovery Engine.</h2>
                            <p className="text-slate-500 font-medium">Verified artifacts available for immediate node deployment.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10">
                                {['All', 'Tech', 'Lifestyle'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <button className="p-4 rounded-xl glass border border-white/10 text-slate-400 hover:text-white">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-96 rounded-[2.5rem] bg-white/5 animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {products.filter(p => activeCategory === 'All' || p.category === activeCategory).map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative flex flex-col bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/50 hover:shadow-3xl hover:shadow-black/50 transition-all duration-500"
                                >
                                    {/* Product Visual */}
                                    <div className="aspect-[4/5] relative overflow-hidden">
                                        <img
                                            src={PRODUCT_IMAGES[idx % PRODUCT_IMAGES.length]}
                                            alt={product.name}
                                            className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40 group-hover:mix-blend-normal group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2000ms] ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />

                                        {/* Status Tags */}
                                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                                            {product.stock_qty <= 5 && (
                                                <span className="px-3 py-1.5 rounded-full bg-rose-500/90 text-[9px] font-black uppercase tracking-widest text-white shadow-xl backdrop-blur-md">
                                                    Low Allocation
                                                </span>
                                            )}
                                            <span className="px-3 py-1.5 rounded-full glass border border-white/20 text-[9px] font-black uppercase tracking-widest text-white shadow-xl">
                                                {product.category || 'Artifact'}
                                            </span>
                                        </div>

                                        {/* Quick Add Overlay */}
                                        <div className="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="w-full py-5 rounded-[1.5rem] bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-indigo-600/50 hover:bg-indigo-500 flex items-center justify-center gap-3 transition-colors active:scale-95"
                                            >
                                                Initialize Node <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Product Meta */}
                                    <div className="p-8 pb-10 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <h3 className="text-xl font-bold text-white tracking-tight leading-snug">{product.name}</h3>
                                            <div className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20 text-[10px] font-black">
                                                <Star size={12} className="fill-amber-400" /> {product.rating || '4.9'}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 mb-8 flex-1">
                                            High-fidelity dropshipping node with verified logistics origin and automated settlement.
                                        </p>
                                        <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Standard Settlement</p>
                                                <div className="text-2xl font-black text-indigo-400 tracking-tighter">₹{(product.price * 83).toLocaleString()}</div>
                                            </div>
                                            <button className="p-3 rounded-xl glass border border-white/10 text-slate-500 hover:text-white transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
