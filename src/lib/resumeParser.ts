/**
 * Resume Parser Service
 * Extracts text content from uploaded PDF and DOCX files using browser-native APIs.
 * Detects resume sections (Skills, Experience, Education, Projects, Summary).
 */

export interface ParsedResume {
    rawText: string;
    sections: ResumeSection[];
    metadata: ResumeMetadata;
}

export interface ResumeSection {
    name: string;
    type: SectionType;
    content: string;
    bulletPoints: string[];
}

export type SectionType =
    | 'contact'
    | 'summary'
    | 'experience'
    | 'education'
    | 'skills'
    | 'projects'
    | 'certifications'
    | 'other';

export interface ResumeMetadata {
    fileName: string;
    fileSize: number;
    fileType: string;
    wordCount: number;
    characterCount: number;
    hasEmail: boolean;
    hasPhone: boolean;
    hasLinkedIn: boolean;
    hasGitHub: boolean;
}

// Section header patterns for detection
const SECTION_PATTERNS: Record<SectionType, RegExp[]> = {
    contact: [/^(contact\s*(info|information|details)?|personal\s*(info|information|details)?)$/i],
    summary: [
        /^(summary|objective|profile|about\s*me|professional\s*summary|career\s*summary|executive\s*summary)$/i,
    ],
    experience: [
        /^(experience|work\s*experience|professional\s*experience|employment(\s*history)?|work\s*history)$/i,
    ],
    education: [/^(education|academic|qualifications|degrees?)$/i],
    skills: [
        /^(skills|technical\s*skills|core\s*competencies|competencies|technologies|tech\s*stack|proficiencies)$/i,
    ],
    projects: [/^(projects|personal\s*projects|portfolio|key\s*projects|side\s*projects)$/i],
    certifications: [/^(certifications?|licenses?|certificates?|professional\s*development)$/i],
    other: [],
};

/**
 * Extract text from a File object (PDF or DOCX).
 * Uses FileReader for text-based content.
 * For PDF: extracts text markers from the binary content.
 * For DOCX: extracts text from the XML content within the zip.
 */
export async function parseResume(file: File): Promise<ParsedResume> {
    let rawText = '';

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        rawText = await extractTextFromPDF(file);
    } else if (
        file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.docx')
    ) {
        rawText = await extractTextFromDOCX(file);
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        rawText = await file.text();
    } else {
        // Fallback: try to read as text
        rawText = await file.text();
    }

    // Clean and normalize text
    rawText = normalizeText(rawText);

    const sections = detectSections(rawText);
    const metadata = extractMetadata(file, rawText);

    return { rawText, sections, metadata };
}

/**
 * Extract text from PDF using raw binary parsing.
 * Handles most standard PDF text streams without needing pdf.js.
 */
async function extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Convert to string for text stream extraction
    let pdfString = '';
    for (let i = 0; i < bytes.length; i++) {
        pdfString += String.fromCharCode(bytes[i]);
    }

    const extractedTexts: string[] = [];

    // Method 1: Extract text between BT (begin text) and ET (end text) operators
    const btEtRegex = /BT\s([\s\S]*?)ET/g;
    let match: RegExpExecArray | null;

    while ((match = btEtRegex.exec(pdfString)) !== null) {
        const textBlock = match[1];

        // Extract text from Tj operator (show text)
        const tjRegex = /\(([^)]*)\)\s*Tj/g;
        let tjMatch: RegExpExecArray | null;
        while ((tjMatch = tjRegex.exec(textBlock)) !== null) {
            extractedTexts.push(decodePDFText(tjMatch[1]));
        }

        // Extract text from TJ operator (show text with positioning)
        const tjArrayRegex = /\[(.*?)\]\s*TJ/g;
        let tjArrayMatch: RegExpExecArray | null;
        while ((tjArrayMatch = tjArrayRegex.exec(textBlock)) !== null) {
            const innerTexts = tjArrayMatch[1].match(/\(([^)]*)\)/g);
            if (innerTexts) {
                const combined = innerTexts
                    .map((t) => decodePDFText(t.slice(1, -1)))
                    .join('');
                extractedTexts.push(combined);
            }
        }

        // Extract text from ' operator (move to next line and show text)
        const quoteRegex = /\(([^)]*)\)\s*'/g;
        let quoteMatch: RegExpExecArray | null;
        while ((quoteMatch = quoteRegex.exec(textBlock)) !== null) {
            extractedTexts.push(decodePDFText(quoteMatch[1]));
        }
    }

    // Method 2: Look for stream objects containing readable text
    if (extractedTexts.length === 0) {
        const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
        while ((match = streamRegex.exec(pdfString)) !== null) {
            const streamContent = match[1];
            // Only process streams that look like they contain text
            const readableText = streamContent.replace(/[^\x20-\x7E\r\n]/g, ' ');
            const words = readableText.match(/[a-zA-Z]{2,}/g);
            if (words && words.length > 3) {
                extractedTexts.push(readableText.trim());
            }
        }
    }

    // Combine and clean
    let result = extractedTexts.join('\n');

    // If extraction yielded very little, return a notice
    if (result.trim().length < 50) {
        // Fallback: try extracting any readable strings from the PDF
        const readableStrings = pdfString.match(
            /[\x20-\x7E]{10,}/g
        );
        if (readableStrings) {
            result = readableStrings
                .filter((s) => /[a-zA-Z]/.test(s) && !/^[\/\[\]<>{}()]+$/.test(s))
                .join('\n');
        }
    }

    return result || '[Could not extract text from PDF. Try uploading a text-based PDF or DOCX file.]';
}

