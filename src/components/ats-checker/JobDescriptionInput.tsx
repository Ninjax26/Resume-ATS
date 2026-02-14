import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    onChange(text);
    setCharCount(text.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="card-elevated rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#F4F4F6]">Job Description</h3>
          <span className="text-sm text-[#A0A0AB] font-mono">{charCount} characters</span>
        </div>

        <Textarea
          value={value}
          onChange={handleChange}
          placeholder="Paste the job description here to match your resume against specific requirements..."
          className="min-h-[200px] bg-[#0A0A0F] border-[#A0A0AB]/30 text-[#F4F4F6] placeholder:text-[#A0A0AB]/50 focus:border-[#00E5FF] focus:ring-[#00E5FF] transition-colors resize-none"
        />

        {charCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-2 text-sm text-[#00FF88]"
          >
            <div className="w-2 h-2 bg-[#00FF88] rounded-full animate-pulse"></div>
            <span>Keywords detected - ready to analyze</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
