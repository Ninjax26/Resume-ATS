import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { KeywordHighlight } from '@/types/ats';

interface ResumePreviewProps {
  keywords: KeywordHighlight[];
}

export default function ResumePreview({ keywords }: ResumePreviewProps) {
  const getStatusColor = (status: KeywordHighlight['status']) => {
    switch (status) {
      case 'matched':
        return 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/40';
      case 'partial':
        return 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/40';
      case 'missing':
        return 'bg-[#FF3366]/20 text-[#FF3366] border-[#FF3366]/40';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="card-elevated rounded-xl p-6 h-full overflow-auto"
    >
      <h3 className="text-xl font-bold text-[#F4F4F6] mb-6 sticky top-0 bg-[#16161D]/95 backdrop-blur-sm pb-4 z-10">
        Keyword Analysis
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-[#A0A0AB] mb-3 uppercase tracking-wide">
            Matched Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {keywords.filter(k => k.status === 'matched').map((keyword, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Badge className={getStatusColor('matched')}>
                  {keyword.text}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#A0A0AB] mb-3 uppercase tracking-wide">
            Partially Matched
          </h4>
          <div className="flex flex-wrap gap-2">
            {keywords.filter(k => k.status === 'partial').map((keyword, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Badge className={getStatusColor('partial')}>
                  {keyword.text}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#A0A0AB] mb-3 uppercase tracking-wide">
            Missing Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {keywords.filter(k => k.status === 'missing').map((keyword, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Badge className={getStatusColor('missing')}>
                  {keyword.text}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-[#A0A0AB]/20">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#00FF88] rounded-full"></div>
            <span className="text-[#A0A0AB]">Matched</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FFB800] rounded-full"></div>
            <span className="text-[#A0A0AB]">Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FF3366] rounded-full"></div>
            <span className="text-[#A0A0AB]">Missing</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
