import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface AnalysisProgressProps {
  currentStep: number;
}

const steps = [
  'Parsing Resume',
  'Extracting Keywords',
  'Scoring ATS Compatibility',
  'Generating Feedback'
];

export default function AnalysisProgress({ currentStep }: AnalysisProgressProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="card-elevated rounded-xl p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#00E5FF]/20 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-center text-[#F4F4F6] mb-2">
          Analyzing Your Resume
        </h3>
        <p className="text-center text-[#A0A0AB] mb-6">
          Our AI is processing your resume...
        </p>

        <div className="space-y-4 mb-6">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="flex items-center gap-3"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                index < currentStep 
                  ? 'bg-[#00FF88]' 
                  : index === currentStep 
                  ? 'bg-[#00E5FF] animate-pulse' 
                  : 'bg-[#A0A0AB]/20'
              }`}>
                {index < currentStep && (
                  <svg className="w-4 h-4 text-[#0A0A0F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`font-medium ${
                index <= currentStep ? 'text-[#F4F4F6]' : 'text-[#A0A0AB]'
              }`}>
                {step}
              </span>
            </motion.div>
          ))}
        </div>

        <Progress value={progress} className="h-2 bg-[#A0A0AB]/20" />
      </div>
    </motion.div>
  );
}
