import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
    onNavigate?: (section: string) => void;
    onAnalyze?: () => void;
}

export default function Navbar({ onNavigate, onAnalyze }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Features', id: 'features' },
        { label: 'How It Works', id: 'how-it-works' },
        { label: 'Stats', id: 'stats' },
    ];

    const handleClick = (id: string) => {
        setMobileOpen(false);
        if (onNavigate) onNavigate(id);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <motion.nav
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'py-3 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-[#F4F4F6]/5 shadow-lg shadow-black/20'
                    : 'py-5 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleClick('hero')}>
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#00FF88] flex items-center justify-center font-bold text-[#0A0A0F] text-sm">
                        r
                    </div>
                    <span className="text-[#F4F4F6] font-bold text-lg tracking-tight">résumé</span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <button
                            key={link.id}
                            onClick={() => handleClick(link.id)}
                            className="text-[#A0A0AB] hover:text-[#F4F4F6] text-sm font-medium transition-colors duration-200 relative group"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00E5FF] group-hover:w-full transition-all duration-300" />
                        </button>
                    ))}
                    <button
                        onClick={onAnalyze}
                        className="px-5 py-2 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-sm font-semibold hover:bg-[#00E5FF]/20 hover:border-[#00E5FF]/50 transition-all duration-300"
                    >
                        Analyze Resume
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-[#F4F4F6]"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-[#F4F4F6]/5"
                    >
                        <div className="px-6 py-4 space-y-3">
                            {navLinks.map(link => (
                                <button
                                    key={link.id}
                                    onClick={() => handleClick(link.id)}
                                    className="block w-full text-left text-[#A0A0AB] hover:text-[#F4F4F6] text-sm font-medium py-2 transition-colors"
                                >
                                    {link.label}
                                </button>
                            ))}
                            <button
                                onClick={() => { setMobileOpen(false); onAnalyze?.(); }}
                                className="w-full px-5 py-3 rounded-lg bg-[#00E5FF] text-[#0A0A0F] text-sm font-bold mt-2"
                            >
                                Analyze Resume
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
