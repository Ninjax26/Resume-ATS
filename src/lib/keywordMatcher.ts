/**
 * Keyword Matching Engine
 * Extracts keywords from job descriptions and matches them against resume content.
 * Supports exact match, partial match, and synonym detection.
 */

import { KeywordHighlight } from '@/types/ats';

export interface KeywordMatchResult {
    keywords: KeywordHighlight[];
    matchedCount: number;
    partialCount: number;
    missingCount: number;
    totalCount: number;
    matchPercentage: number;
}

// Common stop words to filter out
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need',
    'must', 'that', 'this', 'these', 'those', 'it', 'its', 'i', 'we',
    'you', 'he', 'she', 'they', 'me', 'us', 'him', 'her', 'them', 'my',
    'our', 'your', 'his', 'their', 'not', 'no', 'nor', 'if', 'then',
    'else', 'when', 'up', 'out', 'so', 'than', 'too', 'very', 'just',
    'about', 'above', 'after', 'again', 'all', 'also', 'am', 'any',
    'because', 'before', 'between', 'both', 'each', 'few', 'get',
    'got', 'how', 'into', 'more', 'most', 'new', 'now', 'off', 'old',
    'only', 'other', 'over', 'own', 'same', 'set', 'some', 'still',
    'such', 'take', 'through', 'under', 'well', 'what', 'where',
    'which', 'while', 'who', 'whom', 'why', 'will', 'work', 'working',
    'able', 'experience', 'using', 'including', 'within', 'across',
    'strong', 'ability', 'etc', 'role', 'team', 'looking', 'join',
    'responsibilities', 'requirements', 'qualifications', 'preferred',
    'required', 'minimum', 'years', 'year', 'plus', 'equivalent',
]);

// Known multi-word technical terms
const MULTI_WORD_TERMS = [
    'machine learning', 'deep learning', 'natural language processing',
    'computer vision', 'data science', 'data engineering', 'data analysis',
    'full stack', 'front end', 'frontend', 'back end', 'backend',
    'web development', 'mobile development', 'cloud computing',
    'ci cd', 'ci/cd', 'rest api', 'restful api', 'graphql api',
    'object oriented', 'test driven', 'agile methodology',
    'project management', 'product management', 'user experience',
    'user interface', 'ui ux', 'ui/ux', 'version control',
    'amazon web services', 'google cloud', 'microsoft azure',
    'node js', 'node.js', 'react js', 'react.js', 'vue js', 'vue.js',
    'angular js', 'angular.js', 'next js', 'next.js', 'express js',
    'type script', 'typescript', 'java script', 'javascript',
    'ruby on rails', 'spring boot', 'asp net', '.net core',
    'react native', 'flutter', 'swift ui', 'swiftui',
    'sql server', 'sql database', 'nosql database',
    'power bi', 'tableau', 'data visualization',
    'unit testing', 'integration testing', 'end to end testing',
    'docker compose', 'kubernetes cluster', 'container orchestration',
    'api design', 'system design', 'software architecture',
    'cross functional', 'problem solving', 'critical thinking',
];

// Synonym mappings for common technology aliases
const SYNONYMS: Record<string, string[]> = {
    'javascript': ['js', 'ecmascript', 'es6', 'es2015', 'es2020'],
    'typescript': ['ts'],
    'python': ['py'],
    'react': ['reactjs', 'react.js'],
    'vue': ['vuejs', 'vue.js'],
    'angular': ['angularjs', 'angular.js'],
    'node.js': ['nodejs', 'node'],
    'next.js': ['nextjs', 'next'],
    'express': ['expressjs', 'express.js'],
    'mongodb': ['mongo'],
    'postgresql': ['postgres', 'psql'],
    'mysql': ['mariadb'],
    'aws': ['amazon web services', 'amazon cloud'],
    'gcp': ['google cloud', 'google cloud platform'],
    'azure': ['microsoft azure', 'ms azure'],
    'docker': ['containerization', 'containers'],
    'kubernetes': ['k8s'],
    'ci/cd': ['ci cd', 'continuous integration', 'continuous deployment', 'continuous delivery'],
    'rest': ['restful', 'rest api'],
    'graphql': ['graph ql'],
    'git': ['version control', 'github', 'gitlab', 'bitbucket'],
    'agile': ['scrum', 'kanban', 'sprint'],
    'machine learning': ['ml', 'artificial intelligence', 'ai'],
    'deep learning': ['dl', 'neural networks', 'neural network'],
    'nlp': ['natural language processing'],
    'sql': ['structured query language'],
    'nosql': ['non-relational database', 'document database'],
    'api': ['apis', 'web services', 'microservices'],
    'html': ['html5'],
    'css': ['css3', 'stylesheet', 'stylesheets'],
    'sass': ['scss'],
    'redis': ['caching', 'in-memory database'],
    'elasticsearch': ['elastic search', 'elk'],
    'terraform': ['infrastructure as code', 'iac'],
};

