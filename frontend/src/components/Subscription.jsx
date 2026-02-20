import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, CreditCard, ShieldCheck, User, Mail, Phone } from 'lucide-react';
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
        setMessage('Initializing payment...');

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
                name: "SaaS Application",
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
                                navigate('/register'); // or /dashboard
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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Subscribe to Pro
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your details to proceed
                    </p>
                </div>

                {/* Status Messages */}
                {status === 'success' && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Success! </strong>
                        <span className="block sm:inline">{message} Redirecting...</span>
                    </div>
                )}
                {status === 'error' && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error! </strong>
                        <span className="block sm:inline">{message}</span>
                    </div>
                )}

                {/* Plan Card */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                    <div className="px-6 py-6 border-b border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-gray-800">Test Plan (₹1)</h3>
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Best Value</span>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-extrabold text-gray-900">₹1</span>
                            <span className="text-gray-500 ml-1">/month</span>
                        </div>
                    </div>

                    <div className="px-6 py-6 space-y-6">
                        {/* User Inputs */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleChange}
                                        required
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2.5 border"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        required
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2.5 border"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={userData.phone}
                                        onChange={handleChange}
                                        required
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2.5 border"
                                        placeholder="+919999999999"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Used for WhatsApp notifications.</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSubscribe}
                            disabled={status === 'loading'}
                            className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white ${status === 'loading' ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                } transition duration-300`}
                        >
                            {status === 'loading' ? 'Processing...' : (
                                <>
                                    <CreditCard className="mr-2" size={20} />
                                    Proceed to Pay
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
