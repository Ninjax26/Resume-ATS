import { motion } from 'framer-motion';
import { ChevronDown, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { Suggestion, FeedbackSection } from '@/types/ats';

interface FeedbackCardsProps {
  sections: FeedbackSection[];
}

export default function FeedbackCards({ sections }: FeedbackCardsProps) {
  const [openSections, setOpenSections] = useState<string[]>([sections[0]?.title]);

  const toggleSection = (title: string) => {
    setOpenSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const getSeverityIcon = (severity: Suggestion['severity']) => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[#00FF88]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#FFB800]" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[#FF3366]" />;
    }
  };

  const getSeverityColor = (severity: Suggestion['severity']) => {
    switch (severity) {
      case 'success':
        return 'border-[#00FF88]/30 bg-[#00FF88]/5';
      case 'warning':
        return 'border-[#FFB800]/30 bg-[#FFB800]/5';
      case 'error':
        return 'border-[#FF3366]/30 bg-[#FF3366]/5';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {sections.map((section, idx) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Collapsible
            open={openSections.includes(section.title)}
            onOpenChange={() => toggleSection(section.title)}
          >
            <div className="card-elevated rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl">
              <CollapsibleTrigger className="w-full px-6 py-5 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-[#F4F4F6]">{section.title}</h3>
                  <span className="text-sm text-[#A0A0AB] font-mono">
                    {section.suggestions.length} items
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-[#A0A0AB] transition-transform ${openSections.includes(section.title) ? 'rotate-180' : ''
                  }`} />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-3">
                  {section.suggestions.map((suggestion, suggIdx) => (
                    <motion.div
                      key={suggIdx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: suggIdx * 0.05 }}
                      className={`p-4 rounded-lg border ${getSeverityColor(suggestion.severity)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(suggestion.severity)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#F4F4F6] mb-1">
                            {suggestion.title}
                          </h4>
                          <p className="text-sm text-[#A0A0AB] leading-relaxed">
                            {suggestion.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </motion.div>
      ))}
    </motion.div>
  );
}
