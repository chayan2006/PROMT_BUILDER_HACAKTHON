import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Rocket, Heart, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from './shared/Navbar';


export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isDesktop = windowWidth >= 1024;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            setTimeout(() => {
                let role = 'user';
                let redirectUrl = '/products';

                if (email.includes('admin') || password === 'admin123') {
                    role = 'admin';
                    redirectUrl = '/admin';
                }

                localStorage.setItem('user', JSON.stringify({
                    id: 1,
                    name: role === 'admin' ? 'System Administrator' : 'Guest Customer',
                    email: email,
                    role: role,
                    token: 'mock-jwt-token-7a8b9c'
                }));

                navigate(redirectUrl);
                setLoading(false);
            }, 1000);
        } catch (err) {
            setError('Authentication failed. Please check your credentials.');
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setLoading(true);
        setTimeout(() => {
            localStorage.setItem('user', JSON.stringify({
                id: 1,
                name: 'Google User',
                email: 'user@google.com',
                role: 'user',
                token: 'mock-google-token'
            }));
            navigate('/products');
            setLoading(false);
        }, 1500);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#050B14',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>

            <Navbar />

            {/* Animated Background Gradients using Inline Styles */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
                zIndex: 0
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '60vw',
                    height: '60vw',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
                    filter: 'blur(80px)'
                }} />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-10%',
                    width: '60vw',
                    height: '60vw',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)',
                    filter: 'blur(80px)'
                }} />
            </div>

            {/* Main Content Container */}
            <div style={{
                width: '100%',
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '2rem',
                display: 'flex',
                flexDirection: isDesktop ? 'row' : 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 10,
                minHeight: '80vh'
            }}>

                {/* Left Column: Branding & Tagline */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        width: isDesktop ? '50%' : '100%',
                        marginTop: isDesktop ? '0' : '4rem',
                        marginBottom: isDesktop ? '0' : '3rem',
                        paddingRight: isDesktop ? '3rem' : '0',
                        textAlign: isDesktop ? 'left' : 'center'
                    }}
                >



                    <h1 style={{
                        fontSize: isDesktop ? '3.5rem' : '2.5rem',
                        lineHeight: '1.1',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Modern commerce <br /> <span style={{
                            background: 'linear-gradient(to right, #818cf8, #c084fc)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Defined.</span>
                    </h1>

                    <p style={{
                        color: '#94a3b8',
                        fontSize: '1.125rem',
                        lineHeight: '1.6',
                        maxWidth: '440px',
                        marginBottom: '3rem',
                        margin: isDesktop ? '0 0 3rem 0' : '0 auto 3rem auto'
                    }}>
                        The elite standard for global brands. Experience frictionless checkout and real-time logistics tracking.
                    </p>

                    {isDesktop && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', padding: '10px' }}>
                                    <Package style={{ width: '100%', height: '100%', color: '#818cf8' }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Global Logistics</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Track every movement.</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', padding: '10px' }}>
                                    <Rocket style={{ width: '100%', height: '100%', color: '#c084fc' }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Speed Checkout</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>One-click secure payment.</div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Right Column: Login Card with Robust Inline Glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                        width: isDesktop ? '440px' : '100%',
                        maxWidth: '440px'
                    }}
                >
                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        padding: isDesktop ? '3rem' : '2rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <h2 style={{ fontSize: '1.875rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Account access</h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '500' }}>Enter your details below.</p>
                        </div>

                        {error && (
                            <div style={{
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '12px',
                                color: '#fca5a5',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#cbd5e1' }}>Email address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        padding: '0.875rem 1rem',
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#cbd5e1' }}>Password</label>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#818cf8', cursor: 'pointer' }}>Reset password?</span>
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        padding: '0.875rem 1rem',
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    marginTop: '1rem',
                                    background: 'linear-gradient(to right, #6366f1, #a855f7)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '0.875rem',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                                    opacity: loading ? 0.7 : 1,
                                    transition: 'transform 0.2s ease-in-out'
                                }}
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign in'}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                            <span style={{ fontSize: '0.625rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Or continue with</span>
                            <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                opacity: loading ? 0.7 : 1
                            }}>
                            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Google
                        </button>

                        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                            New here? <Link to="/register" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>Start a free account</Link>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
