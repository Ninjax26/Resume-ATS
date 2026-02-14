import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import HeroSection from './ats-checker/HeroSection';
import UploadZone from './ats-checker/UploadZone';
import JobDescriptionInput from './ats-checker/JobDescriptionInput';
import AnalysisProgress from './ats-checker/AnalysisProgress';
import ATSScoreCard from './ats-checker/ATSScoreCard';
import ResumePreview from './ats-checker/ResumePreview';
import FeedbackCards from './ats-checker/FeedbackCards';
import ActionButtons from './ats-checker/ActionButtons';
import OptimizeModal from './ats-checker/OptimizeModal';
import FeaturesSection from './ats-checker/FeaturesSection';
import HowItWorksSection from './ats-checker/HowItWorksSection';
import StatsSection from './ats-checker/StatsSection';
import TestimonialsSection from './ats-checker/TestimonialsSection';
import CTASection from './ats-checker/CTASection';
import HistoryPanel from './ats-checker/HistoryPanel';
import ScoreRadar from './ats-checker/ScoreRadar';
import ResultsSummary from './ats-checker/ResultsSummary';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { AppState, KeywordHighlight, FeedbackSection, OptimizeSuggestion } from '@/types/ats';

// Core engine imports
import { parseResume, ParsedResume } from '@/lib/resumeParser';
import { extractJobKeywords, matchKeywords, KeywordMatchResult } from '@/lib/keywordMatcher';
import { calculateATSScore, ATSScore } from '@/lib/atsScorer';
import { generateFeedback, generateOptimizeSuggestions } from '@/lib/feedbackGenerator';
import { downloadHTMLReport } from '@/lib/reportGenerator';
import { saveToHistory } from '@/lib/historyStore';

