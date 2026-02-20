import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, UserPlus, LogIn, Database, Globe, Loader2, PenTool } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'text-indigo-400 bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800';
    };

    // --- AI Translator State ---
    const [targetLang, setTargetLang] = useState('English');
    const [isTranslating, setIsTranslating] = useState(false);

    // UI Strings mapping
    const [strings, setStrings] = useState({
        brand: "SaaS Starter",
        home: "Home",
        subscribe: "Subscription",
        register: "Register",
        login: "Login",
        dashboard: "Dashboard",
        admin: "Admin",
        studio: "AI Studio"
    });

    const handleLanguageChange = async (e) => {
        const lang = e.target.value;
        setTargetLang(lang);

        if (lang === 'English') {
            setStrings({
                brand: "SaaS Starter",
                home: "Home",
                subscribe: "Subscription",
                register: "Register",
                login: "Login",
                dashboard: "Dashboard",
                admin: "Admin Panel"
            });
            return;
        }

        setIsTranslating(true);
        try {
            // Collect words to translate to batch
            const wordsToTranslate = ["SaaS Starter", "Home", "Subscription", "Register", "Login", "Dashboard", "Admin Panel"];

            // Translate the string joined with |
            const response = await axios.post('http://localhost:8000/translate', {
                text: wordsToTranslate.join(" | "),
                target_language: lang
            });

            if (response.data.status === 'success') {
                const translatedArray = response.data.translated_text.split("|").map(s => s.trim());
                if (translatedArray.length === 7) {
                    setStrings({
                        brand: translatedArray[0],
                        home: translatedArray[1],
                        subscribe: translatedArray[2],
                        register: translatedArray[3],
                        login: translatedArray[4],
                        dashboard: translatedArray[5],
                        admin: translatedArray[6]
                    });
                }
            }
        } catch (error) {
            console.error("Translation failed", error);
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 flex flex-wrap">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center w-full">
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                        {strings.brand}
                    </span>
                </div>

                <div className="flex items-center space-x-4">
                    {/* AI Language Picker */}
                    <div className="flex items-center border border-gray-700 rounded-md px-2 py-1 mr-2 text-gray-300">
                        {isTranslating ? <Loader2 className="h-4 w-4 text-indigo-400 animate-spin mr-2" /> : <Globe className="h-4 w-4 text-indigo-400 mr-2" />}
                        <select
                            className="bg-transparent text-sm focus:outline-none appearance-none"
                            value={targetLang}
                            onChange={handleLanguageChange}
                            disabled={isTranslating}
                        >
                            <option value="English" className="text-gray-900">English</option>
                            <option value="Spanish" className="text-gray-900">Español</option>
                            <option value="French" className="text-gray-900">Français</option>
                            <option value="German" className="text-gray-900">Deutsch</option>
                            <option value="Hindi" className="text-gray-900">हिंदी</option>
                            <option value="Japanese" className="text-gray-900">日本語</option>
                        </select>
                    </div>

                    <div className="hidden md:flex space-x-4">
                        <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition ${isActive('/')}`}>
                            <Home className="mr-2" size={16} />
                            {strings.home}
                        </Link>
                        <Link to="/subscription" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition ${isActive('/subscription')}`}>
                            <CreditCard className="mr-2" size={16} />
                            {strings.subscribe}
                        </Link>
                        <Link to="/register" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition ${isActive('/register')}`}>
                            <UserPlus className="mr-2" size={16} />
                            {strings.register}
                        </Link>
                        <Link to="/login" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition ${isActive('/login')}`}>
                            <LogIn className="mr-2" size={16} />
                            {strings.login}
                        </Link>
                        <Link to="/studio" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition ${isActive('/studio')}`}>
                            <PenTool className="mr-2" size={16} />
                            {strings.studio}
                        </Link>
                        <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition ${isActive('/dashboard')}`}>
                            <UserPlus className="mr-2" size={16} />
                            {strings.dashboard}
                        </Link>
                        <Link to="/admin" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition ${isActive('/admin')}`}>
                            <Database className="mr-2" size={16} />
                            {strings.admin}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
