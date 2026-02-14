import { motion } from 'framer-motion';
import { UploadCloud, Cpu, CheckCircle2 } from 'lucide-react';

const steps = [
    {
        icon: UploadCloud,
        title: 'Upload Your Resume',
        description: 'Drag and drop your PDF or DOCX file. We value your privacy and do not store your personal data.',
        color: 'text-[#00E5FF]',
        bgColor: 'bg-[#00E5FF]/10',
        number: '01'
    },
    {
        icon: Cpu,
        title: 'AI Analysis',
        description: 'Our system scans your resume against thousands of job descriptions to identify keywords and formatting issues.',
        color: 'text-[#FFB800]',
        bgColor: 'bg-[#FFB800]/10',
        number: '02'
    },
    {
        icon: CheckCircle2,
        title: 'Get Optimized',
        description: 'Receive a detailed report with actionable insights to increase your interview chances.',
        color: 'text-[#00FF88]',
        bgColor: 'bg-[#00FF88]/10',
        number: '03'
    }
];

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-[#00E5FF] font-mono text-sm tracking-widest uppercase mb-4 block">Process</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-[#F4F4F6] mb-6">
                        How it <span className="text-glow text-[#00E5FF]">works</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-[80px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-[#00E5FF]/0 via-[#00E5FF]/20 to-[#00E5FF]/0 z-0"></div>

                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2, duration: 0.5 }}
                            className="relative z-10 text-center group"
                        >
                            <div className="relative inline-block mb-8">
                                <div className={`w-24 h-24 rounded-full ${step.bgColor} backdrop-blur-sm border border-[#F4F4F6]/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                                    {/* Step Number Badge */}
                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#16161D] border border-[#27272A] flex items-center justify-center text-xs font-mono text-[#A0A0AB]">
                                        {step.number}
                                    </div>
                                    <step.icon className={`w-10 h-10 ${step.color}`} />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-[#F4F4F6] mb-3">
                                {step.title}
                            </h3>
                            <p className="text-[#A0A0AB] leading-relaxed max-w-sm mx-auto">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
