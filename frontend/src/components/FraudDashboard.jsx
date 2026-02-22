import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, GitCommit, CheckCircle, Database, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function FraudDashboard() {
    const chartData = {
        labels: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'],
        datasets: [
            {
                fill: true,
                label: 'Risk Score',
                data: [12, 19, 15, 87, 22, 14, 18],
                borderColor: '#f43f5e',
                backgroundColor: 'rgba(244, 63, 94, 0.05)',
                tension: 0.4,
                pointRadius: 0,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { min: 0, max: 100, ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } }
        }
    };

    const alerts = [
        { id: 'TRX-948', amount: '$4,500.00', score: 92, reason: 'Velocity + Geo Mismatch', status: 'CRITICAL', time: '2m ago' },
        { id: 'TRX-941', amount: '$120.50', score: 75, reason: 'New IP Address', status: 'HIGH', time: '12m ago' },
        { id: 'TRX-938', amount: '$8,000.00', score: 88, reason: 'Amount Deviation', status: 'HIGH', time: '18m ago' },
        { id: 'TRX-931', amount: '$99.99', score: 82, reason: 'Device Spoofing', status: 'HIGH', time: '35m ago' },
    ];

    return (
        <div className="p-8 sm:p-12 animate-in fade-in duration-700 max-w-[1400px] mx-auto space-y-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6"
                    >
                        <ShieldAlert size={12} className="text-rose-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-300">Neural Defense Layer v4.0</span>
                    </motion.div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white leading-[0.9]">
                        Cyber <br />
                        <span className="text-slate-500">Sentinel.</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium mt-6">Real-Time XGBoost Analysis & Autonomous Transaction Guard</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Kafka Streams Synced
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Chart */}
                <div className="lg:col-span-2 glass border border-white/5 p-10 rounded-[3rem] shadow-2xl flex flex-col">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-10 flex items-center gap-2">
                        <Activity size={14} className="text-rose-500" />
                        Risk Trajectory <span className="text-slate-700 ml-2">Real-time Stream</span>
                    </h3>
                    <div className="h-[300px] w-full">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                    <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/5 pt-10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Inference Latency</p>
                            <p className="text-3xl font-black text-white tracking-tighter">84ms</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Throughput</p>
                            <p className="text-3xl font-black text-white tracking-tighter">1.2k <span className="text-xs text-slate-500">TPS</span></p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Neural Kernel</p>
                            <p className="text-3xl font-black text-indigo-400 tracking-tighter">XGB-v2</p>
                        </div>
                    </div>
                </div>

                {/* Alert Queue */}
                <div className="glass border border-white/5 rounded-[3rem] shadow-2xl flex flex-col h-full overflow-hidden">
                    <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                        <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-3">
                            <Zap size={18} className="text-amber-400" /> Alert Queue
                        </h3>
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest">{alerts.length} Node Alerts</span>
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                        {alerts.map(alert => (
                            <motion.div
                                key={alert.id}
                                whileHover={{ scale: 1.02 }}
                                className="p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] shadow-inner hover:border-rose-500/30 transition-all group cursor-pointer relative overflow-hidden"
                            >
                                {alert.status === 'CRITICAL' && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col">
                                        <span className="font-black text-xs text-slate-400 uppercase tracking-widest">{alert.id}</span>
                                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">{alert.time}</span>
                                    </div>
                                    <span className={`text-[9px] font-black px-2 py-1 uppercase tracking-[0.1em] rounded border ${alert.status === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        }`}>
                                        Risk: {alert.score}
                                    </span>
                                </div>
                                <p className="text-2xl font-black text-white tracking-tighter">{alert.amount}</p>
                                <p className="text-[10px] font-black text-slate-500 truncate mt-4 bg-slate-900/50 inline-block px-3 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">{alert.reason}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ML Audit Log */}
            <div className="glass border border-white/5 py-10 rounded-[3rem] shadow-2xl overflow-hidden mb-20">
                <div className="px-10 mb-10 flex items-center justify-between">
                    <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-3">
                        <Database size={20} className="text-indigo-400" />
                        Audit Intelligence Ledger
                    </h3>
                    <button className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]">Stream Logs</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white/[0.02] border-y border-white/5">
                            <tr>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Timestamp</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Trace ID</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Probability</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">SHAP Inference</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Protocol Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { ts: '10:14:22Z', id: 'TRX-948', score: 92, feat: 'Distance Vector', action: 'Auto-Blocked', color: 'rose' },
                                { ts: '10:11:05Z', id: 'TRX-901', score: 12, feat: 'Device Match', action: 'Cleared', color: 'emerald' },
                                { ts: '09:55:12Z', id: 'TRX-882', score: 45, feat: 'Amount Delta', action: 'Investigating', color: 'amber' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-white/[0.01] transition-all group">
                                    <td className="px-10 py-6 font-mono text-slate-500 text-xs">{row.ts}</td>
                                    <td className="px-10 py-6 font-black text-white">{row.id}</td>
                                    <td className="px-10 py-6">
                                        <span className={`text-${row.color}-400 font-black bg-${row.color}-500/10 px-3 py-1.5 rounded-xl border border-${row.color}-500/20`}>
                                            {row.score}%
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 bg-white/5 rounded-full h-1 overflow-hidden">
                                                <div className={`bg-${row.color}-500 h-full rounded-full transition-all`} style={{ width: `${row.score}%` }}></div>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{row.feat}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`text-${row.color}-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2`}>
                                            {row.action === 'Auto-Blocked' ? <ShieldAlert size={14} /> : row.action === 'Cleared' ? <CheckCircle size={14} /> : <Activity size={14} />}
                                            {row.action}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
