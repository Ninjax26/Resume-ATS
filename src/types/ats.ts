export type AppState = 'hero' | 'upload' | 'analyzing' | 'results';

export interface KeywordHighlight {
    text: string;
    status: 'matched' | 'partial' | 'missing';
}

export interface Suggestion {
    severity: 'success' | 'warning' | 'error';
    title: string;
    description: string;
}

export interface FeedbackSection {
    title: string;
    suggestions: Suggestion[];
}

export interface OptimizeSuggestion {
    original: string;
    improved: string;
    reason: string;
}
