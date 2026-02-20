import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! How can I help you today?", sender: "bot" }
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
            const errorMessage = { text: "Sorry, I'm having trouble connecting to my brain right now.", sender: "bot" };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 h-96 rounded-lg shadow-xl border border-gray-200 flex flex-col mb-4 overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
                        <h3 className="font-bold flex items-center">
                            <MessageSquare className="mr-2" size={18} /> AI Assistant
                        </h3>
                        <button onClick={toggleChat} className="text-white hover:text-gray-200">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.sender === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-500 text-xs p-2 rounded-lg border border-gray-200 shadow-sm animate-pulse">
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-indigo-600 text-white px-3 py-2 rounded-r-lg hover:bg-indigo-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                >
                    <MessageSquare size={24} />
                    <span className="sr-only">Open Chat</span>
                </button>
            )}
        </div>
    );
};

export default Chatbot;
