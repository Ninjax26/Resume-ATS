/**
 * Analysis History — localStorage persistence
 * Stores up to 10 recent analysis results (FIFO).
 */

export interface HistoryEntry {
    id: string;
    fileName: string;
    date: string;
    overallScore: number;
    grade: string;
    gradeLabel: string;
    matchPercentage: number;
    topMissing: string[];
}

const STORAGE_KEY = 'resume-ats-history';
const MAX_ENTRIES = 10;

export function saveToHistory(entry: Omit<HistoryEntry, 'id' | 'date'>): void {
    const history = getHistory();
    const newEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
    };
    history.unshift(newEntry);
    if (history.length > MAX_ENTRIES) history.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getHistory(): HistoryEntry[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
}
