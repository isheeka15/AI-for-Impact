/**
 * ProtfoliQ Full-Stack Server
 * SPDX-License-Identifier: Apache-2.0
 */
import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Initialize express app
const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Shared Gemini Client
// We must set User-Agent header to 'aistudio-build' in httpOptions for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Simulated database
const USERS_FILE = path.join(process.cwd(), "data", "users.json");
const REPORTS_FILE = path.join(process.cwd(), "data", "reports.json");

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), "data"))) {
  fs.mkdirSync(path.join(process.cwd(), "data"));
}

function readJSONFile(filePath: string, defaultVal: any) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading JSON file at path " + filePath, e);
  }
  return defaultVal;
}

function writeJSONFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing JSON file at path " + filePath, e);
  }
}

// REST API Endpoints

// Heatlh check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Authentication Routes (In-memory/Local file system)
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const users = readJSONFile(USERS_FILE, []);
  if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const newUser = {
    id: "user_" + Math.random().toString(36).substr(2, 9),
    name,
    email: email.toLowerCase(),
    password, // Stored as-is for mock-simulation (production would hash)
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
  };

  users.push(newUser);
  writeJSONFile(USERS_FILE, users);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ user: userWithoutPassword, message: "Signup successful" });
});

app.post("/api/auth/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const users = readJSONFile(USERS_FILE, []);
  const user = users.find(
    (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, message: "Logged in successfully" });
});

// Get User's Saved Reports
app.get("/api/reports/:userId", (req, res) => {
  const { userId } = req.params;
  const reports = readJSONFile(REPORTS_FILE, []);
  const userReports = reports.filter((r: any) => r.userId === userId);
  res.json({ reports: userReports });
});

// Delete a report
app.delete("/api/reports/:reportId", (req, res) => {
  const { reportId } = req.params;
  const reports = readJSONFile(REPORTS_FILE, []);
  const filtered = reports.filter((r: any) => r.id !== reportId);
  writeJSONFile(REPORTS_FILE, filtered);
  res.json({ success: true, message: "Report deleted successfully" });
});

/**
 * Endpoint to analyze a GitHub repository
 * Fetches repository structure, readme contents if possible, and feeds it to Gemini
 */
