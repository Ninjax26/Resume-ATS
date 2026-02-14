import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
}

function isSupportedResumeFile(file: File): boolean {
  if (file.type === 'application/pdf') return true;
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return true;
  if (file.type === 'text/plain') return true;
  return /\.(pdf|docx|txt)$/i.test(file.name);
}

export default function UploadZone({ onFileUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && isSupportedResumeFile(file)) {
      setUploadedFile(file);
      onFileUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isSupportedResumeFile(file)) {
      setUploadedFile(file);
      onFileUpload(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-xl border-2 border-dashed transition-all duration-300 card-elevated',
          isDragging ? 'border-[#00E5FF] bg-[#00E5FF]/5 scale-[1.02] glow-cyan-soft' : 'border-[#A0A0AB]/30',
          uploadedFile ? 'bg-[#00FF88]/5 border-[#00FF88]' : ''
        )}
      >
        <input
          type="file"
          id="file-upload"
          accept=".pdf,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center px-8 py-16 cursor-pointer"
        >
          {!uploadedFile ? (
            <>
              <motion.div
                animate={isDragging ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Upload className={cn(
                  'w-16 h-16 mb-6 transition-colors',
                  isDragging ? 'text-[#00E5FF]' : 'text-[#A0A0AB]'
                )} />
              </motion.div>

              <h3 className="text-2xl font-bold text-[#F4F4F6] mb-2">
                Drop your resume here
              </h3>
              <p className="text-[#A0A0AB] mb-4">or click to browse</p>

              <div className="flex items-center gap-4 text-sm text-[#A0A0AB]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>PDF</span>
                </div>
                <div className="w-1 h-1 bg-[#A0A0AB] rounded-full"></div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>DOCX</span>
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4"
            >
              <CheckCircle2 className="w-12 h-12 text-[#00FF88]" />
              <div className="text-left">
                <h4 className="text-xl font-bold text-[#F4F4F6]">{uploadedFile.name}</h4>
                <p className="text-[#A0A0AB]">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </motion.div>
          )}
        </label>
      </div>
    </motion.div>
  );
}