/**
 * Extract keywords from a job description
 */
export function extractJobKeywords(jobDescription: string): string[] {
    const text = jobDescription.toLowerCase();
    const keywords: Set<string> = new Set();

    // Step 1: Extract multi-word terms first
    for (const term of MULTI_WORD_TERMS) {
        if (text.includes(term.toLowerCase())) {
            keywords.add(term.toLowerCase());
        }
    }

    // Step 2: Extract individual technical terms
    // Tokenize and clean
    const words = text
        .replace(/[^a-zA-Z0-9#+.\-\/\s]/g, ' ')
        .split(/\s+/)
        .map((w) => w.trim().toLowerCase())
        .filter((w) => w.length > 1);

    // Find unique meaningful words
    for (const word of words) {
        if (STOP_WORDS.has(word)) continue;
        if (word.length < 2) continue;
        if (/^\d+$/.test(word)) continue; // Skip pure numbers

        // Check if it's a technical term or skill
        if (isTechnicalTerm(word)) {
            keywords.add(word);
        }
    }

    // Step 3: Extract skills from common patterns
    // "Required skills: X, Y, Z" pattern
    const skillsPatterns = [
        /(?:required|preferred|desired|key|core|essential|must.have)\s*(?:skills?|qualifications?|requirements?|competencies?)\s*[:;\-]\s*([^\n]+)/gi,
        /(?:proficiency|experience|expertise|knowledge|familiarity)\s+(?:in|with)\s+([^\n.]+)/gi,
        /(?:skills?|technologies?|tools?|frameworks?|languages?)\s*[:]\s*([^\n]+)/gi,
    ];

    for (const pattern of skillsPatterns) {
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(jobDescription)) !== null) {
            const skillsText = match[1];
            const skills = skillsText
                .split(/[,;\/&]/)
                .map((s) => s.trim().toLowerCase())
                .filter((s) => s.length > 1 && s.length < 40);

            for (const skill of skills) {
                if (!STOP_WORDS.has(skill)) {
                    keywords.add(skill);
                }
            }
        }
    }

    return Array.from(keywords).sort();
}

/**
 * Check if a word is likely a technical term
 */