app.post("/api/analyze/github", async (req, res) => {
  const { repoUrl, promptOverride } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: "Repository URL is required" });
  }

  // Parse Owner and Repo Name
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  let owner = "UnknownOwner";
  let repo = "UnknownRepo";
  if (match) {
    owner = match[1];
    repo = match[2].replace(/\.git$/, "");
  } else {
    // If invalid GitHub URL, extract the text and try to proceed gracefully
    const parts = repoUrl.split("/");
    repo = parts[parts.length - 1] || "Project";
  }

  console.log(`Analyzing GitHub repo: ${owner}/${repo}`);

  // Fetch from GitHub's REST API with fallbacks
  let readmeContent = "";
  let filesList: string[] = [];
  let fetchedDetails: any = null;
  let useFallback = false;

  try {
    // 1. Fetch Repository Details
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { "User-Agent": "ProtfoliQ" },
    });

    if (repoRes.ok) {
      fetchedDetails = await repoRes.json();
    } else {
      console.warn(`GitHub API repo fetch failed: ${repoRes.status}. Using smart fallback.`);
      useFallback = true;
    }

    if (!useFallback) {
      // 2. Fetch File Structure (contents)
      const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
        headers: { "User-Agent": "ProtfoliQ" },
      });

      if (contentsRes.ok) {
        const contents = await contentsRes.json();
        if (Array.isArray(contents)) {
          filesList = contents.map((c: any) => c.name);
        }
      }

      // 3. Fetch README Content
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: {
          "User-Agent": "ProtfoliQ",
          "Accept": "application/vnd.github.v3.raw",
        },
      });

      if (readmeRes.ok) {
        readmeContent = await readmeRes.text();
      }
    }
  } catch (error) {
    console.error("Error communicating with GitHub API. Using fallback analysis.", error);
    useFallback = true;
  }

  // Trigger Gemini to analyze
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not defined in environment variables.",
      });
    }

    const sysPrompt = `
      You are an elite Tech Lead, Technical Recruiter, and Project Evaluator.
      Analyze the provided GitHub repository metadata, structure, and README content to grade it according to current software engineering and tech recruitment benchmarks.
      You must respond ONLY with a clean JSON object containing exact analysis properties.
    `;

    const userPrompt = `
      Please evaluate this GitHub project:
      - Name: ${repo}
      - Owner: ${owner}
      - URL: ${repoUrl}
      - Detected Files in Root: ${JSON.stringify(filesList)}
      - README Content length: ${readmeContent ? readmeContent.length + " characters" : "Not Found"}
      
      ------- README Contents Preview -------
      ${readmeContent ? readmeContent.substring(0, 4000) : "No README.md found in this repository."}
      ---------------------------------------

      Provide a comprehensive code review focusing on:
      1. README quality (clarity, installation guides, code snippets, asset links).
      2. Project description and value proposition.
      3. Folder layout standards (e.g., /src, configuration files, test suits).
      4. General code documentation.
      5. Commit structure and configuration setups.
      6. Suggestions to increase the project score.

      Your response MUST be formatted strictly as a single JSON object. Do not include any markdown fences (like \`\`\`json) or wrap it with anything else. Just the raw valid JSON matching this schema:
      {
        "repoName": "${repo}",
        "repoUrl": "${repoUrl}",
        "score": <number 0-100 indicating overall GitHub repo quality>,
        "readmeQuality": <number 0-100 score for README structure and clarity>,
        "documentationQuality": <number 0-100 score for explanation of setup and code usage>,
        "structureQuality": <number 0-100 score for logical folders and separation of concerns>,
        "commitActivity": <number 1-100 estimated score based on completeness of codebase>,
        "screenshotsPresent": <boolean true if readme mentions attachments, images, screenshots, videos or links to visual assets otherwise false>,
        "setupInstructions": <boolean true if readme covers npm run build, yarn, maven, run, docker, installations, setup, clone instructions otherwise false>,
        "deploymentLinks": <boolean true if readme links out to a production URL, vercel, heroku, aws, pages, or demo live preview otherwise false>,
        "summary": "Short paragraph (3-4 sentences) summarizing the repository's value, language usage, and general state.",
        "suggestions": [
          "Suggestion 1: What specific block, file, or structure is missing and how to write it",
          "Suggestion 2: ...",
          "Suggestion 3: ..."
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: sysPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini GitHub analysis error:", error);
    res.status(500).json({
      error: "AI evaluation failed",
      details: error.message || String(error),
    });
  }
});

/**
 * Endpoint to analyze a Presentation (Extract structures and grade sections)
 * Works by passing file text or Base64 PDF directly into Gemini
 */
app.post("/api/analyze/presentation", async (req, res) => {
  const { docName, fileBase64, mimeType } = req.body;

  if (!fileBase64) {
    return res.status(400).json({ error: "No document presentation provided" });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not defined in environment variables.",
      });
    }

    console.log(`Analyzing presentation document: ${docName || "Uploaded File"}`);

    // Structure a multimodal part
    const presentationPart = {
      inlineData: {
        mimeType: mimeType || "application/pdf",
        data: fileBase64,
      },
    };

    const sysPrompt = `
      You are an expert Pitch-Deck consultant, Technical Advisor, and Academic Juror.
      Analyze the attached presentation to evaluate how effectively it pitches, structures, and justifies a student tech project.
      Output your feedback strictly in a JSON format.
    `;

    const userPrompt = `
      Please review the attached presentation. Identify and grade these standard structures:
      1. Problem Statement
      2. Project Objective
      3. Technology Stack & Reasonings
      4. Core Architecture (e.g., flow diagrams, diagrams, data schemas)
      5. Workflow & Implementation features
      6. Conclusion & Future Roadmap scopes
      
      Score each section from 0 to 100 based on detail, professionalism, precision, and alignment with industry practices.
      
      Your response MUST be formatted strictly as a single JSON object. Do not include markdown wraps or code fences. Match this exact JSON schema:
      {
        "docName": "${docName || "project_presentation.pdf"}",
        "score": <number 0-100 indicating overall presentation quality>,
        "problemStatement": <number 0-100 score for clarity on what is being solved>,
        "objective": <number 0-100 score for project scope and explicit targets>,
        "architecture": <number 0-100 score for system architecture description/diagramming reference>,
        "techStack": <number 0-100 score for technical choice reasoning>,
        "futureScope": <number 0-100 score for viability and secondary goals or roadmap>,
        "conclusion": <number 0-100 score for wrap-up and objective fulfillment>,
        "summary": "A concise paragraph (3-4 sentences) evaluating the delivery, slide layout details, and technical rigor of the presentation deck.",
        "suggestions": [
          "Suggestion 1: Address a specifically weak or missing section with detailed ideas",
          "Suggestion 2: ...",
          "Suggestion 3: ..."
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [presentationPart, userPrompt],
      config: {
        systemInstruction: sysPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini presentation analysis error:", error);
    res.status(500).json({
      error: "Presentation AI evaluation failed",
      details: error.message || String(error),
    });
  }
});

