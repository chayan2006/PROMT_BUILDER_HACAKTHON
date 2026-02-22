import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, CreditCard, ShieldCheck, User, Mail, Phone, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!userData.name || !userData.email || !userData.phone) {
            setStatus('error');
            setMessage('Please fill in all details before subscribing.');
            return;
        }

        setStatus('loading');
        setMessage('Initializing payment gateway...');

        try {
            // 1. Create Order
            const orderResponse = await axios.post('http://localhost:8000/create-order', {
                amount: 1,
                currency: "INR"
            });

            if (orderResponse.data.status !== 'success') {
                throw new Error(orderResponse.data.message || 'Failed to create order');
            }

            const { order } = orderResponse.data;

            // 2. Open Razorpay
            const options = {
                key: "rzp_test_SI8L88vlGdedEy",
                amount: order.amount,
                currency: order.currency,
                name: "FinEcosystem Pro",
                description: "Pro Plan Subscription",
                order_id: order.id,
                handler: async function (response) {
                    // 3. On Payment Success
                    console.log("Payment Successful", response);
                    setMessage('Payment successful! Registering your account...');

                    try {
                        const registerResponse = await axios.post('http://localhost:8000/register', {
                            name: userData.name,
                            email: userData.email,
                            phone: userData.phone,
                            payment_id: response.razorpay_payment_id
                        });

                        if (registerResponse.data.status === 'success') {
                            setStatus('success');
                            setMessage('Success! Account registered and payment verified.');

                            // Optional: Redirect
                            setTimeout(() => {
                                navigate('/login');
                            }, 2000);
                        } else {
                            setStatus('error');
                            setMessage('Payment successful but registration failed. Please contact support.');
                        }
                    } catch {
                        setStatus('error');
                        setMessage('Network error during registration. Please contact support.');
                    }
                },
                prefill: {
                    name: userData.name,
                    email: userData.email,
                    contact: userData.phone
                },
                theme: {
                    color: "#4F46E5"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                setStatus('error');
                setMessage(response.error.description);
            });
            rzp1.open();

        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'Payment initialization failed.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30">
            <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6">
                        <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight">
                        Go Pro
                    </h2>
                    <p className="mt-3 text-sm font-medium text-slate-400">
                        Unlock powerful tools to scale your business.
                    </p>
                </div>

                {/* Status Messages */}
                {status === 'success' && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in" role="alert">
                        <CheckCircle className="w-5 h-5 shrink-0" />
                        <div>
                            <strong className="font-bold text-sm block">Success!</strong>
                            <span className="text-xs">{message} Redirecting...</span>
                        </div>
                    </div>
                )}
                {status === 'error' && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in" role="alert">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <div>
                            <strong className="font-bold text-sm block">Error</strong>
                            <span className="text-xs">{message}</span>
                        </div>
                    </div>
                )}

                {/* Plan Card */}
                <div className="bg-slate-950 shadow-2xl rounded-2xl overflow-hidden border border-slate-800 relative">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                    <div className="px-6 md:px-8 py-8 border-b border-slate-800 bg-slate-900/50">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Startup Plan</h3>
                            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md border border-indigo-500/20">Early Access</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black text-white tracking-tighter">₹1</span>
                            <span className="text-slate-500 font-medium">/month</span>
                        </div>
                        <p className="mt-4 text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 inline-block px-2.5 py-1 rounded border border-emerald-500/20">
                            <ShieldCheck className="w-3.5 h-3.5" /> Special valid for first 1,000 users.
                        </p>
                    </div>

                    <div className="px-6 md:px-8 py-8 space-y-6">
                        {/* User Inputs */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleChange}
                                        required
                                        className="focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 bg-slate-900 border-slate-700 text-white rounded-xl py-3 px-4 sm:text-sm font-medium transition-all shadow-inner placeholder:text-slate-600"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        required
                                        className="focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 bg-slate-900 border-slate-700 text-white rounded-xl py-3 px-4 sm:text-sm font-medium transition-all shadow-inner placeholder:text-slate-600"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={userData.phone}
                                        onChange={handleChange}
                                        required
                                        className="focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 bg-slate-900 border-slate-700 text-white rounded-xl py-3 px-4 sm:text-sm font-medium transition-all shadow-inner placeholder:text-slate-600"
                                        placeholder="+919999999999"
                                    />
                                </div>
                                <p className="mt-2 text-[11px] font-medium text-slate-500 flex items-center gap-1.5">Used securely for WhatsApp notifications.</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSubscribe}
                            disabled={status === 'loading'}
                            className={`w-full flex items-center justify-center px-4 py-3.5 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white transition-all mt-4 ${status === 'loading' ? 'bg-indigo-500/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25'
                                }`}
                        >
                            {status === 'loading' ? (
                                <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</span>
                            ) : (
                                <>
                                    <CreditCard className="mr-2 w-4 h-4 text-indigo-200" />
                                    Proceed to UPI / Card Payment
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
