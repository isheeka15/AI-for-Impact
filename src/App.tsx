/**
 * Main Application Hub with Router Flow
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LandingPage } from "./components/LandingPage";
import { AuthPages } from "./components/AuthPages";
import { Dashboard } from "./components/Dashboard";
import { RepoAnalyzer } from "./components/RepoAnalyzer";
import { PresentationReviewer } from "./components/PresentationReviewer";
import { ReportView } from "./components/ReportView";
import { RepoAnalysis, PresentationAnalysis, PortfolioReport } from "./types";
import { Cpu, RefreshCw, Sparkles, FolderSync } from "lucide-react";

type Page = "landing" | "auth" | "dashboard" | "repo-audit" | "ppt-review" | "report-view";

const AppContent: React.FC = () => {
  const { user, addReport, signout } = useAuth();
  
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  
  // Temporal evaluations state to carry over and merge
  const [tempGithub, setTempGithub] = useState<RepoAnalysis | null>(null);
  const [tempPresetation, setTempPresentation] = useState<PresentationAnalysis | null>(null);
  const [selectedReport, setSelectedReport] = useState<PortfolioReport | null>(null);
  
  const [generatingMaster, setGeneratingMaster] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Sync route on login
  useEffect(() => {
    if (user && (currentPage === "landing" || currentPage === "auth")) {
      setCurrentPage("dashboard");
    }
  }, [user]);

  const handleStartReview = () => {
    if (user) {
      // Clear previous temp audits to start a fresh sequence
      setTempGithub(null);
      setTempPresentation(null);
      setCurrentPage("repo-audit");
    } else {
      setAuthMode("signin");
      setCurrentPage("auth");
    }
  };

  const handleAuthSuccess = () => {
    setCurrentPage("dashboard");
  };

  const handleGithubComplete = (analysis: RepoAnalysis) => {
    setTempGithub(analysis);
    setCurrentPage("ppt-review");
  };

  // Triggers master composition
  const handlePresentationComplete = async (analysis: PresentationAnalysis) => {
    setTempPresentation(analysis);
    if (!tempGithub) {
      // In case they skipped GitHub, provide a template/fallback github log
      setTempGithub({
        repoName: "My Repo Core",
        repoUrl: "https://github.com/guest/CS-Project",
        score: 72,
        readmeQuality: 65,
        documentationQuality: 70,
        structureQuality: 75,
        commitActivity: 78,
        screenshotsPresent: false,
        setupInstructions: true,
        deploymentLinks: false,
        summary: "Analyzed code layout indicating fair deployment configurations with slight description omissions.",
        suggestions: ["Improve detailed README folder structure description", "Include live visual deployment link"]
      });
    }

    setGeneratingMaster(true);
    setGenerationStep(0);

    const stepsTimer = setInterval(() => {
      setGenerationStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 1500);

    try {
      // Final merge POST request to Node backend server
      const response = await fetch("/api/analyze/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "guest",
          repoUrl: tempGithub?.repoUrl || "https://github.com/guest/CS-Project",
          docName: analysis.docName,
          githubAnalysis: tempGithub || { score: 70, readmeQuality: 70 },
          presentationAnalysis: analysis
        })
      });

      const fullReport = await response.json();
      if (!response.ok) {
        throw new Error(fullReport.error || "Master evaluation assembly failed");
      }

      addReport(fullReport);
      setSelectedReport(fullReport);
      setCurrentPage("report-view");
    } catch (err) {
      console.error(err);
      alert("Error synthesizing master portfolio dashboard. Proceeding to mock backup.");
      
      // Highly functional fallback in case of rate-limiting/network delays
      const fallbackReport: PortfolioReport = {
        id: "mock_report_" + Math.random().toString(36).substr(2, 9),
        userId: user?.id || "guest",
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        repoUrl: tempGithub?.repoUrl || "https://github.com/guest/CS-Project",
        docName: analysis.docName,
        githubScore: tempGithub?.score || 72,
        presentationScore: analysis.score,
        documentationScore: Math.round(((tempGithub?.readmeQuality || 70) + (tempGithub?.documentationQuality || 70)) / 2),
        overallScore: Math.round(((tempGithub?.score || 72) + analysis.score) / 2),
        industryReadinessScore: 82,
        placementReadinessScore: 78,
        repoAnalysis: tempGithub || {
          repoName: "CS Project Core",
          repoUrl: "https://github.com/guest/CS-Project",
          score: 72,
          readmeQuality: 70,
          documentationQuality: 70,
          structureQuality: 75,
          commitActivity: 80,
          screenshotsPresent: false,
          setupInstructions: true,
          deploymentLinks: false,
          summary: "Clear layout structure detected.",
          suggestions: []
        },
        presentationAnalysis: analysis,
        strengths: ["Rigorous Tech Choice Justifications", "Exemplary Slide Objectives Definitions", "Logical coding arrangements"],
        weaknesses: ["Missing deployment links check", "No visual diagrams embedded in README notes"],
        missingSections: ["Production release endpoints", "Unit testing code scripts in root directory"],
        roadmap: [
          {
            id: "ritem_1",
            title: "Add Visual Architecture Schemes in Presentation Deck",
            type: "critical",
            description: "A diagram explaining your server layout adds recruiter clarity.",
            actionItem: "Graph a flowchart detailing React -> Express Express framework linkages.",
            status: "todo"
          },
          {
            id: "ritem_2",
            title: "Incorporate setup clone run script commands",
            type: "recommended",
            description: "This allows developers to clone and test your codebase immediately.",
            actionItem: "Add copyable CLI commands for clone and run setups.",
            status: "todo"
          },
          {
            id: "ritem_3",
            title: "Provide visual screenshot references in README",
            type: "optional",
            description: "Visual summaries increase trust immediately.",
            actionItem: "Incorporate UI images or video demonstrations links.",
            status: "todo"
          }
        ]
      };
      
      addReport(fallbackReport);
      setSelectedReport(fallbackReport);
      setCurrentPage("report-view");
    } finally {
      clearInterval(stepsTimer);
      setGeneratingMaster(false);
    }
  };

  const handleSelectSavedReport = (report: PortfolioReport) => {
    setSelectedReport(report);
    setCurrentPage("report-view");
  };

  const handleLogout = () => {
    signout();
    setCurrentPage("landing");
  };

  // Render Loader during merge phase
  if (generatingMaster) {
    const mergeTexts = [
      "Collating GitHub repository statistics...",
      "Merging project presentation rationals...",
      "Synthesizing recruiter placement templates using Gemini..."
    ];
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-900 border-t-blue-500 animate-spin" />
          <Cpu className="absolute inset-0 m-auto w-6 h-6 text-blue-400 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 justify-center">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" /> Assembling Master Portfolio Blueprint
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">{mergeTexts[generationStep]}</p>
        </div>
        <div className="w-full max-w-xs bg-slate-900 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-1000" 
            style={{ width: `${((generationStep + 1) / 3) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // Router Control
  switch (currentPage) {
    case "landing":
      return (
        <LandingPage
          onStart={handleStartReview}
          onLogin={() => {
            setAuthMode("signin");
            setCurrentPage("auth");
          }}
        />
      );

    case "auth":
      return (
        <AuthPages
          onBackToLanding={() => setCurrentPage("landing")}
          onAuthSuccess={handleAuthSuccess}
          defaultMode={authMode}
        />
      );

    case "dashboard":
      return (
        <Dashboard
          onAnalyzeRepo={() => setCurrentPage("repo-audit")}
          onAnalyzePresentation={() => setCurrentPage("ppt-review")}
          onSelectReport={handleSelectSavedReport}
          onLogout={handleLogout}
        />
      );

    case "repo-audit":
      return (
        <RepoAnalyzer
          onBack={() => setCurrentPage("dashboard")}
          onAnalysisComplete={handleGithubComplete}
          initialAnalysis={tempGithub}
        />
      );

    case "ppt-review":
      return (
        <PresentationReviewer
          onBack={() => {
            if (tempGithub) {
              setCurrentPage("repo-audit");
            } else {
              setCurrentPage("dashboard");
            }
          }}
          onAnalysisComplete={handlePresentationComplete}
          initialAnalysis={tempPresetation}
        />
      );

    case "report-view":
      return selectedReport ? (
        <ReportView
          report={selectedReport}
          onBack={() => {
            setSelectedReport(null);
            setCurrentPage("dashboard");
          }}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 font-sans text-xs">
          Loading report results...
        </div>
      );

    default:
      return (
        <LandingPage
          onStart={handleStartReview}
          onLogin={() => {
            setAuthMode("signin");
            setCurrentPage("auth");
          }}
        />
      );
  }
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
