import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-xl font-bold font-['Syne'] tracking-wider flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent-n)] to-[var(--color-accent-p)] shadow-lg shadow-[var(--color-accent-n)]/20"></span>
                    Ecosystem.
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link to="/" className={`hover:text-[var(--color-accent-n)] transition-colors ${location.pathname === '/' ? 'text-[var(--color-accent-n)]' : 'text-[var(--color-text-primary)]'}`}>Home</Link>
                    <Link to="/marketplace" className="text-[var(--color-muted)] hover:text-[var(--color-text-primary)] transition-colors">Marketplace</Link>
                    <Link to="/login" className="text-[var(--color-muted)] hover:text-[var(--color-text-primary)] transition-colors">Sign In</Link>
                    <Link to="/register" className="px-5 py-2.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface2)] transition-colors">Get Started</Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-[var(--color-text-primary)]"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 bg-[var(--color-surface)] border-b border-[var(--color-border)] p-6 flex flex-col gap-6">
                    <Link to="/" onClick={() => setIsOpen(false)} className="text-lg">Home</Link>
                    <Link to="/marketplace" onClick={() => setIsOpen(false)} className="text-lg text-[var(--color-muted)]">Marketplace</Link>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg text-[var(--color-muted)]">Sign In</Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="px-5 py-3 rounded-md bg-[var(--color-text-primary)] text-[var(--color-bg)] font-bold text-center">Get Started</Link>
                </div>
            )}
        </nav>
    );
}