/**
 * Decode PDF text escapes
 */
function decodePDFText(text: string): string {
    return text
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\\\/g, '\\')
        .replace(/\\([()])/g, '$1');
}

/**
 * Extract text from DOCX by parsing the XML content.
 * DOCX files are ZIP archives containing XML.
 */
async function extractTextFromDOCX(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // DOCX is a ZIP file — find document.xml within it
    const xmlContent = await extractXMLFromZip(bytes, 'word/document.xml');

    if (!xmlContent) {
        return '[Could not extract text from DOCX file.]';
    }

    // Parse XML to extract text content
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, 'application/xml');

    // Extract all text nodes from w:t elements
    const textElements = doc.querySelectorAll('t');
    const texts: string[] = [];

    // Walk through all elements to maintain paragraph structure
    const paragraphs = doc.querySelectorAll('p');
    paragraphs.forEach((p) => {
        const pTexts: string[] = [];
        p.querySelectorAll('t').forEach((t) => {
            if (t.textContent) {
                pTexts.push(t.textContent);
            }
        });
        if (pTexts.length > 0) {
            texts.push(pTexts.join(''));
        }
    });

    // Fallback if querySelectorAll didn't work (namespace issues)
    if (texts.length === 0 && textElements.length > 0) {
        textElements.forEach((el) => {
            if (el.textContent) texts.push(el.textContent);
        });
    }

    // Final fallback: regex extraction
    if (texts.length === 0) {
        const textRegex = /<w:t[^>]*>([^<]+)<\/w:t>/g;
        let match: RegExpExecArray | null;
        while ((match = textRegex.exec(xmlContent)) !== null) {
            texts.push(match[1]);
        }
    }

    return texts.join('\n') || '[Could not extract text from DOCX file.]';
}

/**
 * Simple ZIP file parser to extract a specific file from a ZIP archive.
 * Handles uncompressed (stored) entries.
 */
async function extractXMLFromZip(
    zipData: Uint8Array,
    targetFile: string
): Promise<string | null> {
    // End of central directory signature (EOCD): PK\x05\x06
    const eocdSignature = 0x06054b50;
    const centralHeaderSignature = 0x02014b50;
    const localHeaderSignature = 0x04034b50;
    const decoder = new TextDecoder();

    // ZIP comment can be up to 65,535 bytes. Scan backwards to locate EOCD.
    const maxScanStart = Math.max(0, zipData.length - 22 - 65535);
    let eocdOffset = -1;
    for (let i = zipData.length - 22; i >= maxScanStart; i--) {
        if (readUInt32LE(zipData, i) === eocdSignature) {
            eocdOffset = i;
            break;
        }
    }

    if (eocdOffset < 0) return null;

    const centralDirSize = readUInt32LE(zipData, eocdOffset + 12);
    const centralDirOffset = readUInt32LE(zipData, eocdOffset + 16);
    const centralDirEnd = centralDirOffset + centralDirSize;

    if (centralDirOffset <= 0 || centralDirEnd > zipData.length) return null;

    let cursor = centralDirOffset;

    while (cursor + 46 <= centralDirEnd) {
        if (readUInt32LE(zipData, cursor) !== centralHeaderSignature) break;

        const compressionMethod = readUInt16LE(zipData, cursor + 10);
        const compressedSize = readUInt32LE(zipData, cursor + 20);
        const uncompressedSize = readUInt32LE(zipData, cursor + 24);
        const fileNameLength = readUInt16LE(zipData, cursor + 28);
        const extraLength = readUInt16LE(zipData, cursor + 30);
        const commentLength = readUInt16LE(zipData, cursor + 32);
        const localHeaderOffset = readUInt32LE(zipData, cursor + 42);

        const fileNameStart = cursor + 46;
        const fileNameEnd = fileNameStart + fileNameLength;
        if (fileNameEnd > zipData.length) return null;

        const fileName = decoder.decode(zipData.slice(fileNameStart, fileNameEnd));

        if (fileName === targetFile) {
            if (readUInt32LE(zipData, localHeaderOffset) !== localHeaderSignature) return null;
            const localNameLength = readUInt16LE(zipData, localHeaderOffset + 26);
            const localExtraLength = readUInt16LE(zipData, localHeaderOffset + 28);
            const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
            const dataEnd = dataStart + compressedSize;
            if (dataStart < 0 || dataEnd > zipData.length) return null;

            const compressedData = zipData.slice(dataStart, dataEnd);
            if (compressionMethod === 0) {
                return decoder.decode(compressedData.slice(0, uncompressedSize || compressedData.length));
            }

            if (compressionMethod === 8) {
                const inflated = await inflateRaw(compressedData);
                if (!inflated) return null;
                return decoder.decode(inflated);
            }

            return null;
        }

        cursor = fileNameEnd + extraLength + commentLength;
    }

    return null;
}

