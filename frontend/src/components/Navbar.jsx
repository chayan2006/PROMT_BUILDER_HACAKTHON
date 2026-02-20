import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, UserPlus, LogIn } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'text-indigo-400 bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800';
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                        SaaS Starter
                    </span>
                </div>
                <div className="flex space-x-4">
                    <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition ${isActive('/')}`}>
                        <Home className="mr-2" size={16} />
                        Home
                    </Link>
                    <Link to="/subscription" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition ${isActive('/subscription')}`}>
                        <CreditCard className="mr-2" size={16} />
                        Subscription
                    </Link>
                    <Link to="/register" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition ${isActive('/register')}`}>
                        <UserPlus className="mr-2" size={16} />
                        Register
                    </Link>
                    <Link to="/login" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition ${isActive('/login')}`}>
                        <LogIn className="mr-2" size={16} />
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
