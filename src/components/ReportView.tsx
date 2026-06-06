/**
 * Master Portfolio Report View & Printable Report card with Roadmap Tracker
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Award, 
  Lock,
  Compass,
  FileText,
  Activity,
  Github,
  Zap,
  Printer,
  ChevronRight,
  TrendingUp,
  Sliders,
  CheckSquare,
  Square
} from "lucide-react";
import { PortfolioReport, RoadmapItem } from "../types";

interface ReportViewProps {
  report: PortfolioReport;
  onBack: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, onBack }) => {

  // Local state to track roadmap ticks
  const [localRoadmap, setLocalRoadmap] = useState<RoadmapItem[]>(report.roadmap || []);

  const handleToggleRoadmap = (itemId: string) => {
    setLocalRoadmap((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: item.status === "completed" ? "todo" : "completed" }
          : item
      )
    );
  };

  // Compute road map stats
  const completedCount = localRoadmap.filter(r => r.status === "completed").length;
  const totalCount = localRoadmap.length;
  const roadmapProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const criticalItems = localRoadmap.filter(item => item.type === "critical");
  const recommendedItems = localRoadmap.filter(item => item.type === "recommended");
  const optionalItems = localRoadmap.filter(item => item.type === "optional");

  // Standard Print Trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen text-slate-100 bg-slate-950 font-sans print:bg-white print:text-slate-900">
      
      {/* Visual background accents (hidden on printed pages) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none print:hidden" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none print:hidden" />

      {/* Top Header navbar (hidden on printed page) */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Audit Report
          </button>
          
          <button
            id="report-print-btn"
            onClick={handlePrint}
            className="p-1 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-900/30"
          >
            <Printer className="w-3.5 h-3.5" /> Download PDF Report
          </button>
        </div>
      </nav>

      {/* Master Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 print:py-0 print:px-0">
        
        {/* Printable Scorecard Title Block */}
        <section id="printable-headline" className="mb-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-850 print:bg-none print:border-none print:p-0 print:mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 block print:text-blue-600">PortfolioPilot AI Scorecard</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5 print:text-black">Portfolio Pilot Audit Summary</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
            <span>Date: {report.date}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800 print:hidden" />
            <span className="truncate max-w-sm">Repository: {report.repoUrl || "Pasted / Handled repo content"}</span>
          </div>
        </section>

        {/* Dynamic Master dashboard stats */}
        <section id="scores-panel" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 print:grid-cols-4 print:mb-6 print:gap-4">
          
          {/* Card: Portfolio Score */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-850 shadow-md flex flex-col justify-between print:border print:border-slate-300 print:p-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2 print:text-slate-600">portfolio score</span>
              <div className="flex items-baseline gap-1">
                <span id="overall-audited-score" className="text-4xl font-black text-blue-400 print:text-blue-600">{report.overallScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden print:bg-slate-200">
                <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full" style={{ width: `${report.overallScore}%` }} />
              </div>
              <span className="text-[9px] text-slate-500 font-medium block mt-1 uppercase">unified assessment weight</span>
            </div>
          </div>

          {/* Card: GitHub Score */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-850 shadow-md flex flex-col justify-between print:border print:border-slate-300 print:p-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2 print:text-slate-600">GitHub Code Audit</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-emerald-400 print:text-emerald-700">{report.githubScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden print:bg-slate-200">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${report.githubScore}%` }} />
              </div>
              <span className="text-[9px] text-slate-500 font-medium block mt-1 uppercase">{report.repoAnalysis?.repoName || "Codes quality"}</span>
            </div>
          </div>

          {/* Card: Slides Score */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-850 shadow-md flex flex-col justify-between print:border print:border-slate-300 print:p-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2 print:text-slate-600">Slides pitch quality</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-violet-400 print:text-violet-700">{report.presentationScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden print:bg-slate-200">
                <div className="bg-violet-500 h-full rounded-full" style={{ width: `${report.presentationScore}%` }} />
              </div>
              <span className="text-[9px] text-slate-500 font-medium block mt-1 uppercase">Pitch-Deck structures</span>
            </div>
          </div>

          {/* Card: Docs Score */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-850 shadow-md flex flex-col justify-between print:border print:border-slate-300 print:p-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2 print:text-slate-600">documentation quality</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-cyan-400 print:text-cyan-700">{report.documentationScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden print:bg-slate-200">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${report.documentationScore}%` }} />
              </div>
              <span className="text-[9px] text-slate-500 font-medium block mt-1 uppercase">setup & clear instructions</span>
            </div>
          </div>

        </section>

        {/* Placement Readiness Indicators */}
        <section id="readiness-indicators" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 print:grid-cols-2 print:mb-6 print:gap-4">
          
          {/* Industry Standard Scale */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-850 print:border print:border-slate-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider print:text-slate-700">Industry standards coverage</h3>
              <span className="text-sm font-black text-blue-400 print:text-blue-600">{report.industryReadinessScore}%</span>
            </div>
            
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden print:bg-slate-200">
              <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full" style={{ width: `${report.industryReadinessScore}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed font-sans">
              Measures coding architecture alignment, directory classifications, visual demo assets, and production deployment links presence compared to software engineering internships requirements.
            </p>
          </div>

          {/* Placement Standard Scale */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-850 print:border print:border-slate-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider print:text-slate-700">Recruiters placement readiness</h3>
              <span className="text-sm font-black text-violet-400 print:text-violet-600">{report.placementReadinessScore}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden print:bg-slate-200">
              <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full" style={{ width: `${report.placementReadinessScore}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed font-sans">
              Evaluates clear problem expressions, scoped milestones lists, rationale in choosing packages, and scalability definitions needed in screening quizzes and initial technical rounds.
            </p>
          </div>

        </section>

        {/* Strengths & Shortcomings Grid */}
        <section id="strengths-gaps" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 print:grid-cols-3 print:mb-6 print:gap-4">
          
          {/* Card: Strengths */}
          <div className="p-6 rounded-2xl bg-emerald-950/10 border border-emerald-900/30 print:bg-white print:border print:border-slate-300 print:p-4">
            <div className="flex items-center gap-2 text-emerald-400 mb-4 print:text-emerald-700">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-sm font-bold tracking-tight text-white print:text-slate-900 font-sans">Audited Strengths</h3>
            </div>
            <ul className="space-y-3 font-sans text-xs text-slate-300 print:text-slate-700">
              {report.strengths.map((strength, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-emerald-400 font-semibold flex-shrink-0">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card: Weaknesses */}
          <div className="p-6 rounded-2xl bg-red-950/10 border border-red-900/30 print:bg-white print:border print:border-slate-300 print:p-4">
            <div className="flex items-center gap-2 text-red-500 mb-4 print:text-red-700">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-sm font-bold tracking-tight text-white print:text-slate-900 font-sans">Identified Gaps</h3>
            </div>
            <ul className="space-y-3 font-sans text-xs text-slate-200 print:text-slate-700">
              {report.weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-red-500 font-semibold flex-shrink-0">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card: Missing Sections */}
          <div className="p-6 rounded-2xl bg-amber-950/10 border border-amber-900/30 print:bg-white print:border print:border-slate-300 print:p-4">
            <div className="flex items-center gap-2 text-amber-500 mb-4 print:text-amber-700">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-sm font-bold tracking-tight text-white print:text-slate-900 font-sans">Missing Elements</h3>
            </div>
            <ul className="space-y-3 font-sans text-xs text-slate-200 print:text-slate-700">
              {report.missingSections.map((section, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-amber-500 font-semibold flex-shrink-0">•</span>
                  <span>{section}</span>
                </li>
              ))}
            </ul>
          </div>

        </section>

        {/* Master Audited roadmaps (Interactive, and has checklist ticking properties!) */}
        <section id="interactive-roadmap" className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-850 print:bg-white print:border print:border-slate-300 print:p-4 print:mb-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800 mb-6 print:border-b print:border-slate-300">
            <div>
              <div className="flex items-center gap-2 text-blue-400">
                <Compass className="w-5 h-5" />
                <h2 className="text-base font-bold font-sans text-white print:text-black">Unified Improvement Roadmap</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-md font-sans">
                Tick items as you implement them in your codebase to see your portfolio score advance.
              </p>
            </div>

            {/* Check progress count */}
            <div className="flex items-center gap-4 bg-slate-950 border border-slate-850 p-3 px-4 rounded-xl print:hidden">
              <div className="text-right">
                <div className="text-xs font-bold text-white">{completedCount} / {totalCount} Done</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Implementation Progress</div>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-xs text-blue-400 relative">
                {roadmapProgress}%
              </div>
            </div>
          </div>

          <div className="space-y-8">
            
            {/* Critical Improvements Segment */}
            {criticalItems.length > 0 && (
              <div>
                <h4 className="text-xs uppercase font-extrabold text-red-400 tracking-widest mb-3 flex items-center gap-1.5 print:text-red-700 font-sans">
                  <span>●</span> Critical Actions
                </h4>
                <div className="space-y-3">
                  {criticalItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleRoadmap(item.id)}
                      className={`p-4 rounded-xl border transition-all flex items-start gap-4 cursor-pointer print:p-2 print:border-none ${
                        item.status === "completed"
                          ? "bg-slate-950/25 border-slate-850 opacity-60 text-slate-500 line-through print:opacity-100"
                          : "bg-slate-950 border-slate-850 hover:border-slate-800/80 print:bg-white"
                      }`}
                    >
                      <button className="text-red-400 mt-0.5 pointer-events-none print:hidden">
                        {item.status === "completed" ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-600" />
                        )}
                      </button>
                      <div>
                        <h5 className="text-xs font-bold font-sans text-slate-200 print:text-black">{item.title}</h5>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-sans">{item.description}</p>
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-850 print:bg-slate-100">
                          Action: {item.actionItem}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Improvements Segment */}
            {recommendedItems.length > 0 && (
              <div>
                <h4 className="text-xs uppercase font-extrabold text-blue-400 tracking-widest mb-3 flex items-center gap-1.5 print:text-blue-700 font-sans">
                  <span>●</span> Recommended Actions
                </h4>
                <div className="space-y-3">
                  {recommendedItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleRoadmap(item.id)}
                      className={`p-4 rounded-xl border transition-all flex items-start gap-4 cursor-pointer print:p-2 print:border-none ${
                        item.status === "completed"
                          ? "bg-slate-950/25 border-slate-850 opacity-60 text-slate-500 line-through print:opacity-100"
                          : "bg-slate-950 border-slate-850 hover:border-slate-800/80 print:bg-white"
                      }`}
                    >
                      <button className="text-blue-400 mt-0.5 pointer-events-none print:hidden">
                        {item.status === "completed" ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-600" />
                        )}
                      </button>
                      <div>
                        <h5 className="text-xs font-bold font-sans text-slate-200 print:text-black">{item.title}</h5>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-sans">{item.description}</p>
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-850 print:bg-slate-100">
                          Action: {item.actionItem}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Improvements Segment */}
            {optionalItems.length > 0 && (
              <div>
                <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-widest mb-3 flex items-center gap-1.5 print:text-slate-500 font-sans">
                  <span>●</span> Optional Polish
                </h4>
                <div className="space-y-3">
                  {optionalItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleRoadmap(item.id)}
                      className={`p-4 rounded-xl border transition-all flex items-start gap-4 cursor-pointer print:p-2 print:border-none ${
                        item.status === "completed"
                          ? "bg-slate-950/25 border-slate-850 opacity-60 text-slate-500 line-through print:opacity-100"
                          : "bg-slate-950 border-slate-850 hover:border-slate-800/80 print:bg-white"
                      }`}
                    >
                      <button className="text-slate-400 mt-0.5 pointer-events-none print:hidden">
                        {item.status === "completed" ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-600" />
                        )}
                      </button>
                      <div>
                        <h5 className="text-xs font-bold font-sans text-slate-200 print:text-black">{item.title}</h5>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-sans">{item.description}</p>
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-850 print:bg-slate-100">
                          Action: {item.actionItem}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* Dynamic print details disclaimer footer (show on printable paper page only) */}
        <footer className="hidden print:block text-center text-[10px] text-slate-400 mt-12 border-t border-slate-300 pt-6">
          Unified Assessment generated securely by PortfolioPilot AI. Powered by Gemini Advanced Flash.
        </footer>
      </main>
    </div>
  );
};
