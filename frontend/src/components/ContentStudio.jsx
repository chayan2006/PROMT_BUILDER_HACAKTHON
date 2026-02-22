import React, { useState, useEffect } from 'react';
import { PenTool, AlertCircle, CheckCircle, Zap, Loader2, Save } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const ContentStudio = () => {
    const [user, setUser] = useState(null);
    const [credits, setCredits] = useState(0);
    const [topic, setTopic] = useState("");
    const [tone, setTone] = useState("Professional");

    const [generating, setGenerating] = useState(false);
    const [article, setArticle] = useState("");
    const [error, setError] = useState("");

    // Load user and current credits on mount
    useEffect(() => {
        const fetchCredits = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                // Fetch latest credits from DB
                try {
                    const response = await axios.get(`http://localhost:8000/user/${parsedUser.email}`);
                    if (response.data.status === 'success' && response.data.user) {
                        setCredits(response.data.user.credits || 0);
                    }
                } catch (e) {
                    console.error("Could not fetch credits", e);
                }
            }
        };
        fetchCredits();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in to use the AI Content Studio.");
            return;
        }

        setError("");
        setArticle("");
        setGenerating(true);

        try {
            const response = await axios.post("http://localhost:8000/ai-writer", {
                email: user.email,
                topic: topic,
                tone: tone
            });

            if (response.data.status === "success") {
                setArticle(response.data.article);
                setCredits(response.data.credits_remaining);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("Network error connecting to AI service.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-white font-sans selection:bg-purple-500/30">
            <div className="max-w-[1280px] mx-auto space-y-8 animate-in fade-in duration-500">

                {/* Header & Credit Balance */}
                <div className="bg-slate-950 border border-slate-800 shadow-xl rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
                    <div>
                        <h2 className="text-3xl font-black text-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <PenTool className="h-5 w-5 text-white" />
                            </div>
                            AI Content Studio
                        </h2>
                        <p className="mt-2 text-sm text-slate-400 font-medium pl-14">
                            Generate high-quality blog posts and marketing copy instantly.
                        </p>
                    </div>

                    {/* Credit Counter Container */}
                    <div className="flex flex-col md:items-end">
                        <div className="flex items-center bg-purple-500/10 px-5 py-2.5 rounded-xl border border-purple-500/20 shadow-inner">
                            <Zap className={`h-5 w-5 ${credits > 0 ? "text-amber-400" : "text-slate-500"} mr-2 ${credits > 0 ? "animate-pulse" : ""}`} />
                            <span className="text-sm font-black tracking-wide text-purple-300 uppercase">{credits} Credits</span>
                        </div>
                        {credits <= 0 && (
                            <span className="text-xs text-rose-400 font-bold mt-2 px-2">Please upgrade to generate content.</span>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl bg-rose-500/10 p-4 border border-rose-500/20 flex items-center shadow-sm">
                        <AlertCircle className="h-5 w-5 text-rose-400 mr-3 shrink-0" />
                        <span className="text-sm font-medium text-rose-200">{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-full">

                    {/* Left Column: Input Form */}
                    <div className="xl:col-span-1 h-full">
                        <div className="bg-slate-950 border border-slate-800 shadow-xl rounded-2xl p-6 md:p-8 h-full">
                            <form onSubmit={handleGenerate} className="space-y-6 h-full flex flex-col">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">What should I write about?</label>
                                    <textarea
                                        required
                                        rows="6"
                                        placeholder="e.g. 5 Benefits of moving your infrastructure to the cloud in 2026..."
                                        className="mt-1 block w-full bg-slate-900 border border-slate-700 rounded-xl shadow-inner py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm placeholder:text-slate-600 font-medium resize-none transition-all"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        disabled={generating || credits <= 0}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Tone</label>
                                    <select
                                        className="mt-1 block w-full bg-slate-900 border border-slate-700 rounded-xl shadow-inner py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-medium transition-all"
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        disabled={generating || credits <= 0}
                                    >
                                        <option value="Professional" className="bg-slate-900 text-white">Professional</option>
                                        <option value="Casual" className="bg-slate-900 text-white">Casual</option>
                                        <option value="Humorous" className="bg-slate-900 text-white">Humorous</option>
                                        <option value="Persuasive" className="bg-slate-900 text-white">Persuasive (Sales)</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={generating || credits <= 0 || !topic.trim()}
                                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 transition-all mt-6"
                                >
                                    {generating ? (
                                        <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Generating Masterpiece...</>
                                    ) : (
                                        <>Generate Article <span className="ml-2 px-2 py-0.5 bg-purple-900/50 rounded-md text-[10px]">1 Credit</span></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Editor Output */}
                    <div className="xl:col-span-2">
                        <div className="bg-slate-950 border border-slate-800 shadow-xl rounded-2xl h-[600px] xl:h-[700px] flex flex-col overflow-hidden">
                            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <PenTool className="w-4 h-4" /> AI Output Canvas
                                </h3>
                                {article && (
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            <CheckCircle className="h-3 w-3 mr-1.5" /> Generated
                                        </span>
                                        <button className="text-slate-400 hover:text-white p-1 transition-colors group relative">
                                            <Save size={16} />
                                            <span className="absolute -top-8 -left-3 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Save</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 md:p-8 flex-1 overflow-y-auto prose prose-invert prose-purple max-w-none prose-sm sm:prose-base custom-scrollbar bg-slate-900/30">
                                {article ? (
                                    <ReactMarkdown>{article}</ReactMarkdown>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
                                            <PenTool size={24} className="text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-400">Your beautifully structured article</p>
                                            <p className="text-sm">will appear here, ready for publishing.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContentStudio;
