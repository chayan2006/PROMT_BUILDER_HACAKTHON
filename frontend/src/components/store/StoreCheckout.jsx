import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, QrCode, CreditCard, Banknote, ShieldCheck, Loader2, Lock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';


export default function StoreCheckout() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [address, setAddress] = useState({ name: '', phone: '', pincode: '', detail: '' });
    const [paymentMethod, setPaymentMethod] = useState('upi');

    // Mock Cart Data
    const cartTotal = 249.99 + 145.00;
    const finalTotalINR = (cartTotal * 83).toFixed(0);

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1 && address.pincode.length === 6 && address.phone.length >= 10) {
            setStep(2);
        }
    };

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const payload = {
                customer_id: 1,
                items: [{ product_id: 1, quantity: 1 }, { product_id: 2, quantity: 1 }],
                payment_method: paymentMethod,
                shipping_address: `${address.name}, ${address.detail}, ${address.pincode}`
            };
            try {
                await axios.post('http://localhost:8000/api/p1/marketplace/checkout', payload);
            } catch (err) {
                console.log("Mocking backend checkout success for demo");
            }
            setStep(3);
            setTimeout(() => navigate('/orders'), 4000);
        } catch (error) {
            alert("Checkout processing error. Please try again.");
            setLoading(false);
        }
    };

    if (step === 3) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white font-sans">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="bg-[#0a0a0a] border border-white/10 p-16 rounded-[2rem] text-center max-w-lg w-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }} className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-10 border border-white/10">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-4xl font-light tracking-tighter mb-4">Secured & Confirmed.</h2>
                    <p className="text-slate-400 font-light leading-relaxed mb-12">Your exclusive items are being prepared for dispatch. A confirmation has been sent to your device.</p>

                    <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin text-white" /> Redirecting to Atelier...
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] font-sans text-white">
            <Navbar />


            <main className="max-w-screen-xl mx-auto px-6 pt-40 pb-24">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

                    {/* Checkout Flow Area */}
                    <div className="flex-1 max-w-2xl">
                        <h1 className="text-4xl font-light tracking-tighter mb-12">Checkout.</h1>

                        {/* Stepper Indicator */}
                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest mb-12">
                            <div className={`flex items-center gap-3 ${step === 1 ? 'text-white' : 'text-slate-600'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step === 1 ? 'border-white bg-white/10' : 'border-white/10 bg-transparent'}`}>1</div>
                                Delivery Intinerary
                            </div>
                            <div className="h-px w-12 bg-white/10"></div>
                            <div className={`flex items-center gap-3 ${step === 2 ? 'text-white' : 'text-slate-600'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step === 2 ? 'border-white bg-white/10' : 'border-white/10 bg-transparent'}`}>2</div>
                                Payment Gateway
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleNext} className="space-y-10">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Recipient Full Name</label>
                                                <input required value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} type="text" className="w-full bg-[#0a0a0a] border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-slate-700 font-light" placeholder="Jane Doe" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Mobile Contact</label>
                                                <input required value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} type="tel" className="w-full bg-[#0a0a0a] border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-slate-700 font-light" placeholder="+91 99999 99999" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Postal Code / Pincode</label>
                                            <input required minLength={6} maxLength={6} value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} type="text" className="w-full md:w-1/2 bg-[#0a0a0a] border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-slate-700 font-light tracking-[0.2em]" placeholder="110001" />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Estate / Building / Street</label>
                                            <textarea required value={address.detail} onChange={e => setAddress({ ...address, detail: e.target.value })} rows="2" className="w-full bg-[#0a0a0a] border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-slate-700 font-light resize-none" placeholder="Provide precise delivery instructions..."></textarea>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full h-16 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-3 group mt-8">
                                        Confirm Destination <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                                    <div className="bg-[#0a0a0a] border border-white/10 p-2">
                                        {/* UPI Option */}
                                        <label className={`block relative p-6 cursor-pointer border-b transition-colors ${paymentMethod === 'upi' ? 'bg-white/[0.04] border-white/20' : 'border-white/5 bg-transparent hover:bg-white/[0.02]'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase">
                                                    <input type="radio" value="upi" checked={paymentMethod === 'upi'} onChange={e => setPaymentMethod(e.target.value)} className="w-4 h-4 accent-white bg-transparent border-white/20" />
                                                    <span className="flex items-center gap-3"><QrCode size={18} className={paymentMethod === 'upi' ? 'text-white' : 'text-slate-500'} /> Unified Payments (UPI)</span>
                                                </div>
                                            </div>
                                            <p className="text-xs font-light text-slate-500 ml-[34px]">Immediate transfer via GPay, PhonePe, Paytm, or any BHIM app.</p>
                                        </label>

                                        {/* Card Option */}
                                        <label className={`block relative p-6 cursor-pointer border-b transition-colors ${paymentMethod === 'card' ? 'bg-white/[0.04] border-white/20' : 'border-white/5 bg-transparent hover:bg-white/[0.02]'}`}>
                                            <div className="flex items-center gap-4 mb-2 text-sm font-bold tracking-widest uppercase">
                                                <input type="radio" value="card" checked={paymentMethod === 'card'} onChange={e => setPaymentMethod(e.target.value)} className="w-4 h-4 accent-white bg-transparent border-white/20" />
                                                <span className="flex items-center gap-3"><CreditCard size={18} className={paymentMethod === 'card' ? 'text-white' : 'text-slate-500'} /> Global Credit / Debit Card</span>
                                            </div>
                                            <p className="text-xs font-light text-slate-500 ml-[34px]">Visa, Mastercard, Amex via secure Razorpay vault.</p>
                                        </label>

                                        {/* COD Option */}
                                        <label className={`block relative p-6 cursor-pointer border-b-0 transition-colors ${paymentMethod === 'cod' ? 'bg-white/[0.04] border-transparent' : 'border-transparent bg-transparent hover:bg-white/[0.02]'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase">
                                                    <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={e => setPaymentMethod(e.target.value)} className="w-4 h-4 accent-white bg-transparent border-white/20" />
                                                    <span className="flex items-center gap-3"><Banknote size={18} className={paymentMethod === 'cod' ? 'text-white' : 'text-slate-500'} /> Cash On Delivery</span>
                                                </div>
                                            </div>
                                            <p className="text-xs font-light text-slate-500 ml-[34px]">Standard delivery timelines apply. Subject to pin-code validation.</p>
                                        </label>
                                    </div>

                                    <button onClick={handleCheckout} disabled={loading} className="w-full h-16 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-3 mt-10 disabled:opacity-50">
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Authorize Payment — ₹${finalTotalINR}`}
                                        {!loading && <Lock className="w-3 h-3" />}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sticky Sidebar */}
                    <div className="w-full lg:w-[420px] shrink-0">
                        <div className="bg-[#080808] border border-white/10 p-10 sticky top-32">
                            <h3 className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-8 border-b border-white/10 pb-4">Acquisition Summary</h3>

                            <div className="space-y-6 mb-10">
                                <div className="flex items-start gap-5">
                                    <div className="w-20 h-24 bg-[#0a0a0a] relative overflow-hidden flex-shrink-0 border border-white/5">
                                        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80" alt="Item" />
                                    </div>
                                    <div className="flex-1 py-1">
                                        <p className="text-sm font-medium text-white mb-2 line-clamp-2">Premium Curated Sneaker Collection</p>
                                        <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Qty: 1</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm font-light text-slate-400 border-t border-white/10 pt-8 pb-8">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{finalTotalINR}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-white">Complimentary</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxes & Duties</span>
                                    <span className="text-white">Included</span>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-8">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-bold tracking-widest uppercase text-slate-500">Total</span>
                                    <span className="text-4xl font-light text-white tracking-tighter">₹{finalTotalINR}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
