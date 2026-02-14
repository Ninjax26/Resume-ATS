import { motion } from 'framer-motion';
import { Target, FileSearch, BarChart3, Lightbulb } from 'lucide-react';

const features = [
    {
        icon: Target,
        title: 'Smart Keyword Matching',
        description: 'Instantly identify which critical skills and keywords from the job description are missing in your resume.',
        color: 'text-[#00FF88]',
        bgColor: 'bg-[#00FF88]/10',
        borderColor: 'border-[#00FF88]/20'
    },
    {
        icon: FileSearch,
        title: 'Formatting Checks',
        description: 'Ensure your resume uses ATS-friendly formatting, fonts, and layouts that parsers can actually read.',
        color: 'text-[#00E5FF]',
        bgColor: 'bg-[#00E5FF]/10',
        borderColor: 'border-[#00E5FF]/20'
    },
    {
        icon: BarChart3,
        title: 'Score & Analysis',
        description: 'Get a clear, quantified match score to understand your standing before you apply.',
        color: 'text-[#FFB800]',
        bgColor: 'bg-[#FFB800]/10',
        borderColor: 'border-[#FFB800]/20'
    },
    {
        icon: Lightbulb,
        title: 'Actionable Advice',
        description: 'Receive specific, AI-driven suggestions to improve your bullet points and impact statements.',
        color: 'text-[#FF3366]',
        bgColor: 'bg-[#FF3366]/10',
        borderColor: 'border-[#FF3366]/20'
    }
];

export default function FeaturesSection() {
    return (
        <section id="features" className="py-24 px-6 bg-[#0A0A0F] relative overflow-hidden">
            {/* decorative blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00E5FF] opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-[#F4F4F6] mb-6">
                        Everything you need to <span className="text-glow text-[#00E5FF]">get hired</span>
                    </h2>
                    <p className="text-xl text-[#A0A0AB] max-w-2xl mx-auto">
                        Stop guessing why you're not getting callbacks. Our AI analyzes your resume exactly like a modern ATS.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className={`p-6 rounded-2xl border ${feature.borderColor} bg-[#16161D]/50 backdrop-blur-sm hover:translate-y-[-4px] transition-all duration-300 group`}
                        >
                            <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-[#F4F4F6] mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-[#A0A0AB] leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
