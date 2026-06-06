/**
 * PresentationReviewer Component (Sleek Drag-and-Drop + Base64 Document Parser)
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  FileText, 
  ArrowLeft, 
  Upload, 
  HelpCircle, 
  CheckCircle2, 
  Cpu, 
  AlertCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Layout
} from "lucide-react";
import { PresentationAnalysis } from "../types";

interface PresentationReviewerProps {
  onBack: () => void;
  onAnalysisComplete: (analysis: PresentationAnalysis) => void;
  initialAnalysis?: PresentationAnalysis | null;
}

export const PresentationReviewer: React.FC<PresentationReviewerProps> = ({
  onBack,
  onAnalysisComplete,
  initialAnalysis = null,
}) => {
  const [activeAnalysis, setActiveAnalysis] = useState<PresentationAnalysis | null>(initialAnalysis);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingSteps = [
    "Reading file bytes as clean binary array...",
    "Converting PDF structure into Base64 pipeline channels...",
    "Streaming slide decks layout nodes to Gemini-3.5-Flash...",
    "Interrogating logic templates (Objectives, problem, schemas)...",
    "Synthesizing visual slides presentation scorecards..."
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const processFile = async (file: File) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF document pitch deck. Office PPTs can be easily saved as PDF for higher parsing retention.");
      return;
    }

    setFileName(file.name);
    setLoading(true);
    setError(null);
    setActiveAnalysis(null);
    setLoadingStep(0);

    // Dynamic progress steps
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      // 1. Convert to Base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // Extract base64 part only
          const base64Data = result.split(",")[1];
          resolve(base64Data);
        };
        reader.onerror = () => reject(new Error("File conversion failure"));
        reader.readAsDataURL(file);
      });

      const fileBase64 = await base64Promise;

      // 2. POST to backend Express endpoint
      const response = await fetch("/api/analyze/presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docName: file.name,
          fileBase64: fileBase64,
          mimeType: file.type,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Slide compilation failed.");
      }

      setActiveAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze slides deck. Please verify PDF integrity.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSaveAndReview = () => {
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
          <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Module 02: Presentation Review</span>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full relative z-10">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4 text-violet-400">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Presentation Pitch Reviewer</h1>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            Upload your project presentation or technical pitch document in PDF format. ProtfoliQ evaluates problem-solving narratives, scopes, visual architecture and technical rationales.
          </p>
        </div>

        {/* Upload Form Area */}
        <div className="mb-10">
          <input
            id="hidden-ppt-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
          />

          <div
            id="drag-ppt-container"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`p-10 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
              dragOver 
                ? "border-violet-500 bg-violet-600/5 shadow-2xl scale-[1.01]" 
                : "border-slate-800 hover:border-slate-700 bg-slate-900/60"
            }`}
          >
            <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-500">
              <Upload className="w-6 h-6" />
            </div>
            
            <h3 className="text-sm font-bold text-slate-200">
              {fileName ? fileName : "Drag & Drop Presentation Pitch PDF"}
            </h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
              Accepts PDF files up to 20MB. Standard PowerPoint files (.pptx) can be exported to PDF to enable full processing.
            </p>
            <button
              id="ppt-select-btn"
              type="button"
              className="mt-6 px-4 py-2 hover:bg-slate-800 rounded-xl text-xs font-semibold text-violet-400 border border-slate-800 hover:border-slate-750 transition-colors"
            >
              Browse Document File
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 font-sans animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Loading progress deck */}
        {loading && (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-850 text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              {/* Spinning Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-violet-500 animate-spin" />
              <FileText className="absolute inset-0 m-auto w-6 h-6 text-violet-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Running Slide-Deck Critique Engine</h3>
              <p className="text-xs text-slate-400 mt-1">{loadingSteps[loadingStep]}</p>
            </div>
            {/* ProgressBar */}
            <div className="w-full max-w-sm bg-slate-950 h-1.5 rounded-full mx-auto overflow-hidden">
              <div 
                className="bg-violet-500 h-full transition-all duration-1000"
                style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Results Deck */}
        {activeAnalysis && (
          <div className="space-y-8 animate-fade-in">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 w-[5px] h-full bg-violet-500" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-violet-500/10 text-violet-400">Review generated</span>
                  <h2 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
                    {activeAnalysis.docName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Multimodal presentation analysis parsed and scored.
                  </p>
                </div>

                {/* Score Dial */}
                <div className="text-center bg-slate-950 p-4 px-6 rounded-xl border border-slate-850">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">Slide Pitch Score</span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span id="ppt-audit-score" className="text-3xl font-black text-violet-400">{activeAnalysis.score}</span>
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                </div>
              </div>

              {/* Six Dimensions Breakdown */}
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Functional slides breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 py-6 border-t border-b border-slate-800">
                
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
                    <span>Problem Statement definition</span>
                    <span>{activeAnalysis.problemStatement}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-violet-500 h-full rounded-full" style={{ width: `${activeAnalysis.problemStatement}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
                    <span>Scope & Technical Objectives</span>
                    <span>{activeAnalysis.objective}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-violet-500 h-full rounded-full" style={{ width: `${activeAnalysis.objective}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
                    <span>Architectural schemas clarity</span>
                    <span>{activeAnalysis.architecture}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-violet-500 h-full rounded-full" style={{ width: `${activeAnalysis.architecture}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
                    <span>Technology Choice justification</span>
                    <span>{activeAnalysis.techStack}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-violet-500 h-full rounded-full" style={{ width: `${activeAnalysis.techStack}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
                    <span>Viability & Future Scope roadmap</span>
                    <span>{activeAnalysis.futureScope}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-violet-500 h-full rounded-full" style={{ width: `${activeAnalysis.futureScope}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
                    <span>Conclusion & Wrap-Up specs</span>
                    <span>{activeAnalysis.conclusion}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-violet-500 h-full rounded-full" style={{ width: `${activeAnalysis.conclusion}%` }} />
                  </div>
                </div>

              </div>

              {/* Pitch Critique */}
              <div className="mt-5">
                <h4 className="text-sm font-bold text-white mb-2">Presentation Critique</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeAnalysis.summary}</p>
              </div>
            </div>

            {/* Improvement Recommendations Panel */}
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-violet-400">
                <Lightbulb className="w-5 h-5" />
                <h3 className="text-base font-bold text-white tracking-tight">Slide Deck Improvement Tips</h3>
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
                id="reset-ppt-audit"
                onClick={() => {
                  setActiveAnalysis(null);
                  setFileName("");
                }}
                className="px-5 py-3 border border-slate-800 hover:border-slate-700 bg-slate-955 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reset upload
              </button>
              <button
                id="ppt-proceed"
                onClick={handleSaveAndReview}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-violet-900/30 shadow-md transform hover:translate-y-[-1px]"
              >
                Assembles Master Portfolio Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
