/**
 * ATS Scoring Algorithm
 * Multi-dimensional score: Keywords(40%), Formatting(20%), Sections(20%), Verbs(10%), Metrics(10%)
 */

import { ParsedResume } from './resumeParser';
import { KeywordMatchResult } from './keywordMatcher';

export interface ATSScore {
    overall: number;
    breakdown: ScoreBreakdown;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    gradeLabel: string;
}

export interface ScoreBreakdown {
    keywordMatch: DimensionScore;
    formatting: DimensionScore;
    sectionCompleteness: DimensionScore;
    actionVerbs: DimensionScore;
    quantifiedAchievements: DimensionScore;
}

export interface DimensionScore {
    score: number;
    weight: number;
    weighted: number;
    details: string;
}

const STRONG_VERBS = new Set([
    'achieved', 'architected', 'automated', 'built', 'championed', 'created', 'debugged',
    'delivered', 'deployed', 'designed', 'developed', 'drove', 'eliminated', 'enabled',
    'engineered', 'established', 'expanded', 'generated', 'grew', 'headed', 'implemented',
    'improved', 'increased', 'initiated', 'innovated', 'integrated', 'introduced',
    'launched', 'led', 'leveraged', 'managed', 'mentored', 'migrated', 'optimized',
    'orchestrated', 'overhauled', 'owned', 'pioneered', 'produced', 'programmed',
    'prototyped', 'redesigned', 'reduced', 'refactored', 'revamped', 'scaled',
    'spearheaded', 'standardized', 'streamlined', 'strengthened', 'supervised',
    'transformed', 'tripled', 'unified', 'upgraded',
]);

const WEAK_VERBS = new Set([
    'helped', 'assisted', 'worked', 'responsible', 'participated', 'involved',
    'contributed', 'supported', 'aided', 'did', 'made', 'handled', 'served', 'used',
]);

export function calculateATSScore(resume: ParsedResume, keywordResult: KeywordMatchResult): ATSScore {
    const breakdown: ScoreBreakdown = {
        keywordMatch: scoreKeywords(keywordResult),
        formatting: scoreFormatting(resume),
        sectionCompleteness: scoreSections(resume),
        actionVerbs: scoreVerbs(resume),
        quantifiedAchievements: scoreMetrics(resume),
    };

    const overall = Math.max(0, Math.min(100, Math.round(
        breakdown.keywordMatch.weighted + breakdown.formatting.weighted +
        breakdown.sectionCompleteness.weighted + breakdown.actionVerbs.weighted +
        breakdown.quantifiedAchievements.weighted
    )));

    return { overall, breakdown, grade: getGrade(overall), gradeLabel: getGradeLabel(overall) };
}

function scoreKeywords(r: KeywordMatchResult): DimensionScore {
    const w = 0.4;
    const s = r.matchPercentage;
    const d = s >= 80 ? `Excellent: ${r.matchedCount}/${r.totalCount} keywords matched`
        : s >= 60 ? `Good but ${r.missingCount} keywords missing`
            : `Low coverage: ${r.matchedCount}/${r.totalCount} matched`;
    return { score: s, weight: w, weighted: s * w, details: d };
}

function scoreFormatting(resume: ParsedResume): DimensionScore {
    const w = 0.2;
    let s = 100;
    const issues: string[] = [];

    if (resume.metadata.wordCount < 150) { s -= 25; issues.push('Resume too short'); }
    else if (resume.metadata.wordCount > 1200) { s -= 15; issues.push('Resume too long'); }
    if (!resume.metadata.hasEmail) { s -= 15; issues.push('No email detected'); }
    if (!resume.metadata.hasPhone) { s -= 10; issues.push('No phone detected'); }
    if (!resume.metadata.hasLinkedIn && !resume.metadata.hasGitHub) { s -= 10; issues.push('No LinkedIn/GitHub'); }

    const special = (resume.rawText.match(/[^\x20-\x7E\n]/g) || []).length;
    if (special > resume.rawText.length * 0.1) { s -= 15; issues.push('Too many special characters'); }

    s = Math.max(0, s);
    return { score: s, weight: w, weighted: s * w, details: issues.length ? issues.join('. ') : 'Clean ATS-compatible formatting' };
}

