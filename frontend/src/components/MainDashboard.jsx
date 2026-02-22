import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MarketplaceDashboard from './MarketplaceDashboard';
import FraudDashboard from './FraudDashboard';
import BudgetDashboard from './BudgetDashboard';
import Dashboard from './Dashboard';
import { Store, ShieldCheck, PieChart, Menu, X, User } from 'lucide-react';

export default function MainDashboard() {
    const [activeTab, setActiveTab] = useState('marketplace');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    if (!user) return null;

    const navItems = [
        { id: 'marketplace', label: 'Marketplace', icon: Store },
        { id: 'budget', label: 'Budget Planner', icon: PieChart },
        { id: 'fraud', label: 'Fraud Detection', icon: ShieldCheck },
        { id: 'profile', label: 'My Profile', icon: User },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col sm:flex-row bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">

            {/* Mesh Gradient Background Decor */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
            </div>

            {/* Mobile Header */}
            <div className="sm:hidden flex items-center justify-between p-5 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 z-[100]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <ShieldCheck size={18} className="text-white" />
                    </div>
                    <span className="font-black tracking-tight text-white italic">Lumina.</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-white/5 rounded-lg border border-white/10">
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <motion.nav
                initial={false}
                animate={{ width: isCollapsed ? '80px' : '280px' }}
                className={`${isMobileMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col bg-slate-900/40 backdrop-blur-2xl border-r border-white/5 shrink-0 z-50 absolute sm:static h-full min-h-screen transition-all duration-300 ease-in-out`}
            >
                <div className="p-8 hidden sm:flex items-center justify-between overflow-hidden whitespace-nowrap">
                    {!isCollapsed && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-baseline gap-2">
                            <h1 className="font-black text-2xl tracking-tighter text-white italic">Lumina.</h1>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2 py-0.5 rounded-full border border-indigo-400/20">Pro</span>
                        </motion.div>
                    )}
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className={`p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10 ${isCollapsed ? 'mx-auto' : ''}`}>
                        <Menu size={16} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 px-4 space-y-1 mt-4">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? 'bg-indigo-600/10 text-white border border-indigo-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <Icon size={isActive ? 20 : 18} className={`${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors shrink-0`} />
                                {!isCollapsed && (
                                    <span className="font-bold text-sm tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>
                                )}
                                {isActive && !isCollapsed && (
                                    <motion.div layoutId="activeIndicator" className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="p-6 mt-auto border-t border-white/5">
                    <div className={`flex items-center gap-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 ${isCollapsed ? 'p-1' : 'p-4'} transition-all`}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-black text-white shadow-xl shadow-indigo-500/20 shrink-0">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-left-2 transition-all">
                                <p className="text-xs font-black text-white truncate uppercase tracking-widest">{user.name || 'User'}</p>
                                <p className="text-[10px] font-bold text-slate-500 truncate capitalize mt-0.5">{user.role || 'Customer'}</p>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <button onClick={handleLogout} className="mt-4 w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20">
                            Terminate Session
                        </button>
                    )}
                </div>
            </motion.nav>

            {/* Main Content Render Area */}
            <main className="flex-1 overflow-hidden relative h-screen bg-slate-950">
                <div className="h-full overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar">
                    {/* Inner content wrapper with padding matching SaaS standards */}
                    <div className="min-h-full">
                        {activeTab === 'marketplace' && <MarketplaceDashboard />}
                        {activeTab === 'budget' && <BudgetDashboard />}
                        {activeTab === 'fraud' && <FraudDashboard />}
                        {activeTab === 'profile' && <Dashboard />}
                    </div>
                </div>
            </main>
        </div>
    );
}
