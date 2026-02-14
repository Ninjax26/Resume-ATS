/**
 * Dynamic Feedback Generator
 * Produces contextual, section-specific feedback and optimization suggestions
 * based on actual resume content and keyword analysis.
 */

import { ParsedResume } from './resumeParser';
import { KeywordMatchResult } from './keywordMatcher';
import { ATSScore } from './atsScorer';
import { FeedbackSection, Suggestion, OptimizeSuggestion } from '@/types/ats';

/**
 * Generate feedback sections based on real analysis
 */
export function generateFeedback(
    resume: ParsedResume,
    keywords: KeywordMatchResult,
    score: ATSScore
): FeedbackSection[] {
    const sections: FeedbackSection[] = [];

    // 1. Overall Score Feedback
    sections.push(generateOverallFeedback(score));

    // 2. Keyword Match Feedback
    sections.push(generateKeywordFeedback(keywords));

    // 3. Section-specific feedback
    const bd = score.breakdown;
    sections.push({
        title: 'Resume Structure',
        suggestions: [
            createSuggestion(bd.sectionCompleteness.score, bd.sectionCompleteness.details),
            createSuggestion(bd.formatting.score, bd.formatting.details),
        ],
    });

    // 4. Writing Quality
    sections.push({
        title: 'Writing Quality',
        suggestions: [
            createSuggestion(bd.actionVerbs.score, bd.actionVerbs.details),
            createSuggestion(bd.quantifiedAchievements.score, bd.quantifiedAchievements.details),
        ],
    });

    // 5. Contact & Professional Presence
    sections.push(generateContactFeedback(resume));

    return sections;
}

function generateOverallFeedback(score: ATSScore): FeedbackSection {
    const suggestions: Suggestion[] = [];
    const s = score.overall;

    if (s >= 85) {
        suggestions.push({
            severity: 'success',
            title: 'Excellent ATS Compatibility',
            description: `Your resume scored ${s}/100. It's well-optimized for ATS parsing.`,
        });
    } else if (s >= 70) {
        suggestions.push({
            severity: 'success',
            title: `Good Score: ${s}/100`,
            description: 'Your resume is above average. A few targeted improvements could push it higher.',
        });
    } else if (s >= 55) {
        suggestions.push({
            severity: 'warning',
            title: `Fair Score: ${s}/100`,
            description: 'Your resume needs improvement in several areas to be competitive.',
        });
    } else {
        suggestions.push({
            severity: 'error',
            title: `Low Score: ${s}/100`,
            description: 'Your resume needs significant optimization to pass ATS filters.',
        });
    }

    return { title: 'Overall Assessment', suggestions };
}

function generateKeywordFeedback(keywords: KeywordMatchResult): FeedbackSection {
    const suggestions: Suggestion[] = [];

    if (keywords.matchedCount > 0) {
        const matched = keywords.keywords
            .filter(k => k.status === 'matched')
            .slice(0, 5)
            .map(k => k.text);
        suggestions.push({
            severity: 'success',
            title: `${keywords.matchedCount} Keywords Matched`,
            description: `Found: ${matched.join(', ')}${keywords.matchedCount > 5 ? ` and ${keywords.matchedCount - 5} more` : ''}`,
        });
    }

    if (keywords.partialCount > 0) {
        const partial = keywords.keywords
            .filter(k => k.status === 'partial')
            .slice(0, 4)
            .map(k => k.text);
        suggestions.push({
            severity: 'warning',
            title: `${keywords.partialCount} Partial Matches`,
            description: `Consider reinforcing: ${partial.join(', ')}. Use the exact phrasing from the job description.`,
        });
    }

    if (keywords.missingCount > 0) {
        const missing = keywords.keywords
            .filter(k => k.status === 'missing')
            .slice(0, 5)
            .map(k => k.text);
        suggestions.push({
            severity: 'error',
            title: `${keywords.missingCount} Keywords Missing`,
            description: `Add these to your resume: ${missing.join(', ')}${keywords.missingCount > 5 ? ` and ${keywords.missingCount - 5} more` : ''}`,
        });
    }

    return { title: 'Keyword Analysis', suggestions };
}