async function inflateRaw(data: Uint8Array): Promise<Uint8Array | null> {
    if (typeof DecompressionStream === 'undefined') return null;

    try {
        const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        const response = new Response(stream);
        const buffer = await response.arrayBuffer();
        return new Uint8Array(buffer);
    } catch {
        return null;
    }
}

function readUInt16LE(data: Uint8Array, offset: number): number {
    return data[offset] | (data[offset + 1] << 8);
}

function readUInt32LE(data: Uint8Array, offset: number): number {
    return (
        data[offset] |
        (data[offset + 1] << 8) |
        (data[offset + 2] << 16) |
        (data[offset + 3] << 24)
    ) >>> 0;
}

/**
 * Normalize extracted text
 */
function normalizeText(text: string): string {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\t/g, ' ')
        .replace(/ {3,}/g, '  ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

/**
 * Detect sections in the resume text
 */
function detectSections(text: string): ResumeSection[] {
    const lines = text.split('\n');
    const sections: ResumeSection[] = [];
    let currentSection: ResumeSection | null = null;
    let contentLines: string[] = [];

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const detectedType = identifySectionType(trimmedLine);

        if (detectedType && detectedType !== 'other') {
            // Save previous section
            if (currentSection) {
                currentSection.content = contentLines.join('\n').trim();
                currentSection.bulletPoints = extractBulletPoints(currentSection.content);
                sections.push(currentSection);
            }

            currentSection = {
                name: trimmedLine,
                type: detectedType,
                content: '',
                bulletPoints: [],
            };
            contentLines = [];
        } else {
            contentLines.push(trimmedLine);
        }
    }

    // Don't forget the last section
    if (currentSection) {
        currentSection.content = contentLines.join('\n').trim();
        currentSection.bulletPoints = extractBulletPoints(currentSection.content);
        sections.push(currentSection);
    }

    // If no sections detected, create a single "other" section
    if (sections.length === 0) {
        sections.push({
            name: 'Full Resume',
            type: 'other',
            content: text,
            bulletPoints: extractBulletPoints(text),
        });
    }

    return sections;
}

/**
 * Identify what type of section a header line represents
 */
function identifySectionType(line: string): SectionType | null {
    const cleanLine = line
        .replace(/[:\-_|*#=]/g, '')
        .trim()
        .toLowerCase();

    for (const [type, patterns] of Object.entries(SECTION_PATTERNS)) {
        for (const pattern of patterns) {
            if (pattern.test(cleanLine)) {
                return type as SectionType;
            }
        }
    }

    // Heuristic: lines that are ALL CAPS and short are likely headers
    if (
        line === line.toUpperCase() &&
        line.length < 40 &&
        line.length > 2 &&
        /^[A-Z\s&\/]+$/.test(line)
    ) {
        // Try partial matches
        const lower = line.toLowerCase();
        if (lower.includes('experience') || lower.includes('employment'))
            return 'experience';
        if (lower.includes('education') || lower.includes('academic'))
            return 'education';
        if (lower.includes('skill') || lower.includes('technolog'))
            return 'skills';
        if (lower.includes('project')) return 'projects';
        if (lower.includes('certif') || lower.includes('licens'))
            return 'certifications';
        if (
            lower.includes('summary') ||
            lower.includes('objective') ||
            lower.includes('profile')
        )
            return 'summary';
    }

    return null;
}

/**
 * Extract bullet points from section content
 */
function extractBulletPoints(content: string): string[] {
    const lines = content.split('\n');
    const bullets: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        // Match lines starting with bullets, dashes, asterisks, or numbers
        if (/^[\u2022\u2023\u25E6\u2043•\-\*\◦]\s*(.+)/.test(trimmed)) {
            bullets.push(trimmed.replace(/^[\u2022\u2023\u25E6\u2043•\-\*\◦]\s*/, ''));
        } else if (/^\d+[\.\)]\s*(.+)/.test(trimmed)) {
            bullets.push(trimmed.replace(/^\d+[\.\)]\s*/, ''));
        } else if (trimmed.length > 20 && /^[A-Z]/.test(trimmed)) {
            // Sentences that look like achievement statements
            bullets.push(trimmed);
        }
    }

    return bullets;
}

/**
 * Extract metadata from the resume
 */
function extractMetadata(file: File, text: string): ResumeMetadata {
    const words = text.split(/\s+/).filter((w) => w.length > 0);

    return {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || file.name.split('.').pop() || 'unknown',
        wordCount: words.length,
        characterCount: text.length,
        hasEmail: /[\w.+-]+@[\w-]+\.[\w.]+/.test(text),
        hasPhone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text),
        hasLinkedIn: /linkedin\.com\/in\//i.test(text),
        hasGitHub: /github\.com\//i.test(text),
    };
}
