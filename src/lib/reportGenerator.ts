/**
 * HTML Report Generator
 * Creates a styled, downloadable HTML report from ATS analysis results.
 */

import { ATSScore, ScoreBreakdown } from './atsScorer';
import { KeywordMatchResult } from './keywordMatcher';
import { FeedbackSection } from '@/types/ats';

export function downloadHTMLReport(
    score: ATSScore,
    keywords: KeywordMatchResult,
    feedback: FeedbackSection[],
    fileName: string
) {
    const html = buildReportHTML(score, keywords, feedback, fileName);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ats-report-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
}

function buildReportHTML(
    score: ATSScore,
    keywords: KeywordMatchResult,
    feedback: FeedbackSection[],
    fileName: string
): string {
    const b = score.breakdown;
    const scoreColor = score.overall >= 80 ? '#00FF88' : score.overall >= 60 ? '#FFB800' : '#FF3366';

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ATS Report — ${fileName}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #0A0A0F; color: #F4F4F6; padding: 40px; line-height: 1.6; }
  .container { max-width: 800px; margin: 0 auto; }
  .header { text-align: center; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid rgba(160,160,171,0.2); }
  .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
  .header .subtitle { color: #A0A0AB; font-size: 14px; }
  .score-ring { width: 160px; height: 160px; margin: 32px auto; position: relative; }
  .score-ring svg { transform: rotate(-90deg); }
  .score-number { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .score-number .value { font-size: 48px; font-weight: 800; font-family: 'SF Mono', 'Consolas', monospace; color: ${scoreColor}; }
  .score-number .label { font-size: 13px; color: #A0A0AB; }
  .grade-badge { display: inline-block; padding: 8px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; margin-top: 16px;
    background: ${scoreColor}15; border: 1px solid ${scoreColor}40; color: ${scoreColor}; }
  .section { margin: 40px 0; }
  .section h2 { font-size: 20px; font-weight: 700; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid rgba(160,160,171,0.15); }
  .breakdown-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .dim-card { padding: 16px; border-radius: 10px; background: #16161D; border: 1px solid rgba(160,160,171,0.1); }
  .dim-card .dim-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .dim-card .dim-name { font-weight: 600; font-size: 14px; }
  .dim-card .dim-score { font-family: monospace; font-weight: 700; font-size: 16px; }
  .dim-card .dim-bar { height: 6px; background: rgba(160,160,171,0.15); border-radius: 3px; overflow: hidden; margin-bottom: 8px; }
  .dim-card .dim-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
  .dim-card .dim-detail { font-size: 12px; color: #A0A0AB; }
  .kw-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .kw-badge { padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; }
  .kw-matched { background: #00FF8820; color: #00FF88; border: 1px solid #00FF8840; }
  .kw-partial { background: #FFB80020; color: #FFB800; border: 1px solid #FFB80040; }
  .kw-missing { background: #FF336620; color: #FF3366; border: 1px solid #FF336640; }
  .feedback-card { padding: 14px 18px; border-radius: 8px; margin-bottom: 10px; border: 1px solid rgba(160,160,171,0.1); background: #16161D; }
  .feedback-card .sev-icon { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; vertical-align: middle; }
  .sev-success { background: #00FF88; }
  .sev-warning { background: #FFB800; }
  .sev-error { background: #FF3366; }
  .feedback-card .fb-title { font-weight: 600; font-size: 14px; }
  .feedback-card .fb-desc { font-size: 13px; color: #A0A0AB; margin-top: 4px; }
  .footer { text-align: center; margin-top: 48px; padding-top: 24px; border-top: 1px solid rgba(160,160,171,0.15); color: #A0A0AB; font-size: 12px; }
  @media print { body { background: white; color: #111; }
    .dim-card, .feedback-card { border-color: #ddd; background: #f9f9f9; }
    .kw-badge { border-color: #ccc; } }
</style>
</head>
<body>
<div class="container">

  <div class="header">
    <h1>ATS Compatibility Report</h1>
    <div class="subtitle">${fileName} · ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>

    <div class="score-ring">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(160,160,171,0.15)" stroke-width="10"/>
        <circle cx="80" cy="80" r="68" fill="none" stroke="${scoreColor}" stroke-width="10"
          stroke-linecap="round" stroke-dasharray="${2 * Math.PI * 68}"
          stroke-dashoffset="${2 * Math.PI * 68 * (1 - score.overall / 100)}"/>
      </svg>
      <div class="score-number">
        <span class="value">${score.overall}</span>
        <span class="label">/ 100</span>
      </div>
    </div>
    <div class="grade-badge">${score.grade} — ${score.gradeLabel}</div>
  </div>

  <div class="section">
    <h2>Score Breakdown</h2>
    <div class="breakdown-grid">
      ${renderDimCard('Keywords', b.keywordMatch)}
      ${renderDimCard('Formatting', b.formatting)}
      ${renderDimCard('Sections', b.sectionCompleteness)}
      ${renderDimCard('Action Verbs', b.actionVerbs)}
      ${renderDimCard('Metrics', b.quantifiedAchievements)}
    </div>
  </div>

  <div class="section">
    <h2>Keyword Analysis</h2>
    <p style="color:#A0A0AB;font-size:14px;margin-bottom:8px;">
      ${keywords.matchedCount} matched · ${keywords.partialCount} partial · ${keywords.missingCount} missing
      · <b>${keywords.matchPercentage}%</b> match rate
    </p>
    ${renderKeywordGroup('Matched', keywords.keywords.filter(k => k.status === 'matched'), 'kw-matched')}
    ${renderKeywordGroup('Partial', keywords.keywords.filter(k => k.status === 'partial'), 'kw-partial')}
    ${renderKeywordGroup('Missing', keywords.keywords.filter(k => k.status === 'missing'), 'kw-missing')}
  </div>

  <div class="section">
    <h2>Detailed Feedback</h2>
    ${feedback.map(s => `
      <h3 style="font-size:15px;font-weight:600;margin:20px 0 10px;color:#00E5FF;">${s.title}</h3>
      ${s.suggestions.map(sg => `
        <div class="feedback-card">
          <div><span class="sev-icon sev-${sg.severity}"></span><span class="fb-title">${sg.title}</span></div>
          <div class="fb-desc">${sg.description}</div>
        </div>
      `).join('')}
    `).join('')}
  </div>

  <div class="footer">
    Generated by résumé ATS Analyzer · ${new Date().toLocaleString()}
  </div>
</div>
</body>
</html>`;
}

function renderDimCard(name: string, dim: { score: number; weight: number; details: string }) {
    const color = dim.score >= 70 ? '#00FF88' : dim.score >= 40 ? '#FFB800' : '#FF3366';
    return `<div class="dim-card">
    <div class="dim-header">
      <span class="dim-name">${name} <span style="color:#A0A0AB;font-weight:400;font-size:12px;">(${dim.weight * 100}%)</span></span>
      <span class="dim-score" style="color:${color}">${Math.round(dim.score)}</span>
    </div>
    <div class="dim-bar"><div class="dim-fill" style="width:${dim.score}%;background:${color}"></div></div>
    <div class="dim-detail">${dim.details}</div>
  </div>`;
}

function renderKeywordGroup(label: string, items: { text: string }[], cls: string) {
    if (items.length === 0) return '';
    return `<div style="margin-top:12px;">
    <div style="font-size:12px;color:#A0A0AB;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">${label}</div>
    <div class="kw-grid">${items.map(k => `<span class="kw-badge ${cls}">${k.text}</span>`).join('')}</div>
  </div>`;
}