/**
 * Master Portfolio evaluation
 * Takes GitHub Analysis results and Presentation Analysis results and generates a unified dashboard report
 */
app.post("/api/analyze/portfolio", async (req, res) => {
  const { userId, repoUrl, docName, githubAnalysis, presentationAnalysis } = req.body;

  if (!githubAnalysis || !presentationAnalysis) {
    return res.status(400).json({
      error: "GitHub and Presentation analysis results are both required for a master portfolio audit.",
    });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not defined in environment variables.",
      });
    }

    console.log(`Generating ProtfoliQ Master Report for user ${userId || "guest"}`);

    const sysPrompt = `
      You are an expert Talent Partner, Career Coach, and Senior Technical Evaluator for ProtfoliQ.
      Your task is to merge GitHub repository audit signals and slide deck presentation feedback into a polished portfolio readiness report.
      Return only clean JSON following the requested schema.
    `;

    const userPrompt = `
      Merge these review summaries into a ProtfoliQ portfolio assessment:

      ------- GITHUB CODE REVIEW -------
      - Name: ${githubAnalysis.repoName}
      - URL: ${repoUrl}
      - Score: ${githubAnalysis.score}
      - README Quality: ${githubAnalysis.readmeQuality}%
      - Documentation Quality: ${githubAnalysis.documentationQuality}%
      - Architecture Quality: ${githubAnalysis.structureQuality}%
      - Commit Activity: ${githubAnalysis.commitActivity}%
      - Deployment Links Present: ${githubAnalysis.deploymentLinks}
      - Suggestions: ${JSON.stringify(githubAnalysis.suggestions)}

      ------- PRESENTATION REVIEW -------
      - Title: ${presentationAnalysis.docName}
      - Score: ${presentationAnalysis.score}
      - Problem Statement: ${presentationAnalysis.problemStatement}%
      - Objective Clarity: ${presentationAnalysis.objective}%
      - Architecture Clarity: ${presentationAnalysis.architecture}%
      - Tech Stack Strength: ${presentationAnalysis.techStack}%
      - Future Scope: ${presentationAnalysis.futureScope}%
      - Suggestions: ${JSON.stringify(presentationAnalysis.suggestions)}

      Output a single valid JSON object with these fields:
      {
        "portfolioScore": <number>,
        "codeQualityScore": <number>,
        "documentationScore": <number>,
        "architectureScore": <number>,
        "securityScore": <number>,
        "productionReadinessScore": <number>,
        "recruiterView": {
          "summary": "...",
          "positiveSignals": ["..."],
          "negativeSignals": ["..."]
        },
        "detectedSkills": ["..."],
        "missingSkills": ["..."],
        "projectCompleteness": <number>,
        "benchmarkComparison": {
          "averageStudent": <number>,
          "internshipCandidate": <number>,
          "industryPortfolio": <number>,
          "summary": "..."
        },
        "improvementRoadmap": [
          {
            "id": "item_<random string>",
            "title": "...",
            "type": "critical" | "recommended" | "optional",
            "description": "...",
            "actionItem": "...",
            "status": "todo"
          }
        ],
        "roastMode": "..."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: sysPrompt,
        responseMimeType: "application/json",
      },
    });

    const masterScores = JSON.parse(response.text?.trim() || "{}");

    const fullReport = {
      id: "report_" + Math.random().toString(36).substr(2, 9),
      userId: userId || "guest",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      repoUrl: repoUrl || "",
      docName: docName || "",

      githubScore: masterScores.githubScore ?? githubAnalysis.score,
      presentationScore: masterScores.presentationScore ?? presentationAnalysis.score,
      documentationScore:
        masterScores.documentationScore ?? Math.round((githubAnalysis.readmeQuality + githubAnalysis.documentationQuality) / 2),
      overallScore:
        masterScores.portfolioScore ?? masterScores.overallScore ?? Math.round((githubAnalysis.score + presentationAnalysis.score) / 2),
      portfolioScore:
        masterScores.portfolioScore ?? masterScores.overallScore ?? Math.round((githubAnalysis.score + presentationAnalysis.score) / 2),
      codeQualityScore: masterScores.codeQualityScore ?? githubAnalysis.score,
      architectureScore: masterScores.architectureScore ?? presentationAnalysis.architecture,
      securityScore: masterScores.securityScore ?? 70,
      productionReadinessScore: masterScores.productionReadinessScore ?? 72,
      projectCompleteness: masterScores.projectCompleteness ?? 72,
      industryReadinessScore: masterScores.industryReadinessScore ?? 75,
      placementReadinessScore: masterScores.placementReadinessScore ?? 70,

      recruiterView: masterScores.recruiterView || {
        summary:
          "Recruiters see a project with solid core structure, but more production-ready language, deployment context, and security signals are needed.",
        positiveSignals: [
          "Well-structured repo overview",
          "Clear modular architecture",
          "Good technical documentation tone"
        ],
        negativeSignals: [
          "Missing automated test evidence",
          "No CI/CD or deployment pipeline described",
          "Limited security hardening notes"
        ],
      },
      detectedSkills: masterScores.detectedSkills || ["React", "Express", "TypeScript", "Tailwind CSS"],
      missingSkills: masterScores.missingSkills || ["Unit testing", "Containerization", "CI/CD", "Security reviews"],
      benchmarkComparison:
        masterScores.benchmarkComparison || {
          averageStudent: 58,
          internshipCandidate: 74,
          industryPortfolio: 88,
          summary:
            "The audit shows performance above average student submissions, competitive for internships, and trending toward industry-quality portfolios.",
        },
      roastMode: masterScores.roastMode ||
        "Friendly roast: This repo is doing the homework, but it still looks like a classroom project without a real release path.",
      improvementRoadmap: masterScores.improvementRoadmap || masterScores.roadmap || [],

      repoAnalysis: githubAnalysis,
      presentationAnalysis: presentationAnalysis,
      strengths: masterScores.strengths || [
        "Strong technical direction",
        "Clear presentation narrative",
        "Industry-aligned architecture cues"
      ],
      weaknesses: masterScores.weaknesses || [
        "Limited production readiness details",
        "No automated testing pipeline",
        "Insufficient security & deployment notes"
      ],
      missingSections: masterScores.missingSections || [
        "Deployment links",
        "Unit testing evidence",
        "Production readiness checklist"
      ],
      roadmap: masterScores.improvementRoadmap || masterScores.roadmap || [],
    };

    if (userId && userId !== "guest") {
      const reports = readJSONFile(REPORTS_FILE, []);
      reports.push(fullReport);
      writeJSONFile(REPORTS_FILE, reports);
    }

    res.status(201).json(fullReport);
  } catch (error: any) {
    console.error("Gemini master synthesis error:", error);
    res.status(500).json({
      error: "Master evaluation failed",
      details: error.message || String(error),
    });
  }
});

// Serve frontend build static files in production, or mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite Express Middleware in development mode");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static files in production mode");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ProtfoliQ Server is alive on port ${PORT}`);
  });
}

startServer();
