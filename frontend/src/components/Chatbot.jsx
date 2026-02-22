import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! How can I help you navigate the FinEcosystem today?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            // Transform messages to Ollama format
            const history = newMessages.map(msg => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text
            }));

            // Check for logged in user
            let email = null;
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    email = JSON.parse(storedUser).email;
                } catch (e) { }
            }

            // Updated to point to our backend endpoint
            const response = await axios.post('http://localhost:8000/chat', {
                messages: history,
                model: "phi3", // Or make this configurable
                email: email
            });

            const botMessage = { text: response.data.response, sender: "bot" };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage = { text: "Network error. AI is currently offline.", sender: "bot" };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-slate-950 w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl shadow-indigo-900/20 border border-slate-800 flex flex-col mb-4 overflow-hidden animate-in zoom-in-95 duration-200 origin-bottom-right">
                    {/* Header */}
                    <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                        <h3 className="font-bold flex items-center text-sm md:text-base tracking-wide z-10">
                            <Bot className="mr-2" size={20} /> AI Co-pilot
                        </h3>
                        <button onClick={toggleChat} className="text-indigo-100 hover:text-white transition-colors bg-black/10 hover:bg-black/20 p-1.5 rounded-lg z-10">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-900 space-y-4 custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.sender === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-sm'
                                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm leading-relaxed'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 text-indigo-300 text-xs p-3 rounded-2xl rounded-bl-sm border border-slate-700 shadow-sm flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-500 font-medium transition-all shadow-inner"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className={`bg-indigo-600 text-white p-2.5 rounded-xl transition shadow-sm ${loading || !input.trim() ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-400' : 'hover:bg-indigo-500 hover:shadow-indigo-500/25 cursor-pointer'}`}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all duration-300 hover:scale-110 flex items-center justify-center border border-indigo-500"
                >
                    <MessageSquare size={24} />
                    <span className="sr-only">Open Chat</span>
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-400 border-2 border-slate-900"></span>
                    </span>
                </button>
            )}
        </div>
    );
};

export default Chatbot;
