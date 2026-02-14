import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ScoreBreakdown } from '@/lib/atsScorer';

interface ATSScoreCardProps {
  score: number;
  matchPercentage: number;
  breakdown?: ScoreBreakdown;
}

const DIMENSION_LABELS: Record<keyof ScoreBreakdown, { name: string; icon: string }> = {
  keywordMatch: { name: 'Keywords', icon: '🔑' },
  formatting: { name: 'Formatting', icon: '📐' },
  sectionCompleteness: { name: 'Sections', icon: '📋' },
  actionVerbs: { name: 'Action Verbs', icon: '⚡' },
  quantifiedAchievements: { name: 'Metrics', icon: '📊' },
};

export default function ATSScoreCard({ score, matchPercentage, breakdown }: ATSScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [displayMatch, setDisplayMatch] = useState(0);

  useEffect(() => {
    const scoreDuration = 1200;
    const scoreIncrement = score / (scoreDuration / 16);
    let currentScore = 0;

    const scoreInterval = setInterval(() => {
      currentScore += scoreIncrement;
      if (currentScore >= score) {
        setDisplayScore(score);
        clearInterval(scoreInterval);
      } else {
        setDisplayScore(Math.floor(currentScore));
      }
    }, 16);

    const matchDuration = 1200;
    const matchIncrement = matchPercentage / (matchDuration / 16);
    let currentMatch = 0;

    const matchInterval = setInterval(() => {
      currentMatch += matchIncrement;
      if (currentMatch >= matchPercentage) {
        setDisplayMatch(matchPercentage);
        clearInterval(matchInterval);
      } else {
        setDisplayMatch(Math.floor(currentMatch));
      }
    }, 16);

    return () => {
      clearInterval(scoreInterval);
      clearInterval(matchInterval);
    };
  }, [score, matchPercentage]);

  const scoreColor = score >= 80 ? '#00FF88' : score >= 60 ? '#FFB800' : '#FF3366';
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card-elevated rounded-xl p-8"
    >
      <h3 className="text-2xl font-bold text-[#F4F4F6] mb-8">ATS Compatibility Score</h3>

      <div className="flex items-center justify-around">
        {/* Score Ring */}
        <div className="relative">
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="rgba(160, 160, 171, 0.2)"
              strokeWidth="12"
              fill="none"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              stroke={scoreColor}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 8px ${scoreColor})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold font-mono" style={{ color: scoreColor }}>
              {displayScore}
            </span>
            <span className="text-sm text-[#A0A0AB] font-mono">/ 100</span>
          </div>
        </div>

        {/* Match Percentage */}
        <div className="text-center">
          <div className="text-5xl font-bold font-mono text-[#00E5FF] mb-2">
            {displayMatch}%
          </div>
          <div className="text-[#A0A0AB]">Keyword Match</div>
        </div>
      </div>

      {/* Status Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`mt-8 p-4 rounded-lg border ${score >= 80
            ? 'bg-[#00FF88]/10 border-[#00FF88]/30'
            : score >= 60
              ? 'bg-[#FFB800]/10 border-[#FFB800]/30'
              : 'bg-[#FF3366]/10 border-[#FF3366]/30'
          }`}
      >
        <p className="text-center font-medium text-[#F4F4F6]">
          {score >= 80
            ? '✨ Excellent! Your resume is highly ATS-compatible'
            : score >= 60
              ? '⚠️ Good start, but there\'s room for improvement'
              : '🚨 Your resume needs significant optimization'}
        </p>
      </motion.div>

      {/* Score Breakdown Chart */}
      {breakdown && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="mt-8 pt-6 border-t border-[#A0A0AB]/15"
        >
          <h4 className="text-sm font-medium text-[#A0A0AB] uppercase tracking-wide mb-5">
            Score Breakdown
          </h4>
          <div className="space-y-4">
            {(Object.keys(DIMENSION_LABELS) as (keyof ScoreBreakdown)[]).map((key, idx) => {
              const dim = breakdown[key];
              const label = DIMENSION_LABELS[key];
              const barColor = dim.score >= 70 ? '#00FF88' : dim.score >= 40 ? '#FFB800' : '#FF3366';

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + idx * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-[#F4F4F6] font-medium">
                      {label.icon} {label.name}
                      <span className="text-[#A0A0AB] text-xs ml-2">({dim.weight * 100}%)</span>
                    </span>
                    <span
                      className="text-sm font-mono font-bold"
                      style={{ color: barColor }}
                    >
                      {Math.round(dim.score)}
                    </span>
                  </div>
                  <div className="h-2 bg-[#A0A0AB]/15 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: barColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${dim.score}%` }}
                      transition={{ delay: 1.3 + idx * 0.1, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-xs text-[#A0A0AB] mt-1">{dim.details}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
