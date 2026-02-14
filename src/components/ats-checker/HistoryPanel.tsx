import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, ChevronRight } from 'lucide-react';
import { getHistory, clearHistory, HistoryEntry } from '@/lib/historyStore';

export default function HistoryPanel() {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    if (history.length === 0) return null;

    const getScoreColor = (score: number) =>
        score >= 80 ? '#00FF88' : score >= 60 ? '#FFB800' : '#FF3366';

    const handleClear = () => {
        clearHistory();
        setHistory([]);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-elevated rounded-xl overflow-hidden"
        >
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between group hover:bg-[#F4F4F6]/[0.02] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#00E5FF]" />
                    <span className="text-[#F4F4F6] font-semibold">Recent Analyses</span>
                    <span className="text-xs text-[#A0A0AB] bg-[#A0A0AB]/10 px-2 py-0.5 rounded-full">
                        {history.length}
                    </span>
                </div>
                <ChevronRight
                    className={`w-5 h-5 text-[#A0A0AB] transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''
                        }`}
                />
            </button>

            {/* Entries */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-2">
                            {history.map((entry, idx) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-center gap-4 p-3 rounded-lg bg-[#16161D]/50 border border-[#F4F4F6]/5 hover:border-[#F4F4F6]/10 transition-colors"
                                >
                                    {/* Score circle */}
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 shrink-0"
                                        style={{
                                            borderColor: getScoreColor(entry.overallScore),
                                            color: getScoreColor(entry.overallScore),
                                        }}
                                    >
                                        {entry.overallScore}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-[#F4F4F6] font-medium truncate">
                                            {entry.fileName}
                                        </div>
                                        <div className="text-xs text-[#A0A0AB]">
                                            {new Date(entry.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                            {' · '}
                                            <span style={{ color: getScoreColor(entry.overallScore) }}>
                                                {entry.grade}
                                            </span>
                                            {' · '}
                                            {entry.matchPercentage}% match
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Clear button */}
                            <button
                                onClick={handleClear}
                                className="w-full flex items-center justify-center gap-2 py-2 text-xs text-[#A0A0AB] hover:text-[#FF3366] transition-colors mt-2"
                            >
                                <Trash2 className="w-3 h-3" />
                                Clear History
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
