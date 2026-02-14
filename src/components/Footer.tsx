import { Heart } from 'lucide-react';

export default function Footer() {
    const year = new Date().getFullYear();

    const productLinks = [
        { label: 'Hero', href: '#hero' },
        { label: 'Features', href: '#features' },
        { label: 'Workflow', href: '#how-it-works' },
        { label: 'ATS Metrics', href: '#stats' },
    ];

    const resourceLinks = [
        { label: 'File Upload', href: '#upload-section' },
        { label: 'Keyword Analysis', href: '#upload-section' },
        { label: 'Score Breakdown', href: '#upload-section' },
        { label: 'Optimization Output', href: '#upload-section' },
    ];

    const techStack = ['React', 'TypeScript', 'Three.js', 'Framer Motion', 'Vite'];

    return (
        <footer className="relative border-t border-[#F4F4F6]/5">
            {/* Gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#00FF88] flex items-center justify-center font-bold text-[#0A0A0F] text-sm">
                                r
                            </div>
                            <span className="text-[#F4F4F6] font-bold text-lg">résumé</span>
                        </div>
                        <p className="text-sm text-[#A0A0AB] leading-relaxed mb-6">
                            Resume ATS analyzer with local parsing, weighted scoring, and actionable rewrite suggestions.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-sm font-semibold text-[#F4F4F6] uppercase tracking-wider mb-4">Product</h4>
                        <ul className="space-y-3">
                            {productLinks.map(link => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-sm text-[#A0A0AB] hover:text-[#F4F4F6] transition-colors duration-200">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-sm font-semibold text-[#F4F4F6] uppercase tracking-wider mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {resourceLinks.map(link => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-sm text-[#A0A0AB] hover:text-[#F4F4F6] transition-colors duration-200">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Built With */}
                    <div>
                        <h4 className="text-sm font-semibold text-[#F4F4F6] uppercase tracking-wider mb-4">Built With</h4>
                        <div className="flex flex-wrap gap-2">
                            {techStack.map(tech => (
                                <span
                                    key={tech}
                                    className="px-3 py-1.5 text-xs font-medium text-[#A0A0AB] bg-[#16161D] border border-[#F4F4F6]/5 rounded-md hover:border-[#00E5FF]/20 hover:text-[#00E5FF] transition-all duration-300 cursor-default"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-[#F4F4F6]/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[#A0A0AB]">
                        © {year} résumé. All rights reserved.
                    </p>
                    <p className="text-xs text-[#A0A0AB] flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-[#FF3366] fill-[#FF3366]" /> by Apoorv
                    </p>
                </div>
            </div>
        </footer>
    );
}