function scoreSections(resume: ParsedResume): DimensionScore {
    const w = 0.2;
    const types = resume.sections.map(s => s.type);
    let s = 0;
    const found: string[] = [], missing: string[] = [];

    for (const req of ['experience', 'education', 'skills'] as const) {
        if (types.includes(req)) { s += 20; found.push(req); } else missing.push(req);
    }
    for (const nice of ['summary', 'projects', 'certifications'] as const) {
        if (types.includes(nice)) { s += 13; found.push(nice); }
    }

    s = Math.min(100, s);
    const d = missing.length ? `Missing: ${missing.join(', ')}` : `All key sections present: ${found.join(', ')}`;
    return { score: s, weight: w, weighted: s * w, details: d };
}

function scoreVerbs(resume: ParsedResume): DimensionScore {
    const w = 0.1;
    const sec = resume.sections.find(s => s.type === 'experience' || s.type === 'projects');
    if (!sec || sec.bulletPoints.length === 0) {
        return { score: 30, weight: w, weighted: 30 * w, details: 'No bullet points found' };
    }

    let strong = 0, weak = 0;
    for (const b of sec.bulletPoints) {
        const first = b.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
        if (STRONG_VERBS.has(first)) strong++;
        else if (WEAK_VERBS.has(first)) weak++;
    }

    const s = Math.max(0, Math.min(100, Math.round((strong / sec.bulletPoints.length) * 100) - weak * 10));
    const d = weak > 0 ? `${weak} weak verb(s) found. Use "architected", "optimized", "delivered" instead`
        : strong > 0 ? `Great: ${strong} strong action verbs used` : 'Start bullets with strong action verbs';
    return { score: s, weight: w, weighted: s * w, details: d };
}

function scoreMetrics(resume: ParsedResume): DimensionScore {
    const w = 0.1;
    const qPattern = /\d+[%+]|\$[\d,.]+|\d+x|\d+\s*(users|customers|clients|projects|team|months|years|percent|reduction|increase|growth|improvement)/i;
    const mPattern = /\b(increased|decreased|reduced|improved|grew|saved|generated|achieved|delivered|boosted)\b.*?\d/i;

    let qCount = 0, total = 0;
    for (const sec of resume.sections) {
        if (sec.type === 'experience' || sec.type === 'projects') {
            for (const b of sec.bulletPoints) {
                total++;
                if (qPattern.test(b) || mPattern.test(b)) qCount++;
            }
        }
    }

    const rawMetrics = resume.rawText.match(/\d+[%+]|\$[\d,.]+/g);
    const s = total > 0 ? Math.min(100, Math.round((qCount / total) * 100))
        : rawMetrics?.length ? 40 : 0;

    const d = qCount > 3 ? `Excellent: ${qCount} quantified achievements`
        : qCount > 0 ? `${qCount} metrics found. Add more like "Reduced load time by 40%"`
            : 'No metrics found. Add quantified results: percentages, user counts, revenue';
    return { score: s, weight: w, weighted: s * w, details: d };
}

function getGrade(s: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (s >= 85) return 'A'; if (s >= 70) return 'B'; if (s >= 55) return 'C'; if (s >= 40) return 'D'; return 'F';
}

function getGradeLabel(s: number): string {
    if (s >= 85) return 'Excellent — Highly ATS-compatible';
    if (s >= 70) return 'Good — Minor improvements recommended';
    if (s >= 55) return 'Fair — Several areas need improvement';
    if (s >= 40) return 'Needs Work — Significant optimization required';
    return 'Critical — Major revision needed';
}
