import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Package, ShieldCheck, PieChart, LogOut, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Shop', path: '/products' },
        { name: 'Sell on Lumina', path: '/sell-on-lumina' },
        { name: 'Analytics', path: '/dashboard' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isStorePath = location.pathname === '/' || location.pathname.startsWith('/product') || location.pathname === '/products' || location.pathname === '/cart' || location.pathname === '/checkout';

    return (
        <nav
            className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className={`relative flex items-center justify-between p-2 rounded-2xl transition-all duration-500 ${isScrolled
                    ? 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                    : 'bg-transparent border border-transparent'
                    }`}>

                    {/* Brand */}
                    <div
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 cursor-pointer group px-3"
                    >
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl transition-all group-hover:bg-indigo-500 group-hover:scale-110 shadow-lg shadow-indigo-600/20">
                            L
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white hidden sm:block">Lumina</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-white/5 ${location.pathname === link.path ? 'text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 px-3">
                        <button
                            onClick={() => navigate('/products')}
                            className="hidden sm:flex p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <Search size={20} />
                        </button>

                        <button
                            onClick={() => navigate('/cart')}
                            className="relative p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#050B14]">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center gap-2 pl-2 border-l border-white/10 ml-2"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-500/20">
                                        {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                    </div>
                                    <span className="hidden lg:block text-xs font-bold text-white max-w-[80px] truncate">{user.name}</span>
                                </button>

                                <AnimatePresence>
                                    {userDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-4 w-56 bg-[#050B14] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-[110]"
                                        >
                                            <div className="px-3 py-2 border-b border-white/10 mb-2">
                                                <p className="text-[10px] uppercase tracking-wider font-black text-slate-500">Connected as</p>
                                                <p className="text-sm font-bold text-white truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => { navigate(user.role === 'admin' ? '/admin' : '/orders'); setUserDropdownOpen(false); }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                            >
                                                <Package size={16} /> Orders & Returns
                                            </button>
                                            <button
                                                onClick={() => { navigate('/dashboard'); setUserDropdownOpen(false); }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                            >
                                                <ShieldCheck size={16} /> Security Settings
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-400/5 rounded-xl transition-all mt-1"
                                            >
                                                <LogOut size={16} /> Termination
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="ml-4 px-6 py-2 bg-white text-black text-sm font-bold rounded-xl hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                            >
                                Get Started
                            </button>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-white ml-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-full inset-x-0 mt-4 px-6"
                    >
                        <div className="bg-[#050B14]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-lg font-bold text-slate-300 hover:text-white px-4 py-2"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {!user && (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
