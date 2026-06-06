# PortfolioPilot AI 🚀

An AI-powered CS student portfolio and pitch reviewer designed to audit GitHub repositories, analyze technical slide decks, and generate structured scorecards. Bridge the gap between engineering project layouts and recruiters placement readiness levels dynamically.

---

## Technical Architecture Overview

PortfolioPilot AI utilizes a robust full-stack design:
- **Frontend**: Single-Page App engineered with React 19, Vite, and styled with high-fidelity Tailwind CSS utilities. Utilizes `motion/react` for fluid transition layouts.
- **Backend Service**: Express.js server configured with low-latency endpoints that communicate with public APIs and Gemini intelligence.
- **AI Engine**: Leverages the official Google GenAI SDK (`@google/genai`) and the `gemini-3.5-flash` model for contextual code review, doc-pitch grading, and structured master roadmap syntheses.
- **Database Storage**: Localized JSON file cache system in `data/reports.json` and `data/users.json` to enable robust multi-session testing with zero credentials configurations.
- **PDF Generation**: Native browser printing capabilities (`window.print()`) paired with specialized high-precision print margins styled with CSS `@media print` directives.

---

## Environment Variables Configuration

Copy `.env.example` to `.env` and fill out your secrets:

```env
# GEMINI_API_KEY: Required for Gemini AI models. Create this at Google AI Studio.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# APP_URL: Developer/Production target endpoint
APP_URL="http://localhost:3000"
```

---

## API Endpoints Documentation

### 1. Authentication Endpoints
- **Signup**: `POST /api/auth/signup`
  - Body: `{ name, email, password }`
  - Response: `{ user: { id, name, email, avatarUrl }, message: "Signup successful" }`
- **Signin**: `POST /api/auth/signin`
  - Body: `{ email, password }`
  - Response: `{ user: { id, name, email, avatarUrl }, message: "Logged in successfully" }`

### 2. Analysis Endpoints
- **GitHub Repository Analyzer**: `POST /api/analyze/github`
  - Body: `{ repoUrl }`
  - Highlights: Fetches repository directories, content files lists, and README.md data using public GitHub APIs; triggers Gemini-3.5-Flash to produce a structured code quality scorecard.
  - Returns:
    ```json
    {
      "repoName": "PortfolioPilot-AI",
      "repoUrl": "https://github.com/.../...",
      "score": 85,
      "readmeQuality": 90,
      "documentationQuality": 80,
      "structureQuality": 85,
      "commitActivity": 75,
      "screenshotsPresent": true,
      "setupInstructions": true,
      "deploymentLinks": true,
      "summary": "Project is structured properly with standard node.js setups.",
      "suggestions": ["Suggestion lines..."]
    }
    ```

- **Document Presentation Pitch Reviewer**: `POST /api/analyze/presentation`
  - Body: `{ docName, fileBase64, mimeType }`
  - Highlights: Accepts file buffers in Base64 encoding. Feeds binary bytes seamlessly into the Gemini Multimodal pipeline to rate critical pitch slides (problem statements, architecture diagrams, rationales, future roadmaps).
  - Returns:
    ```json
    {
      "docName": "presentation.pdf",
      "score": 88,
      "problemStatement": 90,
      "objective": 85,
      "architecture": 82,
      "techStack": 90,
      "futureScope": 80,
      "conclusion": 85,
      "summary": "Detailed slide structure containing precise requirements parameters.",
      "suggestions": ["Suggestions tips..."]
    }
    ```

- **Master Unified Portfolio Synthesizer**: `POST /api/analyze/portfolio`
  - Body: `{ userId, repoUrl, docName, githubAnalysis, presentationAnalysis }`
  - Returns: A consolidated Master Report containing aggregated parameters, Placement Preparedness percentage, Industry Standard compatibility index, strengths, weaknesses list, and a prioritized Roadmap array (Critical, Recommended, Optional).

---

## Local Setup & Development Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- NPM, Yarn, or pnpm

### Steps to Run:
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Setup Secrets**:
   Copy the example `.env.example` to `.env` and assign your `GEMINI_API_KEY`.
3. **Compile and Launch Server**:
   ```bash
   npm run dev
   ```
   The backend server and frontend hot-reloader will compile and run on **http://localhost:3000**.

---

## Deployment Instructions

### Deployment to Vercel (Front-end Only fallback or Serverless):
For serverless full-stack deployment on Vercel:
1. Ensure `vercel.json` is configured in your project root pointing directories towards Express:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "server.ts", "use": "@vercel/node" },
       { "src": "package.json", "use": "@vercel/static-build", "config": { "distDir": "dist" } }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "server.ts" },
       { "src": "/(.*)", "dest": "$1" }
     ]
   }
   ```
2. Deploy using Vercel CLI:
   ```bash
   vercel --prod
   ```

### Deployment to Cloud Run (Standard Full-Stack Container, recommended):
The workspace contains predefined Node setups. Port 3000 will automatically handle external reverse proxies.
1. Build docker container:
   ```bash
   docker build -t gcr.io/my-project/portfolio-pilot .
   ```
2. Run container bindings:
   ```bash
   docker run -p 3000:3000 -e GEMINI_API_KEY="..." gcr.io/my-project/portfolio-pilot
   ```