function generateContactFeedback(resume: ParsedResume): FeedbackSection {
    const suggestions: Suggestion[] = [];
    const m = resume.metadata;

    if (m.hasEmail && m.hasPhone) {
        suggestions.push({ severity: 'success', title: 'Contact Info Complete', description: 'Email and phone number detected.' });
    } else {
        const missing = [];
        if (!m.hasEmail) missing.push('email');
        if (!m.hasPhone) missing.push('phone number');
        suggestions.push({ severity: 'error', title: 'Missing Contact Info', description: `Add your ${missing.join(' and ')} — recruiters need this.` });
    }

    if (m.hasLinkedIn) {
        suggestions.push({ severity: 'success', title: 'LinkedIn Present', description: 'LinkedIn profile link detected.' });
    } else {
        suggestions.push({ severity: 'warning', title: 'Add LinkedIn Profile', description: 'Include your LinkedIn URL — 87% of recruiters use it.' });
    }

    if (m.hasGitHub) {
        suggestions.push({ severity: 'success', title: 'GitHub Present', description: 'GitHub profile link detected.' });
    }

    return { title: 'Professional Presence', suggestions };
}

function createSuggestion(score: number, details: string): Suggestion {
    return {
        severity: score >= 70 ? 'success' : score >= 40 ? 'warning' : 'error',
        title: score >= 70 ? '✓ Good' : score >= 40 ? '⚠ Needs Improvement' : '✗ Critical Issue',
        description: details,
    };
}

/**
 * Generate optimization suggestions comparing resume content to job keywords
 */
export function generateOptimizeSuggestions(
    resume: ParsedResume,
    keywords: KeywordMatchResult
): OptimizeSuggestion[] {
    const suggestions: OptimizeSuggestion[] = [];

    // Find bullet points that could be improved
    for (const section of resume.sections) {
        if (section.type !== 'experience' && section.type !== 'projects') continue;

        for (const bullet of section.bulletPoints.slice(0, 5)) {
            const firstWord = bullet.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
            const hasWeakVerb = ['helped', 'assisted', 'worked', 'responsible', 'participated', 'involved', 'used', 'handled'].includes(firstWord);
            const hasMetrics = /\d+[%+]|\$[\d,.]+/.test(bullet);

            if (hasWeakVerb || !hasMetrics) {
                const improved = improveBullet(bullet, hasWeakVerb, hasMetrics, keywords);
                if (improved !== bullet) {
                    suggestions.push({
                        original: bullet.length > 100 ? bullet.substring(0, 97) + '...' : bullet,
                        improved: improved,
                        reason: hasWeakVerb
                            ? 'Replaced weak verb with a strong action verb and added specificity for ATS matching.'
                            : 'Added quantified metrics — ATS systems and recruiters favor measurable impact.',
                    });
                }
            }
            if (suggestions.length >= 5) break;
        }
        if (suggestions.length >= 5) break;
    }

    // Add keyword-based suggestions for missing terms
    const missing = keywords.keywords.filter(k => k.status === 'missing').slice(0, 3);
    for (const kw of missing) {
        if (suggestions.length >= 5) break;
        suggestions.push({
            original: `(Missing keyword in resume)`,
            improved: `Add "${kw.text}" to your Skills or Experience section where relevant`,
            reason: `"${kw.text}" appears in the job description but is absent from your resume. ATS will flag this gap.`,
        });
    }

    return suggestions;
}

function improveBullet(bullet: string, hasWeakVerb: boolean, hasMetrics: boolean, _keywords: KeywordMatchResult): string {
    let improved = bullet;

    if (hasWeakVerb) {
        const replacements: Record<string, string> = {
            'helped': 'Facilitated', 'assisted': 'Supported and delivered',
            'worked': 'Developed', 'responsible': 'Owned and managed',
            'participated': 'Contributed to', 'involved': 'Drove',
            'used': 'Leveraged', 'handled': 'Managed',
        };
        const first = bullet.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
        const replacement = replacements[first];
        if (replacement) {
            improved = replacement + improved.substring(improved.indexOf(' '));
        }
    }

    if (!hasMetrics) {
        improved += ' — [Add specific metrics: %, number of users, time saved, etc.]';
    }

    return improved;
}
