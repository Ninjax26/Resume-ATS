# Resume ATS Analyzer
WEBSITE LINK:-https://resumeninjax.netlify.app/

A frontend-first ATS checker that parses resumes in the browser and scores them against a job description.

## What It Does

- Upload resume files (`.pdf`, `.docx`, `.txt`)
- Extract and normalize resume text locally in-browser
- Parse job description keywords and match against resume content
- Compute weighted ATS score across 5 dimensions
- Generate actionable feedback and optimization suggestions
- Export a downloadable HTML report

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS + Radix UI (shadcn patterns)
- Framer Motion + Three.js / React Three Fiber

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- Analysis history is stored in `localStorage` (last 10 runs).
- No server is required for core parsing/scoring flow.