function Home() {
  const [appState, setAppState] = useState<AppState>('hero');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisStep, setAnalysisStep] = useState(0);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);

  // Real analysis results
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [keywordResult, setKeywordResult] = useState<KeywordMatchResult | null>(null);
  const [feedbackSections, setFeedbackSections] = useState<FeedbackSection[]>([]);
  const [optimizeSuggestions, setOptimizeSuggestions] = useState<OptimizeSuggestion[]>([]);
  const [analysisKeywords, setAnalysisKeywords] = useState<KeywordHighlight[]>([]);

  const handleGetStarted = () => {
    setAppState('upload');
    setTimeout(() => {
      document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile || !jobDescription) return;

    setAppState('analyzing');

    try {
      // Step 0: Parse
      setAnalysisStep(0);
      const parsedResume: ParsedResume = await parseResume(uploadedFile);

      // Step 1: Extract keywords
      await sleep(800);
      setAnalysisStep(1);
      const jobKeywords = extractJobKeywords(jobDescription);

      // Step 2: Match keywords
      await sleep(800);
      setAnalysisStep(2);
      const kwResult = matchKeywords(jobKeywords, parsedResume.rawText);
      setKeywordResult(kwResult);
      setAnalysisKeywords(kwResult.keywords);

      // Step 3: Score & feedback
      await sleep(800);
      setAnalysisStep(3);
      const score = calculateATSScore(parsedResume, kwResult);
      setAtsScore(score);

      const feedback = generateFeedback(parsedResume, kwResult, score);
      setFeedbackSections(feedback);

      const optimize = generateOptimizeSuggestions(parsedResume, kwResult);
      setOptimizeSuggestions(optimize);

      // Save to history
      const topMissing = kwResult.keywords
        .filter(k => k.status === 'missing')
        .slice(0, 5)
        .map(k => k.text);

      saveToHistory({
        fileName: uploadedFile.name,
        overallScore: score.overall,
        grade: score.grade,
        gradeLabel: score.gradeLabel,
        matchPercentage: kwResult.matchPercentage,
        topMissing,
      });

      // Show results
      await sleep(600);
      setAppState('results');
    } catch (error) {
      console.error('Analysis error:', error);
      setAppState('upload');
    }
  };

  const handleStartOver = () => {
    setAppState('upload');
    setUploadedFile(null);
    setJobDescription('');
    setAnalysisStep(0);
    setAtsScore(null);
    setKeywordResult(null);
    setFeedbackSections([]);
    setOptimizeSuggestions([]);
    setAnalysisKeywords([]);
  };

  const handleOptimize = () => {
    setShowOptimizeModal(true);
  };

  const handleDownload = () => {
    if (!atsScore || !keywordResult) return;
    downloadHTMLReport(atsScore, keywordResult, feedbackSections, uploadedFile?.name || 'resume');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar — always visible */}
      <Navbar onAnalyze={handleGetStarted} />

      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        {appState === 'hero' && (
          <>
            <HeroSection onGetStarted={handleGetStarted} />
            <FeaturesSection />
            <HowItWorksSection />
            <StatsSection />
            <TestimonialsSection />
            <CTASection onAnalyze={handleGetStarted} />
          </>
        )}

        {/* Upload and Analysis Section */}
        {(appState === 'upload' || appState === 'analyzing' || appState === 'results') && (
          <div id="upload-section" className="min-h-screen pt-28 pb-24 px-6">
            <div className="max-w-7xl mx-auto">
              {/* Back Button (only show in results) */}
              {appState === 'results' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-8"
                >
                  <Button
                    onClick={handleStartOver}
                    variant="ghost"
                    className="text-[#00E5FF] hover:bg-[#00E5FF]/10"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Analyze Another Resume
                  </Button>
                </motion.div>
              )}

              {/* Upload State */}
              {appState === 'upload' && (
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                  >
                    <h2 className="text-5xl font-bold text-[#F4F4F6] mb-4">
                      Let's Get Started
                    </h2>
                    <p className="text-xl text-[#A0A0AB]">
                      Upload your resume and job description to begin analysis
                    </p>
                  </motion.div>

                  <UploadZone onFileUpload={handleFileUpload} />

                  {uploadedFile && (
                    <>
                      <JobDescriptionInput
                        value={jobDescription}
                        onChange={setJobDescription}
                      />

                      {jobDescription && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-center pt-8"
                        >
                          <Button
                            onClick={handleAnalyze}
                            size="lg"
                            className="px-12 py-7 text-lg font-bold bg-[#00E5FF] hover:bg-[#00D5EF] text-[#0A0A0F] rounded-lg glow-cyan-soft hover:glow-cyan transition-all duration-300"
                          >
                            Analyze Resume
                          </Button>
                        </motion.div>
                      )}
                    </>
                  )}

                  {/* History Panel — shows on upload page */}
                  <div className="max-w-2xl mx-auto pt-4">
                    <HistoryPanel />
                  </div>
                </div>
              )}

              {/* Analyzing State */}
              {appState === 'analyzing' && (
                <div className="flex items-center justify-center min-h-[60vh]">
                  <AnalysisProgress currentStep={analysisStep} />
                </div>
              )}

              {/* Results State */}
              {appState === 'results' && atsScore && keywordResult && (
                <div className="space-y-8">
                  {/* Results Summary Header */}
                  <ResultsSummary
                    score={atsScore}
                    keywords={keywordResult}
                    fileName={uploadedFile?.name || 'resume'}
                  />

                  {/* Score + Radar Side‑by‑Side */}
                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <ATSScoreCard
                        score={atsScore.overall}
                        matchPercentage={keywordResult.matchPercentage}
                        breakdown={atsScore.breakdown}
                      />
                    </div>
                    <div className="lg:col-span-1">
                      <ScoreRadar breakdown={atsScore.breakdown} />
                    </div>
                  </div>

                  {/* Dashboard Split Layout */}
                  <div className="grid lg:grid-cols-5 gap-8">
                    {/* Left Panel - Resume Preview (40%) */}
                    <div className="lg:col-span-2">
                      <ResumePreview keywords={analysisKeywords} />
                    </div>

                    {/* Right Panel - Feedback (60%) */}
                    <div className="lg:col-span-3 space-y-8">
                      <FeedbackCards sections={feedbackSections} />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-8">
                    <ActionButtons
                      onOptimize={handleOptimize}
                      onDownload={handleDownload}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer — always visible */}
      <Footer />

      {/* Optimize Modal */}
      <OptimizeModal
        isOpen={showOptimizeModal}
        onClose={() => setShowOptimizeModal(false)}
        suggestions={optimizeSuggestions}
      />
    </div>
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default Home;
