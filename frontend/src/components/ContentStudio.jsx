import React, { useState, useEffect } from 'react';
import { PenTool, AlertCircle, CheckCircle, Zap, Loader2 } from 'lucide-react';
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header & Credit Balance */}
                <div className="bg-white shadow rounded-lg p-6 border-l-4 border-purple-600 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
                            <PenTool className="mr-3 h-8 w-8 text-purple-600" />
                            AI Content Studio
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Generate high-quality blog posts and marketing copy instantly.
                        </p>
                    </div>

                    {/* Credit Counter Container */}
                    <div className="flex flex-col items-end">
                        <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg border border-purple-100">
                            <Zap className={`h-5 w-5 ${credits > 0 ? "text-yellow-500" : "text-gray-400"} mr-2`} />
                            <span className="text-sm font-bold text-purple-900">{credits} Credits</span>
                        </div>
                        {credits <= 0 && (
                            <span className="text-xs text-red-500 font-medium mt-1">Please upgrade to generate content.</span>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4 border border-red-200 flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                        <span className="text-sm text-red-800">{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Input Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg p-6">
                            <form onSubmit={handleGenerate} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">What should I write about?</label>
                                    <textarea
                                        required
                                        rows="4"
                                        placeholder="e.g. 5 Benefits of moving your infrastructure to the cloud in 2026..."
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        disabled={generating || credits <= 0}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Select Tone</label>
                                    <select
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        disabled={generating || credits <= 0}
                                    >
                                        <option value="Professional">Professional</option>
                                        <option value="Casual">Casual</option>
                                        <option value="Humorous">Humorous</option>
                                        <option value="Persuasive">Persuasive (Sales)</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={generating || credits <= 0 || !topic.trim()}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                                >
                                    {generating ? (
                                        <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Generating...</>
                                    ) : (
                                        `Generate Article (1 Credit)`
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Editor Output */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg h-full min-h-[500px] flex flex-col overflow-hidden">
                            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">AI Output Canvas</h3>
                                {article && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Saved</span>}
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto prose prose-purple max-w-none prose-sm sm:prose-base">
                                {article ? (
                                    <ReactMarkdown>{article}</ReactMarkdown>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 italic text-center">
                                        Your perfectly structured article will appear here...<br />Ready for publishing!
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
