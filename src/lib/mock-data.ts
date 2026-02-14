import { KeywordHighlight, FeedbackSection, OptimizeSuggestion } from '../types/ats';

export const mockKeywords: KeywordHighlight[] = [
    { text: 'React', status: 'matched' },
    { text: 'TypeScript', status: 'matched' },
    { text: 'Node.js', status: 'matched' },
    { text: 'API Design', status: 'partial' },
    { text: 'Database', status: 'partial' },
    { text: 'Docker', status: 'missing' },
    { text: 'Kubernetes', status: 'missing' },
    { text: 'AWS', status: 'missing' },
];

export const mockFeedbackSections: FeedbackSection[] = [
    {
        title: 'Skills Section',
        suggestions: [
            {
                severity: 'success',
                title: 'Strong Technical Keywords',
                description: 'Your skills section includes relevant technical terms like React, TypeScript, and Node.js that match the job requirements.'
            },
            {
                severity: 'warning',
                title: 'Missing Cloud Technologies',
                description: 'Consider adding AWS, Azure, or GCP experience as these are mentioned in the job description.'
            }
        ]
    },
    {
        title: 'Experience Section',
        suggestions: [
            {
                severity: 'success',
                title: 'Quantified Achievements',
                description: 'Great job including metrics and numbers to demonstrate impact in your previous roles.'
            },
            {
                severity: 'error',
                title: 'Vague Action Verbs',
                description: 'Replace weak verbs like "helped" and "worked on" with strong action verbs like "architected", "implemented", or "optimized".'
            },
            {
                severity: 'warning',
                title: 'Missing Leadership Examples',
                description: 'The job requires team leadership experience. Add examples of mentoring, leading projects, or cross-functional collaboration.'
            }
        ]
    },
    {
        title: 'Projects Section',
        suggestions: [
            {
                severity: 'success',
                title: 'Relevant Project Technologies',
                description: 'Your projects demonstrate hands-on experience with the required technology stack.'
            },
            {
                severity: 'warning',
                title: 'Lack of Business Impact',
                description: 'Include metrics showing how your projects delivered business value (users reached, performance improvements, revenue impact).'
            }
        ]
    }
];

export const mockOptimizeSuggestions: OptimizeSuggestion[] = [
    {
        original: 'Worked on building a web application using React',
        improved: 'Architected and deployed a scalable React web application serving 50K+ daily active users',
        reason: 'This revision uses a strong action verb, adds quantifiable metrics, and emphasizes scalability - key terms ATS systems look for.'
    },
    {
        original: 'Helped with database optimization',
        improved: 'Optimized PostgreSQL database queries, reducing average response time by 60% and improving application throughput',
        reason: 'Specific technology mention (PostgreSQL), quantified improvement (60%), and clear business impact make this much stronger for ATS parsing.'
    },
    {
        original: 'Experience with cloud services',
        improved: 'Deployed and managed production infrastructure on AWS (EC2, S3, RDS, Lambda) supporting 99.9% uptime SLA',
        reason: 'Lists specific AWS services by name, which ATS systems can match against job requirements. Includes reliability metric (99.9% uptime).'
    }
];
