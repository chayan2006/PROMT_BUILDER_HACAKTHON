import React from 'react';
import { motion } from 'framer-motion';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement
} from 'chart.js';
import { Wallet, TrendingDown, Target, BellRing, Sparkles, ArrowUpRight, Plus } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function BudgetDashboard() {
    const pieData = {
        labels: ['Housing', 'Food', 'Transport', 'Entertainment'],
        datasets: [
            {
                data: [45, 25, 15, 15],
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
                borderColor: 'transparent',
                borderWidth: 0,
            }
        ]
    };

    const barData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Actual Spend',
                data: [1200, 950, 1100, 450],
                backgroundColor: '#6366f1',
                borderRadius: 8,
            },
            {
                label: 'LSTM Prediction',
                data: [1150, 1000, 1050, 600],
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 8,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#64748b', font: { weight: 'bold', size: 10 } } }
        },
        scales: {
            x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } },
            y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#64748b', font: { weight: 'black', size: 9 }, padding: 20 } }
        }
    };

    const recentTxns = [
        { id: 'tx-1', desc: 'Uber Ride', cat: 'Transport', amount: '-$14.50', date: 'Today, 2:30 PM' },
        { id: 'tx-2', desc: 'Whole Foods Market', cat: 'Food', amount: '-$142.20', date: 'Yesterday' },
        { id: 'tx-3', desc: 'TechCorp Salary', cat: 'Income', amount: '+$4,200.00', date: 'Feb 15, 2026' },
        { id: 'tx-4', desc: 'Netflix Subscription', cat: 'Entertainment', amount: '-$15.99', date: 'Feb 10, 2026' },
    ];

    return (
        <div className="p-8 sm:p-12 animate-in fade-in duration-700 max-w-[1400px] mx-auto space-y-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
                    >
                        <Wallet size={12} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Fiscal Intelligence Unit</span>
                    </motion.div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white leading-[0.9]">
                        Capital <br />
                        <span className="text-slate-500">Flow.</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium mt-6">LSTM Neural Prediction & Real-Time Liquidity Monitoring</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all font-bold text-sm">
                        Export Ledger
                    </button>
                    <button className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95">
                        <Plus size={18} /> Initialize Entry
                    </button>
                </div>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <motion.div whileHover={{ y: -5 }} className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Liquidity Reserve</h4>
                    <div className="flex items-end gap-3">
                        <p className="text-4xl font-black text-white">$3,425.80</p>
                    </div>
                </motion.div>

                <div className="glass p-8 rounded-[2.5rem] border border-rose-500/20 flex flex-col justify-between shadow-xl bg-rose-500/5">
                    <div>
                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <BellRing size={14} /> Threshold Alert
                        </h4>
                        <p className="text-lg font-bold text-rose-100 leading-tight">Food velocity at 85% capacity</p>
                    </div>
                    <div className="w-full bg-rose-950/30 rounded-full h-1.5 mt-6 overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]" style={{ width: '85%' }}></div>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2.5rem] border border-indigo-500/20 md:col-span-2 flex gap-8 items-center shadow-xl relative overflow-hidden bg-indigo-500/5">
                    <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center shrink-0 border border-indigo-500/30">
                        <Sparkles size={28} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Predictive Synthesis</h4>
                        <p className="text-indigo-100 text-lg leading-relaxed font-medium">
                            Synthesizing coffee expenditure... <strong className="text-white font-black">$140</strong> detected. Redirecting to vacation fund hits goal 3 weeks early.
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts and Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Pie Chart */}
                <div className="glass p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-10 text-center">Allocation Matrix</h3>
                    <div className="w-full h-[280px]">
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>

                {/* Bar Chart vs LSTM */}
                <div className="glass p-10 rounded-[3rem] border border-white/5 shadow-2xl lg:col-span-2">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Actual vs. Neural Prediction</h3>
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black border border-indigo-500/20 uppercase tracking-widest">Model v2.4</span>
                    </div>
                    <div className="w-full h-[280px]">
                        <Bar data={barData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="glass rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden mb-20">
                <div className="px-10 py-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                    <h3 className="text-xl font-black tracking-tight text-white">Event Journal</h3>
                    <button className="text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-300 transition-colors">Expand Ledger</button>
                </div>
                <div className="divide-y divide-white/5">
                    {recentTxns.map((txn) => (
                        <div key={txn.id} className="p-8 px-10 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-all group">
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${txn.cat === 'Income' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-900 text-slate-500 border-white/5 group-hover:border-white/20'}`}>
                                    <TrendingDown size={20} className={`${txn.cat === 'Income' && 'rotate-180 text-emerald-500'}`} />
                                </div>
                                <div>
                                    <p className="font-bold text-white text-lg">{txn.desc}</p>
                                    <p className="text-[10px] text-slate-500 mt-1 font-black uppercase tracking-widest">{txn.cat} • {txn.date}</p>
                                </div>
                            </div>
                            <div className={`text-2xl font-black tracking-tighter ${txn.amount.startsWith('+') ? 'text-emerald-400' : 'text-slate-200'}`}>
                                {txn.amount}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
