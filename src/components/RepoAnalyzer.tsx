/**
 * RepoAnalyzer Component
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Github, 
  ArrowLeft, 
  Cpu, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { RepoAnalysis } from "../types";

interface RepoAnalyzerProps {
  onBack: () => void;
  onAnalysisComplete: (analysis: RepoAnalysis) => void;
  initialAnalysis?: RepoAnalysis | null;
}

export const RepoAnalyzer: React.FC<RepoAnalyzerProps> = ({
  onBack,
  onAnalysisComplete,
  initialAnalysis = null,
}) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<RepoAnalysis | null>(initialAnalysis);
  const [loadingStep, setLoadingStep] = useState(0);

  // Quick sequential message steps
  const loadingSteps = [
    "Establishing connection with public GitHub API...",
    "Querying repository contents & layout standard schemas...",
    "Locating README.md document buffers...",
    "Injecting structure payload into Gemini-3.5-Flash...",
    "Generating deep code review scorecards..."
  ];

  const handleURLSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) {
      setError("Please input a valid GitHub repository URL");
      return;
    }

    if (!repoUrl.toLowerCase().includes("github.com/")) {
      setError("Must be a valid github.com domain (e.g. https://github.com/owner/repository)");
      return;
    }

    setLoading(true);
    setError(null);
    setActiveAnalysis(null);
    setLoadingStep(0);

    // Increment loading step messages
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const response = await fetch("/api/analyze/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "GitHub Repository AI analysis failed.");
      }

      setActiveAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Could not successfully evaluate repository details. Please verify connections.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleSaveAndContinue = () => {
    if (activeAnalysis) {
      onAnalysisComplete(activeAnalysis);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-100 bg-slate-950 font-sans">
      
      {/* Navbar segment */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Module 01: Repository Audit</span>
        </div>
      </nav>

      {/* Main panel container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full relative z-10">
        
        {/* Intro */}
        <div className="mb-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <Github className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">GitHub Repository Analyzer</h1>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            Input a public repository URL to analyze project descriptions, root folders structure, setup quality guidelines, and screenshots present in document previews.
          </p>
        </div>

        {/* Input box form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl mb-10">
          <form onSubmit={handleURLSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 font-sans uppercase tracking-wider block">Public Repository URL</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="repo-url-input"
                    type="text"
                    disabled={loading}
                    placeholder="https://github.com/username/project-repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
                <button
                  id="analyze-repo-submit"
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-medium py-3 px-6 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin w-4 h-4" /> Analyzing...
                    </>
                  ) : (
                    <>Evaluate Codebase</>
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 font-sans animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick instructions indicator */}
          <div className="mt-5 p-3.5 rounded-xl bg-slate-950 border border-slate-850 flex items-start gap-3 text-xs text-slate-500 leading-relaxed font-sans">
            <Cpu className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>
              <strong>How it works:</strong> Our server connects to public API structures to retrieve file names, directory scopes and readme logs. Gemini models then run custom checklists matching modern software internships requirements.
            </span>
          </div>
        </div>

        {/* Loading details State */}
        {loading && (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-850 shadow-lg text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              {/* Spinning Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
              <Cpu className="absolute inset-0 m-auto w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Running Specialized Portfolio Audit</h3>
              <p className="text-xs text-slate-400 mt-1">{loadingSteps[loadingStep]}</p>
            </div>
            {/* ProgressBar */}
            <div className="w-full max-w-sm bg-slate-950 h-1.5 rounded-full mx-auto overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-1000"
                style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Results Deck */}
        {activeAnalysis && (
          <div className="space-y-8 animate-fade-in">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 w-[5px] h-full bg-emerald-500" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Analysis complete</span>
                  <h2 className="text-xl font-bold font-sans text-white mt-2 flex items-center gap-2">
                    {activeAnalysis.repoName}
                  </h2>
                  <a 
                    href={activeAnalysis.repoUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-slate-500 hover:text-slate-400 text-xs mt-1 block truncate max-w-md hover:underline"
                  >
                    {activeAnalysis.repoUrl}
                  </a>
                </div>

                {/* Score Dial */}
                <div className="text-center bg-slate-950 p-4 px-6 rounded-xl border border-slate-850">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">Code Quality Score</span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span id="repo-audit-score" className="text-3xl font-black text-emerald-400">{activeAnalysis.score}</span>
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                </div>
              </div>

              {/* Progress bars split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-t border-b border-slate-800">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1">
                      <span>README Layout & Clarity</span>
                      <span>{activeAnalysis.readmeQuality}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activeAnalysis.readmeQuality}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1">
                      <span>Documentation Coverage</span>
                      <span>{activeAnalysis.documentationQuality}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activeAnalysis.documentationQuality}%` }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1">
                      <span>Standard Structure Quality</span>
                      <span>{activeAnalysis.structureQuality}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activeAnalysis.structureQuality}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1">
                      <span>Codebase Completeness</span>
                      <span>{activeAnalysis.commitActivity}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activeAnalysis.commitActivity}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist details */}
              <div className="grid grid-cols-3 gap-4 py-6 border-b border-slate-800 text-center">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Screenshots</span>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    {activeAnalysis.screenshotsPresent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-slate-200">Found</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-semibold text-slate-400">Missing</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Setup Instructions</span>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    {activeAnalysis.setupInstructions ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-slate-200">Found</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-semibold text-slate-400">Missing</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Deployment Link</span>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    {activeAnalysis.deploymentLinks ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-slate-200">Found</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-semibold text-slate-400">Missing</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Critique Paragraph */}
              <div className="mt-5">
                <h4 className="text-sm font-bold text-white mb-2">AI Critique Summary</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeAnalysis.summary}</p>
              </div>
            </div>

            {/* Improvement Recommendations Panel */}
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <Lightbulb className="w-5 h-5" />
                <h3 className="text-base font-bold text-white tracking-tight">Direct Improvement Roadmap Ideas</h3>
              </div>
              <ul className="space-y-3">
                {activeAnalysis.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-850/60 font-sans text-xs text-slate-300 leading-relaxed hover:border-slate-800 transition-all">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Proceed Actions */}
            <div className="flex items-center justify-end gap-3 mt-10">
              <button
                id="reset-repo-audit"
                onClick={() => {
                  setActiveAnalysis(null);
                  setRepoUrl("");
                }}
                className="px-5 py-3 border border-slate-800 hover:border-slate-700 bg-slate-955 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reset Audit
              </button>
              <button
                id="repo-proceed"
                onClick={handleSaveAndContinue}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-900/30 shadow-md transform hover:translate-y-[-1px]"
              >
                Proceed to Presentation Review <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
