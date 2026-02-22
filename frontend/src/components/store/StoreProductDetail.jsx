import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, Star, ShieldCheck, Truck, Plus, CheckCircle2, ChevronRight, Lock, Heart, Share2, Sparkles, Globe } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const HQA_IMAGES = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop", // Headphones
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop", // Watch
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop", // Shoes
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1600&auto=format&fit=crop"  // Camera
];

export default function StoreProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [mainImage, setMainImage] = useState(HQA_IMAGES[0]);
    const [activeTab, setActiveTab] = useState('description');
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/p1/marketplace/products');
                const products = response.data;
                const found = products.find(p => p.id === parseInt(id));

                if (found) {
                    setProduct(found);
                    setMainImage(HQA_IMAGES[found.id % HQA_IMAGES.length]);
                } else {
                    throw new Error("Not found");
                }
            } catch (error) {
                const mockID = parseInt(id) || 1;
                setProduct({
                    id: mockID,
                    name: mockID === 1 ? "Sony WH-1000XM4 Noise Cancelling" : "Minimalist Chronograph",
                    price: mockID === 1 ? 299.99 : 145.00,
                    category: mockID === 1 ? "Tech Objects" : "Accessories",
                    rating: 4.9,
                    description: "Engineered for excellence. Experience a seamless blend of striking aesthetics and unparalleled performance. Designed utilizing advanced materials for ultimate longevity and effortless sophistication in your daily rituals.",
                    specs: {
                        "Origin": "Berlin, Germany",
                        "Material": "Aerospace-grade Aluminum",
                        "Weight": "Ultra-lightweight 254g",
                        "Warranty": "3-Year Comprehensive Care"
                    }
                });
                setMainImage(HQA_IMAGES[mockID % HQA_IMAGES.length]);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push({ ...product, qty, img: mainImage });
        localStorage.setItem('cart', JSON.stringify(cart));
        navigate('/cart');
    };

    if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white"><div className="w-12 h-12 rounded-full border-t-2 border-indigo-500 animate-spin"></div></div>;
    if (!product) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-black text-2xl tracking-tighter">ARTIFACT NOT DISCOVERED.</div>;

    const priceINR = (product.price * 83).toLocaleString();

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#020617] font-sans text-white selection:bg-indigo-500/30 selection:text-white">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-40 pb-40 flex flex-col lg:flex-row gap-20 lg:gap-32 relative">

                {/* Left: Immersive Image Gallery */}
                <div className="w-full lg:w-[55%] lg:sticky top-40 h-auto lg:h-[calc(100vh-200px)] flex gap-6 md:gap-10">
                    {/* Vertical Thumbnails */}
                    <div className="hidden md:flex flex-col gap-4 w-24 flex-shrink-0">
                        {[mainImage, HQA_IMAGES[(product.id + 1) % 4], HQA_IMAGES[(product.id + 2) % 4], HQA_IMAGES[(product.id + 3) % 4]].map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setMainImage(img)}
                                className={`aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-indigo-500 scale-105 shadow-2xl shadow-indigo-500/20' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                            >
                                <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Main Stage Image */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mainImage}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="flex-1 bg-slate-900 rounded-[3rem] aspect-[4/5] lg:aspect-auto lg:h-full relative border border-white/5 overflow-hidden group shadow-3xl shadow-black/50"
                        >
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:scale-110 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-[3000ms] ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                            {/* Zoom Indicator */}
                            <div className="absolute bottom-8 right-8 p-4 rounded-2xl glass border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <Sparkles className="text-white w-5 h-5" />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right: Product Detail & Purchase Engine */}
                <div className="w-full lg:w-[45%] flex flex-col">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-indigo-400 font-black tracking-[0.2em] uppercase text-[10px]">{product.category || 'Curated Artifact'}</span>
                            <div className="flex gap-4">
                                <button onClick={() => setIsWishlisted(!isWishlisted)} className={`p-3 rounded-full border border-white/10 transition-all ${isWishlisted ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-600/30' : 'hover:bg-white/5'}`}>
                                    <Heart size={18} className={isWishlisted ? 'fill-white text-white' : 'text-slate-400'} />
                                </button>
                                <button className="p-3 rounded-full border border-white/10 hover:bg-white/5 transition-all text-slate-400">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-8">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-6 mb-10">
                            <div className="text-3xl font-bold text-white tracking-tight">₹{priceINR}</div>
                            <div className="h-4 w-px bg-white/10" />
                            <div className="flex items-center gap-1 text-amber-400">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className={s <= 4 ? 'fill-amber-400' : ''} />)}
                                <span className="text-[10px] font-black text-slate-500 ml-2 tracking-widest uppercase">4.9 / 5.0</span>
                            </div>
                        </div>

                        <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-xl">
                            {product.description}
                        </p>
                    </motion.div>

                    {/* Purchase Engine */}
                    <div className="p-10 rounded-[2.5rem] glass border border-white/10 mb-16 shadow-2xl">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400 mb-1">Curation Quantity</h4>
                                <p className="text-xs font-bold text-slate-500">Free global allocation available</p>
                            </div>
                            <div className="flex items-center bg-white/5 rounded-2xl p-2 border border-white/10 w-40">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors font-black text-xl">-</button>
                                <span className="flex-1 text-center font-black text-white text-lg">{qty}</span>
                                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors font-black text-xl">+</button>
                            </div>
                        </div>

                        <button onClick={handleAddToCart} className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] text-sm rounded-[1.5rem] hover:bg-slate-200 transition-all flex items-center justify-center gap-4 group shadow-xl shadow-white/5 active:scale-95 translate-all">
                            Inquire & Reserve — ₹{(product.price * 83 * qty).toLocaleString()} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-500 bg-white/5 p-4 rounded-xl border border-white/5">
                                <Truck size={16} className="text-indigo-400" /> Express Node
                            </div>
                            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-500 bg-white/5 p-4 rounded-xl border border-white/5">
                                <ShieldCheck size={16} className="text-indigo-400" /> Secured Origin
                            </div>
                        </div>
                    </div>

                    {/* Technical Specifications */}
                    <div className="space-y-12">
                        <div className="flex gap-10 border-b border-white/10 pb-4">
                            {['description', 'specifications', 'provenance'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative pb-4 ${activeTab === tab ? 'text-indigo-400' : 'text-slate-600 hover:text-slate-400'}`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div layoutId="activeTabUnderline" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="min-h-[250px]"
                        >
                            {activeTab === 'description' && (
                                <div className="text-slate-400 font-medium text-lg leading-relaxed space-y-6">
                                    <p>Our philosophy focuses on the subtraction of the unnecessary. Every detail of this artifact has been considered, resulting in a timeless piece that integrates flawlessly into your environment.</p>
                                    <p>Manufactured in limited quantities ensuring premium quality and distinctiveness. Sourced with strict adherence to environmental and ethical protocols.</p>
                                </div>
                            )}
                            {activeTab === 'specifications' && (
                                <div className="grid grid-cols-1 gap-y-6">
                                    {product.specs && Object.entries(product.specs).map(([key, value]) => (
                                        <div key={key} className="flex border-b border-white/5 pb-6 items-center">
                                            <span className="w-1/3 text-[10px] font-black tracking-widest uppercase text-slate-500">{key}</span>
                                            <span className="w-2/3 text-white font-bold">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'provenance' && (
                                <div className="text-slate-400 font-medium text-lg leading-relaxed space-y-8">
                                    <p>This artifact is part of the Q2 Curation Cohort. We ship globally using our premium logistics partners. Every order is fully insured and tracked door-to-door through the Lumina Network.</p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-sm font-bold text-white"><Globe size={18} className="text-indigo-400" /> Priority Node Delivery: 2-3 Days</div>
                                        <div className="flex items-center gap-4 text-sm font-bold text-white"><CheckCircle2 size={18} className="text-indigo-400" /> 30-Day Effortless Reconciliation</div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </motion.div>
    );
}
