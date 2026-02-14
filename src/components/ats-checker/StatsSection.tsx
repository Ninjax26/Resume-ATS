import { motion } from 'framer-motion';

const stats = [
    {
        value: '5',
        label: 'Scoring Dimensions',
        color: 'text-[#00E5FF]'
    },
    {
        value: '3',
        label: 'Supported File Types',
        color: 'text-[#00FF88]'
    },
    {
        value: '0',
        label: 'Server Upload Required',
        color: 'text-[#FFB800]'
    }
];

export default function StatsSection() {
    return (
        <section id="stats" className="py-24 px-6 bg-[#0A0A0F] relative overflow-hidden border-y border-[#F4F4F6]/5">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid md:grid-cols-3 gap-12 text-center">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5, type: "spring" }}
                            className="p-8 rounded-2xl bg-[#16161D]/30 backdrop-blur-sm border border-[#F4F4F6]/5 hover:border-[#F4F4F6]/10 transition-colors"
                        >
                            <div className={`text-5xl md:text-7xl font-bold mb-4 ${stat.color} tracking-tight`}>
                                {stat.value}
                            </div>
                            <div className="text-xl text-[#A0A0AB] font-medium uppercase tracking-wide">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
