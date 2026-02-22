import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Loader2, Store, UserRound, FileCheck, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from './shared/Navbar';


export default function RegistrationForm() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [role, setRole] = useState('customer'); // customer or vendor
    const [gstin, setGstin] = useState('');
    const [pan, setPan] = useState('');
    const [fssai, setFssai] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isDesktop = windowWidth >= 1024;

    const handleNext = (e) => {
        e.preventDefault();
        if (role === 'vendor' && step === 1) {
            setStep(2);
        } else {
            handleRegister();
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        setError('');

        try {
            setTimeout(() => {
                setLoading(false);
                setStep(3); // success screen
            }, 1000);
        } catch (err) {
            setError('Registration failed. Please try again.');
            setLoading(false);
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        backgroundColor: '#050B14',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    };

    const glassCardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: isDesktop ? '3rem' : '2rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        width: '100%',
        maxWidth: step === 3 ? '420px' : '480px',
        zIndex: 10
    };

    const inputStyle = {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '0.875rem 1rem',
        color: 'white',
        fontSize: '0.875rem',
        outline: 'none',
        boxSizing: 'border-box',
        marginTop: '0.5rem'
    };

    const buttonStyle = {
        width: '100%',
        padding: '1rem',
        marginTop: '1.5rem',
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
        transition: 'transform 0.2s ease'
    };

    return (
        <div style={containerStyle}>
            <Navbar />
            {/* Background Gradients */}

            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />
                <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={glassCardStyle}
            >
                {step === 3 ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <CheckCircle2 style={{ color: '#10b981' }} size={32} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Account Created!</h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '2rem' }}>
                            {role === 'vendor' ? 'Your vendor application is under review.' : 'Welcome to the ecosystem.'}
                        </p>
                        <button onClick={() => navigate('/login')} style={buttonStyle}>
                            Proceed to login <ArrowRight size={18} />
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                                <Sparkles size={14} /> Ecosystem Enrollment
                            </div>
                            <h2 style={{ fontSize: '1.875rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                                {step === 1 ? 'Join the movement' : 'Identity Verification'}
                            </h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '500' }}>
                                {step === 1 ? 'Start your journey with Lumina today.' : 'Please provide mandatory taxation details.'}
                            </p>
                        </div>

                        {error && (
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: '#fca5a5', fontSize: '0.875rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {step === 1 && (
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#cbd5e1' }}>I would like to...</label>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div
                                                onClick={() => setRole('customer')}
                                                style={{
                                                    flex: 1,
                                                    cursor: 'pointer',
                                                    borderRadius: '12px',
                                                    padding: '1rem',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    backgroundColor: role === 'customer' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                                                    border: `1px solid ${role === 'customer' ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <UserRound style={{ color: role === 'customer' ? '#818cf8' : '#64748b' }} size={20} />
                                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: role === 'customer' ? 'white' : '#64748b' }}>Shop</span>
                                            </div>
                                            <div
                                                onClick={() => setRole('vendor')}
                                                style={{
                                                    flex: 1,
                                                    cursor: 'pointer',
                                                    borderRadius: '12px',
                                                    padding: '1rem',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    backgroundColor: role === 'vendor' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255,255,255,0.02)',
                                                    border: `1px solid ${role === 'vendor' ? '#a855f7' : 'rgba(255,255,255,0.1)'}`,
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <Store style={{ color: role === 'vendor' ? '#c084fc' : '#64748b' }} size={20} />
                                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: role === 'vendor' ? 'white' : '#64748b' }}>Sell</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#cbd5e1' }}>Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Rahul Sharma"
                                            style={inputStyle}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#cbd5e1' }}>Mobile Connection</label>
                                        <div style={{ position: 'relative', width: '100%' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '1.35rem', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>+91</span>
                                            <input
                                                type="tel"
                                                required
                                                pattern="[0-9]{10}"
                                                placeholder="88888 88888"
                                                style={{ ...inputStyle, paddingLeft: '3rem' }}
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                                maxLength="10"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {step === 2 && role === 'vendor' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                                >
                                    <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', gap: '0.75rem' }}>
                                        <FileCheck style={{ color: '#f59e0b', flexShrink: 0 }} size={16} />
                                        <p style={{ fontSize: '0.7rem', color: '#d97706', lineHeight: '1.5', margin: 0 }}>GST and PAN verification is mandatory for all Indian sellers under Section 194-O.</p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#cbd5e1' }}>GSTIN Number</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="22AAAAA0000A1Z5"
                                            style={{ ...inputStyle, textTransform: 'uppercase' }}
                                            value={gstin}
                                            onChange={(e) => setGstin(e.target.value.toUpperCase())}
                                            maxLength="15"
                                        />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#cbd5e1' }}>Company PAN</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="ABCDE1234F"
                                            style={{ ...inputStyle, textTransform: 'uppercase' }}
                                            value={pan}
                                            onChange={(e) => setPan(e.target.value.toUpperCase())}
                                            maxLength="10"
                                        />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <span
                                            onClick={() => setStep(1)}
                                            style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center gap 4px' }}
                                        >
                                            ← Back to information
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            <button type="submit" style={buttonStyle}>
                                {loading ? <Loader2 className="animate-spin" size={18} /> : (step === 1 && role === 'vendor' ? 'Continue with KYC' : 'Initialize Account')}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                            Already indexed? <Link to="/login" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
