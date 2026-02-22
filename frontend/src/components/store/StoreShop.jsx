import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Plus, Filter, X, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const HQA_IMAGES = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop", // Headphones
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop", // Watch
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop", // Shoes
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop", // Camera
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1200&auto=format&fit=crop", // Sunglasses
    "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1200&auto=format&fit=crop", // Bag
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200&auto=format&fit=crop"  // Lamp
];

export default function StoreShop() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/p1/marketplace/products');
                if (!response.data || response.data.length === 0) throw new Error("No products in DB");
                setProducts(response.data);
            } catch (error) {
                setProducts([
                    { id: 1, name: "Sony WH-1000XM4 Noise Cancelling", price: 299.99, category: 'Tech Objects', rating: 4.9 },
                    { id: 2, name: "Minimalist Chronograph Watch", price: 145.00, category: 'Accessories', rating: 4.8 },
                    { id: 3, name: "Nike Air Max 270 React", price: 160.00, category: 'Ready-to-Wear', rating: 4.7 },
                    { id: 4, name: "Polaroid OneStep+ Vintage Camera", price: 139.99, category: 'Tech Objects', rating: 4.6 },
                    { id: 5, name: "Ray-Ban Classic Aviators", price: 155.00, category: 'Accessories', rating: 4.5 },
                    { id: 6, name: "Leather Weekend Duffle", price: 210.00, category: 'Accessories', rating: 4.9 },
                    { id: 7, name: "Nordic Minimalist Desk Lamp", price: 85.00, category: 'Home Living', rating: 4.4 }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="min-h-screen bg-[#020617] font-sans text-white selection:bg-indigo-500/30 selection:text-white">

            <Navbar />

            <div className="h-32 md:h-40"></div>

            {/* Header Section */}
            <header className="pb-16 px-6 sm:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/10 pb-16">
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
                            >
                                <Star size={12} className="text-indigo-400 fill-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Curated Excellence</span>
                            </motion.div>

                            <div className="overflow-hidden">
                                <motion.h1
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6"
                                >
                                    The Storefront.
                                </motion.h1>
                            </div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="text-slate-400 text-lg md:text-xl font-medium max-w-lg leading-relaxed"
                            >
                                Discover a collection of artifacts curated for the discerning eye. Performance meets aesthetics in every piece.
                            </motion.p>
                        </div>

                        <div className="w-full max-w-sm">
                            <div className="relative group/search bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-indigo-500/50 transition-all backdrop-blur-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within/search:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search collection..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent pl-8 pr-2 py-0 text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 sm:px-12 pb-40 flex flex-col lg:flex-row gap-16">

                {/* Desktop Filters */}
                <aside className="w-72 hidden lg:block flex-shrink-0">
                    <div className="sticky top-40 space-y-10">
                        <div>
                            <h3 className="text-xs font-black tracking-[0.2em] text-white uppercase mb-8 flex items-center gap-2">
                                <Filter size={14} className="text-indigo-400" /> Refine Gallery
                            </h3>

                            <div className="space-y-12">
                                <div>
                                    <h4 className="font-black text-slate-500 mb-6 tracking-widest uppercase text-[10px]">Categories</h4>
                                    <ul className="space-y-4">
                                        {['All Collections', 'Ready-to-Wear', 'Accessories', 'Tech Objects', 'Home Living'].map((cat, i) => (
                                            <li key={cat} className={`group cursor-pointer flex items-center justify-between text-sm font-bold transition-all ${i === 0 ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}>
                                                <span>{cat}</span>
                                                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${i === 0 ? 'opacity-100' : ''}`} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-black text-slate-500 mb-6 tracking-widest uppercase text-[10px]">Refine By</h4>
                                    <ul className="space-y-4">
                                        {['New Arrivals', 'Price: High to Low', 'Price: Low to High'].map((sort, i) => (
                                            <li key={sort} className={`group cursor-pointer flex items-center gap-3 text-sm font-bold transition-all ${i === 0 ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-indigo-500 ring-4 ring-indigo-500/20' : 'bg-slate-700'}`} />
                                                {sort}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                            <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-500/10 blur-xl group-hover:blur-2xl transition-all" />
                            <h4 className="text-lg font-black mb-2 relative z-10">Sell on Lumina</h4>
                            <p className="text-xs text-slate-400 font-bold mb-6 relative z-10">Join 12,000+ premium vendors globally.</p>
                            <button onClick={() => navigate('/register')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:gap-4 transition-all">
                                Learn More <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Mobile Filter Trigger */}
                <button onClick={() => setFilterOpen(true)} className="lg:hidden w-full py-4 glass border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest mb-8">
                    <Filter size={18} /> Refine Collection
                </button>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="mb-10 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">Discovered {filteredProducts.length} Artifacts</span>
                        <div className="h-px bg-white/5 flex-1 mx-8 hidden sm:block" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-12">
                        {filteredProducts.map((product, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                                key={product.id}
                                className="group cursor-pointer"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <div className="aspect-[4/5] bg-slate-900 rounded-[2.5rem] relative mb-8 overflow-hidden border border-white/5 transition-colors group-hover:border-indigo-500/30">
                                    <img
                                        src={HQA_IMAGES[i % HQA_IMAGES.length]}
                                        alt={product.name}
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-[0.16,1,0.3,1] mix-blend-luminosity group-hover:mix-blend-normal"
                                    />

                                    {/* Badges */}
                                    <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                                        {i < 2 && (
                                            <span className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-2xl">
                                                Lumina Exclusive
                                            </span>
                                        )}
                                        {i === 3 && (
                                            <span className="bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-2xl">
                                                New Arrival
                                            </span>
                                        )}
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigate('/cart'); }}
                                            className="w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl flex justify-center items-center gap-3 hover:bg-slate-200 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                                        >
                                            Inquire & Reserve <ShoppingBag size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="px-2">
                                    <div className="flex justify-between items-start gap-4 mb-3">
                                        <div>
                                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{product.category || 'Collection Item'}</div>
                                            <h3 className="font-bold text-xl text-white transition-colors">{product.name}</h3>
                                        </div>
                                        <span className="text-xl font-bold text-white tracking-tight">₹{(product.price * 83).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-400">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={10} className={s <= Math.floor(product.rating || 4) ? 'fill-amber-400' : 'text-slate-700'} />
                                        ))}
                                        <span className="text-[10px] font-black text-slate-500 ml-2 tracking-widest uppercase">{product.rating || 4.5} Rating</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-40 bg-white/[0.02] border border-white/5 rounded-[3rem]">
                            <Search size={48} className="mx-auto text-slate-700 mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No artifacts discovered.</h3>
                            <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">We couldn't find any items matching your specific curation criteria.</p>
                            <button onClick={() => setSearch('')} className="bg-white text-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-200 transition-all">
                                Reset Filters
                            </button>
                        </motion.div>
                    )}
                </div>
            </main >

            <Footer />

            <AnimatePresence>
                {filterOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-[#020617]/95 backdrop-blur-xl md:hidden p-8 flex flex-col">
                        <div className="flex justify-between items-center mb-16">
                            <h3 className="text-3xl font-black tracking-tighter uppercase italic text-indigo-400">Refine.</h3>
                            <button onClick={() => setFilterOpen(false)} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white"><X size={24} /></button>
                        </div>
                        <div className="flex-1 space-y-12 overflow-y-auto custom-scrollbar">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Categories</h4>
                                {['All Collections', 'Ready-to-Wear', 'Accessories', 'Tech Objects', 'Home Living'].map(cat => (
                                    <div key={cat} className="text-4xl font-black text-white px-2 py-4 border-b border-white/5">{cat}</div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
