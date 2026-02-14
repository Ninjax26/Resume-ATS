import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const highlights = [
    {
        title: 'Client-Side Parsing Engine',
        detail: 'Parses PDF, DOCX, and TXT directly in-browser with no backend dependency.',
        tag: 'Parser'
    },
    {
        title: 'Weighted ATS Scoring Model',
        detail: 'Combines keyword coverage, section completeness, formatting, action verbs, and quantified impact.',
        tag: 'Scoring'
    },
    {
        title: 'Actionable Optimization Output',
        detail: 'Generates concrete feedback and downloadable reports tailored to each uploaded resume and role.',
        tag: 'Feedback'
    }
];

export default function TestimonialsSection() {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-[#F4F4F6] mb-6">
                        Why this <span className="text-glow text-[#00E5FF]">project stands out</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {highlights.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="p-8 rounded-2xl bg-[#16161D]/50 backdrop-blur-sm border border-[#F4F4F6]/5 hover:border-[#F4F4F6]/10 transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <CheckCircle2 className="w-7 h-7 text-[#00E5FF] opacity-90 group-hover:opacity-100 transition-opacity" />
                                <span className="text-xs uppercase tracking-wide text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/25 px-2 py-1 rounded">
                                    {item.tag}
                                </span>
                            </div>

                            <h3 className="text-xl font-semibold text-[#F4F4F6] mb-3">{item.title}</h3>
                            <p className="text-[#A0A0AB] leading-relaxed">{item.detail}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
