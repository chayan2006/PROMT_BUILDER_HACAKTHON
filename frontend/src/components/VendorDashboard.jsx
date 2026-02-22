import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, BarChart3, Settings, LogOut, Store, ArrowUpRight } from 'lucide-react';

export default function VendorDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!userData) {
            navigate('/login');
            return;
        }

        const parsed = JSON.parse(userData);
        if (parsed.role !== 'vendor') {
            navigate('/');
            return;
        }
        setUser(parsed);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div></div>;

    const navItems = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white flex font-sans selection:bg-indigo-500/30">

            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col hidden md:flex shrink-0">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                            <Store className="w-4 h-4 text-white" />
                        </div>
                        Vendor Hub
                    </h2>
                    <p className="text-xs text-slate-400 mt-2 pl-10 truncate">{user.name}'s Store</p>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 mt-2">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium outline-none ${isActive
                                    ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800/50">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-400 font-bold hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-sm">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50 text-slate-900 border-l border-slate-800/30">
                <div className="max-w-[1280px] mx-auto p-8">
                    <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
                            <p className="text-sm font-medium text-slate-500 mt-1">Manage your store, track sales, and fulfill orders.</p>
                        </div>
                        <button className="px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                            <Package size={16} /> New Product
                        </button>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
                                <BarChart3 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
                            <div className="flex items-end gap-3">
                                <p className="text-3xl font-black text-slate-900 tracking-tight">₹0.00</p>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1 mb-1"><ArrowUpRight w={12} h={12} />0%</span>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 border border-indigo-100">
                                <Package className="w-5 h-5 text-indigo-600" />
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Products</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tight">0</p>
                            <p className="text-xs font-medium text-slate-400 mt-1">Ready to sell in marketplace</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 border border-amber-100">
                                <ShoppingBag className="w-5 h-5 text-amber-600" />
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Orders</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tight">0</p>
                            <p className="text-xs font-medium text-amber-600 mt-1">Requires immediate fulfillment</p>
                        </div>
                    </div>

                    {/* Content Area Based on Tab */}
                    {activeTab === 'overview' && (
                        <div className="p-12 rounded-2xl bg-white border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 mb-6">
                                <ShoppingBag size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
                            <p className="text-sm font-medium text-slate-500 max-w-sm mb-6">You don't have any products listed on the FinEcosystem marketplace yet. Start by adding your first product!</p>
                            <button className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-sm hover:bg-emerald-700 transition-colors">
                                Add First Product
                            </button>
                        </div>
                    )}

                    {activeTab !== 'overview' && (
                        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 font-medium">
                            This section is under construction.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
