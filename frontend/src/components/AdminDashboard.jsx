import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, Search, Users, Activity, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const navigate = useNavigate();

    // AI Chat State
    const [query, setQuery] = useState("");
    const [analysis, setAnalysis] = useState("");
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/admin/users');
            if (response.data.status === 'success') {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error("Error fetching users", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setAnalyzing(true);
        setAnalysis("");

        try {
            const response = await axios.post('http://localhost:8000/admin/analyze', { query });
            if (response.data.status === 'success') {
                setAnalysis(response.data.analysis);
            } else {
                setAnalysis("Error analyzing data: " + response.data.message);
            }
        } catch (error) {
            setAnalysis("Network error connecting to AI.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/30 selection:text-black">
            {/* Header Area */}
            <div className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl h-20 px-6 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/login')} className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={16} /> Logout Access
                    </button>
                    <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
                    <div>
                        <h2 className="text-sm font-bold tracking-widest uppercase text-white flex items-center gap-3">
                            <Database className="w-4 h-4 text-slate-400" />
                            Command Center
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Clients</p>
                    <p className="text-sm font-light text-white ml-2">{users.length}</p>
                </div>
            </div>

            <div className="max-w-screen-2xl mx-auto p-6 md:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12">

                {/* Left Column: AI Data Analyst */}
                <div className="lg:w-1/3 flex flex-col h-[600px]">
                    <h3 className="text-3xl font-light tracking-tighter mb-2">Lumina Intelligence.</h3>
                    <p className="text-slate-500 text-sm font-light leading-relaxed mb-8">Query your business analytics in plain English utilizing the onboard neural engine.</p>

                    <div className="flex-1 flex flex-col border border-white/10 bg-[#0a0a0a]">
                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                            {analyzing ? (
                                <div className="flex flex-col items-center justify-center h-full text-white">
                                    <Loader2 className="h-6 w-6 animate-spin mb-4" />
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Processing Data...</p>
                                </div>
                            ) : analysis ? (
                                <div className="text-slate-300 text-sm font-light leading-relaxed whitespace-pre-wrap">
                                    {analysis}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <Activity className="w-6 h-6 text-slate-700 mb-4" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Awaiting Query</p>
                                    <p className="text-xs text-slate-600 font-light">"How many vendors are active?"</p>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleAnalyze} className="p-4 border-t border-white/10 bg-white/[0.02]">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Ask the neural engine..."
                                    className="w-full bg-transparent border-b border-white/20 pl-0 pr-12 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-slate-600 font-light"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    disabled={analyzing}
                                />
                                <button
                                    type="submit"
                                    disabled={analyzing || !query.trim()}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
                                >
                                    <Search className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Data Table */}
                <div className="lg:w-2/3 flex flex-col h-[600px]">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h3 className="text-3xl font-light tracking-tighter mb-2">Client Registry.</h3>
                            <p className="text-slate-500 text-sm font-light">Comprehensive overview of all platform members.</p>
                        </div>
                        <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 relative"><span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"></span></span> Live Sync
                        </span>
                    </div>

                    <div className="flex-1 overflow-auto border border-white/10 bg-[#0a0a0a] custom-scrollbar">
                        {loadingData ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="h-6 w-6 animate-spin text-white" />
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">ID</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Identity</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Contact</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Clearance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, i) => (
                                        <tr key={user.id} className={`group border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i === users.length - 1 ? 'border-b-0' : ''}`}>
                                            <td className="px-6 py-4 text-xs font-light text-slate-500">#{user.id || Math.floor(Math.random() * 1000)}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-white group-hover:text-slate-300 transition-colors">{user.name}</td>
                                            <td className="px-6 py-4 text-xs font-light text-slate-400">{user.mobile || user.email}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest ${user.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                        {user.status || 'Active'}
                                                    </span>
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                                                        {user.role || 'Client'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-16 text-center text-sm font-light text-slate-500">
                                                Registry is empty.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
