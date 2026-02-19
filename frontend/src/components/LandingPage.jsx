import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Users, Trophy, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            {/* Hero Section */}
            <div className="container mx-auto px-6 py-20 text-center">
                <div className="mb-8 flex justify-center">
                    <Code size={64} className="text-indigo-400" />
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                    Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">SaaS Starter</span> Kit
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
                    Launch your next project in minutes. Pre-configured with Supabase, Razorpay, and Twilio/Resend notifications.
                </p>
                <button
                    onClick={() => navigate('/subscription')}
                    className="group bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105 flex items-center mx-auto"
                >
                    View Demo
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition" />
                </button>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition">
                    <Users className="text-indigo-400 mb-4" size={40} />
                    <h3 className="text-2xl font-bold mb-2">User Management</h3>
                    <p className="text-gray-400">Integrated Supabase authentication and database storage for user profiles.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition">
                    <Code className="text-purple-400 mb-4" size={40} />
                    <h3 className="text-2xl font-bold mb-2">Payment Ready</h3>
                    <p className="text-gray-400">Razorpay integration out of the box. Accept payments and webhook events seamlessly.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition">
                    <Trophy className="text-green-400 mb-4" size={40} />
                    <h3 className="text-2xl font-bold mb-2">Instant Alerts</h3>
                    <p className="text-gray-400">Automated WhatsApp and Email notifications using Twilio and Resend.</p>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center py-8 text-gray-500 text-sm">
                © 2026 SaaS Starter Framework. Built for speed.
            </footer>
        </div>
    );
};

export default LandingPage;
