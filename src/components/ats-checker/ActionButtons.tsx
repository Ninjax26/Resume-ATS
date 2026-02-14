import { motion } from 'framer-motion';
import { Sparkles, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onOptimize: () => void;
  onDownload: () => void;
}

export default function ActionButtons({ onOptimize, onDownload }: ActionButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-wrap gap-4 justify-center"
    >
      <Button
        onClick={onOptimize}
        size="lg"
        className="px-8 py-6 text-base font-bold bg-[#00E5FF] hover:bg-[#00D5EF] text-[#0A0A0F] rounded-lg glow-cyan-soft hover:glow-cyan transition-all duration-300 transform hover:scale-105"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Optimize Resume
      </Button>

      <Button
        onClick={onDownload}
        size="lg"
        variant="outline"
        className="px-8 py-6 text-base font-bold bg-transparent border-2 border-[#00E5FF]/50 text-[#00E5FF] hover:bg-[#00E5FF]/10 hover:border-[#00E5FF] rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        <Download className="w-5 h-5 mr-2" />
        Download Report
      </Button>
    </motion.div>
  );
}