function isTechnicalTerm(word: string): boolean {
    // Known programming languages and technologies
    const techTerms = new Set([
        'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby',
        'go', 'golang', 'rust', 'swift', 'kotlin', 'scala', 'php', 'perl',
        'r', 'matlab', 'julia', 'dart', 'lua', 'haskell', 'elixir', 'clojure',
        'react', 'angular', 'vue', 'svelte', 'ember', 'backbone',
        'node', 'express', 'django', 'flask', 'fastapi', 'spring', 'rails',
        'laravel', 'asp.net', '.net', 'nextjs', 'nuxt', 'gatsby',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
        'jenkins', 'circleci', 'github', 'gitlab', 'bitbucket',
        'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
        'dynamodb', 'cassandra', 'firebase', 'supabase', 'prisma',
        'graphql', 'rest', 'grpc', 'websocket', 'kafka', 'rabbitmq',
        'html', 'css', 'sass', 'scss', 'less', 'tailwind', 'bootstrap',
        'webpack', 'vite', 'babel', 'eslint', 'prettier',
        'git', 'linux', 'unix', 'bash', 'powershell',
        'sql', 'nosql', 'api', 'microservices', 'serverless',
        'oauth', 'jwt', 'saml', 'sso',
        'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
        'figma', 'sketch', 'adobe', 'photoshop', 'illustrator',
        'jira', 'confluence', 'slack', 'trello', 'asana',
        'agile', 'scrum', 'kanban', 'devops', 'sre',
        'cicd', 'ci/cd', 'tdd', 'bdd',
        'redux', 'mobx', 'zustand', 'recoil',
        'storybook', 'cypress', 'jest', 'mocha', 'chai', 'selenium',
        'nginx', 'apache', 'caddy',
        'lambda', 'ec2', 's3', 'rds', 'ecs', 'eks', 'fargate',
        'hadoop', 'spark', 'airflow', 'dbt',
        'snowflake', 'bigquery', 'redshift', 'databricks',
        'tableau', 'looker', 'metabase', 'grafana',
        'ansible', 'puppet', 'chef',
        'prometheus', 'datadog', 'newrelic', 'splunk',
    ]);

    // Soft skills that are commonly keywords
    const softSkills = new Set([
        'leadership', 'communication', 'collaboration', 'mentoring',
        'analytical', 'strategic', 'innovative', 'autonomous',
        'scalability', 'optimization', 'architecture', 'debugging',
        'deployment', 'monitoring', 'security', 'performance',
        'accessibility', 'internationalization', 'localization',
        'documentation', 'testing', 'automation', 'refactoring',
    ]);

    return techTerms.has(word) || softSkills.has(word);
}

/**
 * Match extracted keywords against resume text
 */
export function matchKeywords(
    jobKeywords: string[],
    resumeText: string
): KeywordMatchResult {
    const resumeLower = resumeText.toLowerCase();
    const keywords: KeywordHighlight[] = [];

    let matchedCount = 0;
    let partialCount = 0;
    let missingCount = 0;

    for (const keyword of jobKeywords) {
        const status = getMatchStatus(keyword, resumeLower);
        keywords.push({ text: keyword, status });

        switch (status) {
            case 'matched':
                matchedCount++;
                break;
            case 'partial':
                partialCount++;
                break;
            case 'missing':
                missingCount++;
                break;
        }
    }

    const totalCount = jobKeywords.length;
    const matchPercentage =
        totalCount > 0
            ? Math.round(((matchedCount + partialCount * 0.5) / totalCount) * 100)
            : 0;

    // Sort: matched first, then partial, then missing
    keywords.sort((a, b) => {
        const order = { matched: 0, partial: 1, missing: 2 };
        return order[a.status] - order[b.status];
    });

    return {
        keywords,
        matchedCount,
        partialCount,
        missingCount,
        totalCount,
        matchPercentage,
    };
}

/**
 * Determine match status for a single keyword
 */
function getMatchStatus(
    keyword: string,
    resumeLower: string
): 'matched' | 'partial' | 'missing' {
    // Direct match
    if (resumeLower.includes(keyword)) {
        return 'matched';
    }

    // Check synonyms
    const synonymKey = Object.keys(SYNONYMS).find(
        (k) => k === keyword || SYNONYMS[k].includes(keyword)
    );

    if (synonymKey) {
        // Check if any synonym is in the resume
        const allVariants = [synonymKey, ...SYNONYMS[synonymKey]];
        for (const variant of allVariants) {
            if (resumeLower.includes(variant)) {
                return 'matched';
            }
        }
    }

    // Check for partial matches (e.g., "react" matches "react.js" or "reactjs")
    const keywordWords = keyword.split(/[\s\-\/\.]+/);
    if (keywordWords.length > 1) {
        // Multi-word: check if all words appear somewhere
        const allPresent = keywordWords.every(
            (w) => w.length < 2 || resumeLower.includes(w)
        );
        if (allPresent) return 'partial';

        // At least half the words present
        const presentCount = keywordWords.filter(
            (w) => w.length >= 2 && resumeLower.includes(w)
        ).length;
        if (presentCount >= keywordWords.length / 2) return 'partial';
    }

    // Single word partial: check for stem matches
    if (keyword.length >= 4) {
        const stem = keyword.slice(0, -2); // Simple stemming
        if (stem.length >= 3 && resumeLower.includes(stem)) {
            return 'partial';
        }
    }

    return 'missing';
}
