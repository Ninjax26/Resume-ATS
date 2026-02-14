import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OptimizeSuggestion } from '@/types/ats';

interface OptimizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: OptimizeSuggestion[];
}

export default function OptimizeModal({ isOpen, onClose, suggestions }: OptimizeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[80vh] z-50"
          >
            <div className="card-elevated rounded-xl h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#A0A0AB]/20">
                <h2 className="text-2xl font-bold text-[#F4F4F6]">AI-Powered Optimizations</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-[#A0A0AB] hover:text-[#F4F4F6] hover:bg-[#A0A0AB]/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {suggestions.map((suggestion, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="text-sm font-medium text-[#00E5FF] uppercase tracking-wide">
                        Suggestion {idx + 1}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Original */}
                        <div className="space-y-2">
                          <div className="text-xs text-[#A0A0AB] uppercase tracking-wide">Original</div>
                          <div className="p-4 bg-[#FF3366]/10 border border-[#FF3366]/30 rounded-lg">
                            <p className="text-sm text-[#F4F4F6]">{suggestion.original}</p>
                          </div>
                        </div>

                        {/* Improved */}
                        <div className="space-y-2">
                          <div className="text-xs text-[#A0A0AB] uppercase tracking-wide">Improved</div>
                          <div className="p-4 bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-lg">
                            <p className="text-sm text-[#F4F4F6]">{suggestion.improved}</p>
                          </div>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="p-4 bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-lg">
                        <div className="text-xs text-[#00E5FF] font-medium mb-2 uppercase tracking-wide">
                          Why this matters
                        </div>
                        <p className="text-sm text-[#A0A0AB]">{suggestion.reason}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-[#A0A0AB]/20">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-[#A0A0AB]/30 text-[#A0A0AB] hover:bg-[#A0A0AB]/10"
                >
                  Close
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-[#00E5FF] hover:bg-[#00D5EF] text-[#0A0A0F] font-bold glow-cyan-soft"
                >
                  Apply Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
