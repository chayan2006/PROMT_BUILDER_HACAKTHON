import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Star, ArrowRight, ArrowUpRight, ShieldCheck, ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';


const HQA_IMAGES = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop", // Headphones
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop", // Watch
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop", // Shoes
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop", // Camera
];

export default function StoreHome() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { scrollY } = useScroll();
    const yHero = useTransform(scrollY, [0, 1000], [0, 300]);
    const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/p1/marketplace/products');
                let fetchedProducts = response.data;
                if (fetchedProducts.length === 0) throw new Error("No products in DB");
                setProducts(fetchedProducts.slice(0, 4));
            } catch (error) {
                setProducts([
                    { id: 1, name: "Sony WH-1000XM4 Noise Cancelling", price: 299.99, rating: 4.9 },
                    { id: 2, name: "Minimalist Chronograph Watch", price: 145.00, rating: 4.8 },
                    { id: 3, name: "Nike Air Max 270 React", price: 160.00, rating: 4.7 },
                    { id: 4, name: "Polaroid OneStep+ Vintage Camera", price: 139.99, rating: 4.6 }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const pageVariants = {
        initial: { opacity: 0 },
        in: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
        out: { opacity: 0 }
    };

    const textReveal = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="min-h-screen bg-[#050505] font-sans text-slate-200 selection:bg-white/30 selection:text-black overflow-hidden">

            <Navbar />


            {/* Cinematic Hero Section */}
            <motion.section style={{ y: yHero, opacity: opacityHero }} className="relative h-screen min-h-[800px] flex items-center justify-center pt-32">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop" alt="Hero Background" className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]/50" />
                </div>

                <div className="relative z-10 text-center max-w-5xl mx-auto px-4 mt-32">
                    <motion.div initial="hidden" animate="visible" variants={textReveal} className="overflow-hidden mb-6">
                        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-medium tracking-tighter text-white leading-[0.9]">
                            The Art of <br /> <span className="italic font-light text-slate-300">Modern Living.</span>
                        </h1>
                    </motion.div>

                    <motion.div initial="hidden" animate="visible" variants={textReveal} transition={{ delay: 0.2 }} className="overflow-hidden mb-12">
                        <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                            Curated excellence. Discover our exclusive collection of premium artifacts designed to elevate your everyday lifestyle with uncompromising quality.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button onClick={() => navigate('/products')} className="group relative px-8 py-4 bg-white text-black text-sm font-bold tracking-widest uppercase overflow-hidden w-full sm:w-auto">
                            <div className="absolute inset-0 w-full h-full bg-slate-200 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                            <span className="relative flex items-center justify-center gap-3">
                                Explore Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        <button className="group flex items-center gap-4 text-white hover:text-slate-300 transition-colors">
                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                <Play className="w-4 h-4 ml-1" fill="currentColor" />
                            </div>
                            <span className="text-sm font-bold tracking-widest uppercase">Brand Film</span>
                        </button>
                    </motion.div>
                </div>
            </motion.section>

            {/* Animated Trust Bar */}
            <div className="border-y border-white/5 bg-white/[0.02] backdrop-blur-md relative z-20">
                <div className="max-w-screen-2xl mx-auto px-6 py-8 flex flex-wrap justify-between items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <motion.div whileHover={{ scale: 1.05, color: '#fff' }} className="flex items-center gap-3 cursor-default"><ShieldCheck className="w-5 h-5" /> 100% Authenticity Guaranteed</motion.div>
                    <motion.div whileHover={{ scale: 1.05, color: '#fff' }} className="flex items-center gap-3 cursor-default"><div className="w-1.5 h-1.5 rounded-full bg-white" /> Free Global Shipping</motion.div>
                    <motion.div whileHover={{ scale: 1.05, color: '#fff' }} className="flex items-center gap-3 cursor-default"><div className="w-1.5 h-1.5 rounded-full bg-white" /> 30-Day Complimentary Returns</motion.div>
                    <motion.div whileHover={{ scale: 1.05, color: '#fff' }} className="flex items-center gap-3 cursor-default"><div className="w-1.5 h-1.5 rounded-full bg-white" /> Secure Checkout</motion.div>
                </div>
            </div>

            {/* Interest Factor: Scrolling Values Marquee */}
            <div className="bg-white text-black py-4 overflow-hidden relative z-20">
                <div className="flex whitespace-nowrap animate-marquee font-black text-[10px] uppercase tracking-[0.5em]">
                    <span className="mx-8">Lumina Curated Excellence</span>
                    <span className="mx-8">Limited Edition Artifacts</span>
                    <span className="mx-8">Global Concierge Shipping</span>
                    <span className="mx-8">Precision Engineering</span>
                    <span className="mx-8">Sustainable Luxury</span>
                    <span className="mx-8">Lumina Curated Excellence</span>
                    <span className="mx-8">Limited Edition Artifacts</span>
                    <span className="mx-8">Global Concierge Shipping</span>
                    <span className="mx-8">Precision Engineering</span>
                    <span className="mx-8">Sustainable Luxury</span>
                </div>
            </div>


            {/* Editorial Showcase */}
            <section className="py-32 relative z-10 bg-[#050505]">
                <div className="max-w-screen-2xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
                        <div className="max-w-xl">
                            <h2 className="text-sm font-bold tracking-[0.2em] text-slate-500 uppercase mb-4">Latest Arrivals</h2>
                            <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight">
                                Designed for the <br /> meticulous eye.
                            </h3>
                        </div>
                        <button onClick={() => navigate('/products')} className="group flex items-center text-sm font-bold tracking-widest uppercase text-white hover:opacity-70 transition-opacity pb-2 border-b border-white">
                            View Full Catalog <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>

                    {/* Interest Factor: Limited Drop Countdown */}
                    <div className="mb-16 bg-white/[0.03] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2 block">Exclusive Drop</span>
                            <h4 className="text-2xl font-light text-white">The Onyx Collection — Midnight Release</h4>
                        </div>
                        <div className="flex gap-8 text-center">
                            <div><div className="text-3xl font-medium text-white tabular-nums">02</div><div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Days</div></div>
                            <div className="text-3xl font-light text-white/20">:</div>
                            <div><div className="text-3xl font-medium text-white tabular-nums">14</div><div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Hours</div></div>
                            <div className="text-3xl font-light text-white/20">:</div>
                            <div><div className="text-3xl font-medium text-white tabular-nums">59</div><div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Mins</div></div>
                        </div>
                        <button className="bg-white text-black px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
                            Notify Me
                        </button>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                key={product.id}
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="group cursor-pointer flex flex-col"
                            >
                                <div className="aspect-[3/4] bg-[#0a0a0a] relative overflow-hidden mb-6 border border-white/5 group-hover:border-white/20 transition-colors">
                                    <img src={HQA_IMAGES[i % HQA_IMAGES.length]} alt={product.name} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 duration-1000 ease-[0.16,1,0.3,1] opacity-80 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal" />

                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                                        <button className="w-full py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                                            Quick View
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="font-medium text-lg leading-snug text-white group-hover:text-slate-300 transition-colors">{product.name}</h3>
                                        <span className="text-lg font-light text-slate-400">₹{(product.price * 83).toFixed(0)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Immersive Parallax Banner */}
            <section className="h-[70vh] relative min-h-[600px] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-fixed bg-center mix-blend-luminosity opacity-40"></div>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tighter mb-8 max-w-4xl">
                        Uncompromising aesthetics. <br /> <span className="font-medium italic text-slate-300">Unrivaled performance.</span>
                    </h2>
                    <button onClick={() => navigate('/products')} className="group flex items-center gap-4 text-white text-xs font-bold uppercase tracking-widest border border-white/30 px-8 py-4 hover:bg-white hover:text-black transition-all">
                        Experience the collection <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            <Footer />

        </motion.div>
    );
}
