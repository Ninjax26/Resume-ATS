import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResumeScene = lazy(() => import('../ResumeScene'));

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Suspense fallback={null}>
          <ResumeScene />
        </Suspense>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E5FF] opacity-10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00E5FF] opacity-10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-8 text-left"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16161D]/50 border border-[#00E5FF]/20 backdrop-blur-sm shadow-lg shadow-[#00E5FF]/5"
          >
            <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            <span className="text-sm text-[#A0A0AB] font-medium">AI-Powered Resume Analysis</span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-none tracking-tight drop-shadow-2xl">
            <span className="block text-[#F4F4F6]">Beat the</span>
            <span className="block text-[#00E5FF] text-glow mt-2">ATS System</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-[#A0A0AB] leading-relaxed max-w-xl drop-shadow-md">
            Get instant AI-driven feedback on your resume's compatibility with Applicant Tracking Systems.
            Optimize your keywords, formatting, and content to land more interviews.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row gap-6 items-start"
          >
            <Button
              onClick={onGetStarted}
              size="lg"
              className="px-10 py-7 text-lg font-bold bg-[#00E5FF] hover:bg-[#00D5EF] text-[#0A0A0F] rounded-lg glow-cyan-soft hover:glow-cyan transition-all duration-300 transform hover:scale-105"
            >
              Analyze My Resume
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-8 text-sm text-[#A0A0AB] pt-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00FF88] rounded-full shadow-[0_0_8px_#00FF88]"></div>
              <span>Free Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00FF88] rounded-full shadow-[0_0_8px_#00FF88]"></div>
              <span>Instant Results</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Spacer for 3D Model */}
        <div className="hidden lg:block h-full min-h-[600px]"></div>
      </div>
    </section>
  );
}
