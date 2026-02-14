import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
    onAnalyze: () => void;
}

export default function CTASection({ onAnalyze }: CTASectionProps) {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00E5FF]/[0.03] to-transparent pointer-events-none" />

            {/* Floating orbs */}
            <div className="absolute left-1/4 top-1/3 w-64 h-64 bg-[#00E5FF]/5 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute right-1/4 bottom-1/3 w-48 h-48 bg-[#00FF88]/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="max-w-4xl mx-auto relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-sm font-medium mb-8">
                        <Sparkles className="w-4 h-4" />
                        Free • No Sign-up Required
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-[#F4F4F6] mb-6 leading-tight">
                        Ready to land your{' '}
                        <span className="text-glow text-[#00E5FF]">dream job</span>?
                    </h2>

                    <p className="text-lg text-[#A0A0AB] max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stop guessing if your resume will pass the ATS. Get instant, data-driven feedback
                        and start getting more interviews today.
                    </p>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            onClick={onAnalyze}
                            size="lg"
                            className="px-10 py-7 text-lg font-bold bg-[#00E5FF] hover:bg-[#00D5EF] text-[#0A0A0F] rounded-xl glow-cyan-soft hover:glow-cyan transition-all duration-300 group"
                        >
                            Analyze My Resume
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
