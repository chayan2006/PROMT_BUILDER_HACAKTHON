import React, { useState } from 'react';
import axios from 'axios';
import { User, MessageSquare, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('Registering...');

        try {
            const registerResponse = await axios.post('http://localhost:8000/register', {
                ...formData,
                // payment_id will be handled if passed via props or context in a real app, 
                // or we can allow registration without payment for this demo if reached directly
                payment_id: "PAYMENT_SKIPPED_OR_FROM_SUBSCRIPTION"
            });

            if (registerResponse.data.status === 'success') {
                setStatus('success');
                setMessage('Success! Check your email and WhatsApp for confirmation.');
                setFormData({ name: '', email: '', phone: '' });
            } else {
                setStatus('error');
                setMessage(registerResponse.data.message || 'Registration failed.');
            }
        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'Network error during registration.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-8">
                <button onClick={() => navigate('/')} className="text-sm text-indigo-500 mb-4 hover:underline">&larr; Back to Home</button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Integration Demo</h2>
                    <p className="text-gray-500">Test Transaction: ₹499</p>
                </div>

                {status === 'success' && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
                        <CheckCircle className="mr-2" size={20} />
                        {message}
                    </div>
                )}

                {status === 'error' && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                        <AlertCircle className="mr-2" size={20} />
                        {message}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                placeholder="Jane Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            placeholder="jane@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                placeholder="+919876543210"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Include country code (e.g., +91)</p>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={`w-full py-3 px-4 rounded-lg text-white font-bold transition duration-300 flex items-center justify-center ${status === 'loading'
                            ? 'bg-indigo-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                    >
                        {status === 'loading' ? 'Processing...' : (
                            <>
                                <User className="mr-2" size={20} />
                                Register Now
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
