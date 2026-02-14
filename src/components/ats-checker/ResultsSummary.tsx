import { motion } from 'framer-motion';
import { FileText, Calendar, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { ATSScore } from '@/lib/atsScorer';
import { KeywordMatchResult } from '@/lib/keywordMatcher';

interface ResultsSummaryProps {
    score: ATSScore;
    keywords: KeywordMatchResult;
    fileName: string;
}

export default function ResultsSummary({ score, keywords, fileName }: ResultsSummaryProps) {
    const [copied, setCopied] = useState(false);

    const scoreColor = score.overall >= 80 ? '#00FF88' : score.overall >= 60 ? '#FFB800' : '#FF3366';

    const handleShare = () => {
        const text = [
            `📋 ATS Report: ${fileName}`,
            `Score: ${score.overall}/100 (${score.grade})`,
            `Keywords: ${keywords.matchPercentage}% match (${keywords.matchedCount}/${keywords.totalCount})`,
            `${score.gradeLabel}`,
            '',
            `Analyzed with résumé ATS Checker`,
        ].join('\n');

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card-elevated rounded-xl px-6 py-4"
        >
            <div className="flex flex-wrap items-center gap-4 justify-between">
                {/* Left — file info */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#00E5FF]" />
                    </div>
                    <div>
                        <h3 className="text-[#F4F4F6] font-semibold text-sm truncate max-w-[200px]">
                            {fileName}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-[#A0A0AB]">
                            <Calendar className="w-3 h-3" />
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Center — quick stats pills */}
                <div className="flex items-center gap-3">
                    <span
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border"
                        style={{
                            backgroundColor: `${scoreColor}15`,
                            borderColor: `${scoreColor}40`,
                            color: scoreColor,
                        }}
                    >
                        {score.grade} — {score.overall}/100
                    </span>
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
                        {keywords.matchPercentage}% match
                    </span>
                    <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#16161D] border border-[#F4F4F6]/5 text-[#A0A0AB]">
                        {keywords.matchedCount}✓ {keywords.partialCount}~ {keywords.missingCount}✗
                    </span>
                </div>

                {/* Right — share button */}
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-[#16161D] border border-[#F4F4F6]/5 text-[#A0A0AB] hover:text-[#F4F4F6] hover:border-[#F4F4F6]/10 transition-all"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#00FF88]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Share'}
                </button>
            </div>
        </motion.div>
    );
}
