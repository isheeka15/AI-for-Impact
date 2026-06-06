# ProtfoliQ 🚀

ProtfoliQ is an AI-powered portfolio readiness platform for CS students, interns, and early-career engineers. It audits GitHub repositories and project presentations, then produces a recruiter-friendly scorecard with targeted improvement recommendations.

---

## What ProtfoliQ Solves

Many student portfolios have strong code but lack recruiter signals: clean documentation, production readiness, security context, and a compelling presentation narrative. ProtfoliQ analyzes both GitHub and presentation content, then surfaces a complete portfolio report that recruiters and hiring managers can easily evaluate.

---

## Features

- GitHub repository audit with code quality, documentation, architecture, and production readiness scoring.
- Presentation review for pitch clarity, objectives, architecture, and future scope.
- Unified ProtfoliQ portfolio score with recruiter view insights, skill inference, and completeness analysis.
- Benchmark comparisons across average student, internship-level, and industry-level portfolios.
- Fun GitHub Roast Mode feedback card for immediate gap identification.
- AI-generated improvement roadmap with actionable, prioritized items.
- Secure Gemini integration through environment variables.

---

## Architecture Overview

ProtfoliQ uses a modern full-stack setup:

- **Frontend**: React 19 + Vite + Tailwind CSS with interactive dashboard cards and responsive visual layouts.
- **Backend**: Express.js server managing GitHub analysis, presentation scoring, and portfolio synthesis.
- **AI Engine**: `@google/genai` with the `gemini-3.5-flash` model for structured JSON evaluation.
- **Storage**: Local JSON files in `data/reports.json` and `data/users.json` for mock persistence.
- **Config**: `.env` for sensitive API keys, never committed to source.

---

## Environment Setup

Create a `.env` file in the project root with:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

> Do not commit your `.env` or your Gemini API key.

---

## Running Locally

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm run dev
```

Open `http://localhost:3000` to use ProtfoliQ.

---

## API Endpoints

### Authentication
- `POST /api/auth/signup`
  - Body: `{ name, email, password }`
- `POST /api/auth/signin`
  - Body: `{ email, password }`

### Analysis
- `POST /api/analyze/github`
  - Body: `{ repoUrl }`
  - Returns GitHub audit fields like `score`, `readmeQuality`, `documentationQuality`, `structureQuality`, `commitActivity`, `deploymentLinks`, and audit suggestions.
- `POST /api/analyze/presentation`
  - Body: `{ docName, fileBase64, mimeType }`
  - Returns presentation scores and feedback for problem statement, objective, architecture, roadmap, and delivery quality.
- `POST /api/analyze/portfolio`
  - Body: `{ userId, repoUrl, docName, githubAnalysis, presentationAnalysis }`
  - Returns the full ProtfoliQ report, including recruiter view insights, skills inference, completeness score, benchmark comparison, roast mode, and AI-generated improvements.

---

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Express.js
- TypeScript
- @google/genai
- dotenv
- Lucide React icons

---

## Security

ProtfoliQ keeps API keys secret by reading `GEMINI_API_KEY` from `.env` on the server. The frontend never exposes the key.

---

## Notes

- Ensure `GEMINI_API_KEY` is present before running the server.
- The project uses local JSON files for proof-of-concept persistence.
- This repo is configured for hackathon-ready demo use with polished dashboard UX and structured AI-driven portfolio recommendations.
