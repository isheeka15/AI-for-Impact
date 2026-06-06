/**
 * Dynamic Dashboard Component for ProtfoliQ
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Github, 
  FileText, 
  Trash2, 
  ArrowRight, 
  Clock, 
  Award, 
  Plus, 
  TrendingUp, 
  LogOut,
  FolderOpen,
  UserCheck,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PortfolioReport } from "../types";

interface DashboardProps {
  onAnalyzeRepo: () => void;
  onAnalyzePresentation: () => void;
  onSelectReport: (report: PortfolioReport) => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onAnalyzeRepo,
  onAnalyzePresentation,
  onSelectReport,
  onLogout,
}) => {
  const { user, reports, deleteReport } = useAuth();

  // Find latest report for quick stats
  const latestReport = reports && reports.length > 0 ? reports[0] : null;

  const currentOverall = latestReport ? latestReport.portfolioScore : 0;
  const currentGithub = latestReport ? latestReport.githubScore : 0;
  const currentPresentation = latestReport ? latestReport.presentationScore : 0;
  const currentDocumentation = latestReport ? latestReport.documentationScore : 0;
  const portfolioScore = latestReport ? latestReport.portfolioScore : 0;
  const architectureScore = latestReport ? latestReport.architectureScore : 0;
  const securityScore = latestReport ? latestReport.securityScore : 0;
  const productionReadinessScore = latestReport ? latestReport.productionReadinessScore : 0;
  const projectCompleteness = latestReport ? latestReport.projectCompleteness : 0;
  const recruiterView = latestReport?.recruiterView || {
    summary: "A portfolio signal summary will appear once you run an audit.",
    positiveSignals: ["Run an audit to unlock recruiter insights"],
    negativeSignals: ["No recruiter feedback available yet"],
  };
  const detectedSkills = latestReport?.detectedSkills || [];
  const missingSkills = latestReport?.missingSkills || [];
  const benchmarkComparison = latestReport?.benchmarkComparison || {
    averageStudent: 0,
    internshipCandidate: 0,
    industryPortfolio: 0,
    summary: "Run an audit to compare your portfolio against standard benchmarks.",
  };
  const roastMode = latestReport?.roastMode || "Run a report to generate your GitHub Roast Mode feedback.";
  const improvementRoadmap = latestReport?.improvementRoadmap || latestReport?.roadmap || [];

  return (
    <div className="min-h-screen text-slate-100 bg-slate-950 font-sans">
      
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Navigation Sub-header */}
      <nav id="dashboard-navbar" className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              ProtfoliQ Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
              <span className="text-xs font-semibold text-slate-300">{user?.name || "Pilot User"}</span>
            </div>
            <button
              id="dashboard-logout-btn"
              onClick={onLogout}
              className="p-1 px-2 text-slate-400 hover:text-red-400 border border-slate-850 hover:border-red-900/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Welcome Section Banner */}
        <div id="welcome-banner" className="mb-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900/60 border border-slate-900 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-blue-400">Workspace Hub</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
                Pilot Command Center
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
                Review your projects, analyze code layout, scrutinize slides decks, and explore dynamic roadmaps to meet standard internship thresholds.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                id="dash-action-repo"
                onClick={onAnalyzeRepo}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-900/20"
              >
                <Plus className="w-4 h-4" /> Repo Audit
              </button>
              <button
                id="dash-action-presentation"
                onClick={onAnalyzePresentation}
                className="bg-slate-905 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-200 font-medium py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Presentation Review
              </button>
            </div>
          </div>
        </div>

        {/* Master Scorecards HUD */}
        <section id="hud-scorecards" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          
          {/* Card 1: Overall Score */}
          <div className="relative group p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-blue-500 to-violet-500" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">ProtfoliQ Portfolio Score</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{currentOverall}</span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${currentOverall}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-500 font-medium">
                <span>Threshold: 85 min</span>
                <span>{latestReport ? "Analyzed" : "No report"}</span>
              </div>
            </div>
          </div>

          {/* Card 2: GitHub Score */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">code quality score</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Github className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{currentGithub}</span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${currentGithub}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-500 font-medium">
                <span>README & Folder layout</span>
                <span>Avg: 70%</span>
              </div>
            </div>
          </div>

          {/* Card 3: Presentation Score */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">slide pitch quality</span>
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{currentPresentation}</span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-violet-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${currentPresentation}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-500 font-medium">
                <span>Rationale & objectives</span>
                <span>Avg: 75%</span>
              </div>
            </div>
          </div>

          {/* Card 4: Documentation Score */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">documentation coverage</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{currentDocumentation}</span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${currentDocumentation}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-500 font-medium">
                <span>Instructions & specs</span>
                <span>Avg: 65%</span>
              </div>
            </div>
          </div>
        </section>

        {/* ProtfoliQ Insight Blocks */}
        <section id="insight-grid" className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl shadow-slate-950/20">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">Recruiter View Mode</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{recruiterView.summary}</p>
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-2xl bg-slate-950/70 p-4 border border-slate-800">
                <div className="text-[11px] uppercase text-emerald-400 tracking-wide mb-2">Positive Signals</div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {recruiterView.positiveSignals.map((signal, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-slate-950/70 p-4 border border-slate-800">
                <div className="text-[11px] uppercase text-rose-400 tracking-wide mb-2">Negative Signals</div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {recruiterView.negativeSignals.map((signal, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-rose-400" />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl shadow-slate-950/20">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">Skill Inference Engine</h3>
            <div className="mb-4">
              <div className="text-[11px] uppercase text-cyan-400 tracking-wide mb-2">Detected Skills</div>
              <div className="flex flex-wrap gap-2">
                {detectedSkills.length > 0 ? (
                  detectedSkills.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-slate-950/80 text-xs text-emerald-300">{skill}</span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">Run an audit to identify skills.</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase text-amber-400 tracking-wide mb-2">Missing Skills</div>
              <div className="flex flex-wrap gap-2">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-slate-950/80 text-xs text-rose-300">{skill}</span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">The AI will identify skill gaps after your first evaluation.</span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl shadow-slate-950/20">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">Production Readiness Checker</h3>
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-slate-300">
              <div className="rounded-2xl bg-slate-950/70 p-3 border border-slate-800">
                <span className="block text-[10px] uppercase text-slate-500">Architecture Score</span>
                <span className="text-sm font-semibold text-white">{architectureScore}%</span>
              </div>
              <div className="rounded-2xl bg-slate-950/70 p-3 border border-slate-800">
                <span className="block text-[10px] uppercase text-slate-500">Security Score</span>
                <span className="text-sm font-semibold text-white">{securityScore}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white">Readiness Score</span>
              <span className="text-sm font-black text-violet-400">{productionReadinessScore}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full" style={{ width: `${productionReadinessScore}%` }} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Evaluates whether your repository looks like a classroom submission or deployment-ready product, including pipelines, release notes, and security coverage.</p>
          </div>
        </section>

        <section id="benchmarking-grid" className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl shadow-slate-950/20">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">Project Completeness Analyzer</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white">Completeness</span>
              <span className="text-sm font-black text-cyan-300">{projectCompleteness}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${projectCompleteness}%` }} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Measures whether your portfolio has core deliverables, documentation, deployability, and a complete project narrative.</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl shadow-slate-950/20">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">Portfolio Benchmarking</h3>
            <div className="space-y-3">
              {[
                { label: "Average Student", value: benchmarkComparison.averageStudent, color: "bg-slate-700" },
                { label: "Internship-Level", value: benchmarkComparison.internshipCandidate, color: "bg-blue-500" },
                { label: "Industry Portfolio", value: benchmarkComparison.industryPortfolio, color: "bg-violet-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">Compare your portfolio across student, internship, and industry readiness bands.</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl shadow-slate-950/20">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">GitHub Roast Mode</h3>
            <div className="rounded-2xl bg-slate-950/70 p-4 border border-slate-800 text-sm text-slate-300 leading-relaxed">
              {roastMode}
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">A light-hearted critique card to help you spot the rough edges in your repository.</p>
          </div>
        </section>

        <section id="roadmap-generator" className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl shadow-slate-950/20 mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">AI Roadmap Generator</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-2xl">Actionable steps created by ProtfoliQ to raise your score fast and close recruiter gaps.</p>
            </div>
            <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">{improvementRoadmap.length} Actions</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {improvementRoadmap.slice(0, 6).map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-xs uppercase font-semibold text-slate-400">{item.type}</span>
                  <span className={`text-[10px] rounded-full px-2 py-1 ${
                    item.type === "critical" ? "bg-red-500/10 text-red-300" : item.type === "recommended" ? "bg-blue-500/10 text-blue-300" : "bg-emerald-500/10 text-emerald-300"
                  }`}>{item.status}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{item.description}</p>
                <div className="text-[11px] text-slate-300 bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2">{item.actionItem}</div>
              </div>
            ))}
            {improvementRoadmap.length === 0 && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-500">
                Run an audit and ProtfoliQ will generate a fully customized improvement roadmap here.
              </div>
            )}
          </div>
        </section>

        {/* Bento Grid Split: Active Insights & Analysis History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* History Panel */}
          <section id="recent-analyses" className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-bold text-white tracking-tight">Saved Audits</h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {reports.length} {reports.length === 1 ? "Report" : "Reports"} Available
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-850">
                <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center mx-auto mb-4 text-slate-600">
                  <Github className="w-5 h-5" />
                </div>
                <h3 className="text-white text-sm font-semibold">No Evaluations Found yet</h3>
                <p className="text-slate-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
                  Start by clicking "Repo Audit" or "Presentation Review" to evaluate your project with specialized Gemini Models.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={onAnalyzeRepo}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer cursor-pointer"
                  >
                    Launch GitHub Audit
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-slate-800 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex-shrink-0 flex items-center justify-center group-hover:border-slate-700 transition-colors">
                        {report.repoUrl ? (
                          <Github className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <FileText className="w-5 h-5 text-violet-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {report.repoUrl 
                            ? report.repoAnalysis?.repoName || "GitHub Repository"
                            : report.presentationAnalysis?.docName || "Presentation Slides"
                          }
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Clock className="w-3 h-3" /> {report.date}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-700 hidden sm:inline" />
                          <span className="text-[11px] truncate max-w-xs">{report.repoUrl || report.docName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-black text-white">{report.overallScore} <span className="text-[10px] text-slate-500 font-normal">/100</span></div>
                          <div className="text-[10px] text-slate-500 font-medium">Evaluation Index</div>
                        </div>
                        {/* Rating Badge */}
                        <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
                          report.overallScore >= 85 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : report.overallScore >= 70 
                            ? "bg-yellow-500/10 text-yellow-400" 
                            : "bg-red-500/10 text-red-400"
                        }`}>
                          {report.overallScore >= 85 ? "Industry Ready" : report.overallScore >= 70 ? "Needs Polish" : "Critical gaps"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectReport(report)}
                          className="p-1 px-3 bg-slate-950 hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-300 border border-slate-850 hover:border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          View Report <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="p-1.5 bg-slate-950 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded-lg border border-slate-850 hover:border-red-900/30 transition-all cursor-pointer"
                          title="Delete Analysis"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Highlights Metrics Panel */}
          <section id="insights-panel" className="space-y-6">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-slate-400" />
              Active Readiness
            </h2>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Placement Preparedness</span>
                  <span className="text-sm font-black text-blue-400">{latestReport ? latestReport.placementReadinessScore : 0}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${latestReport ? latestReport.placementReadinessScore : 0}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                  Based on repo completeness, setup instructions, problem-solving definitions, and tech explanation clarity.
                </p>
              </div>

              <div className="border-t border-slate-800 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Industry Standard matching</span>
                  <span className="text-sm font-black text-violet-400">{latestReport ? latestReport.industryReadinessScore : 0}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-violet-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${latestReport ? latestReport.industryReadinessScore : 0}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                  Reflects standard coding arrangements (directories structure, architecture specs, roadmap and deployment linkages).
                </p>
              </div>

              {latestReport && (
                <div className="border-t border-slate-800 pt-4 text-center">
                  <button
                    onClick={() => onSelectReport(latestReport)}
                    className="w-full bg-gradient-to-r from-blue-600/10 to-violet-600/10 hover:from-blue-600/20 hover:to-violet-600/20 text-slate-300 hover:text-white border border-slate-800 rounded-xl py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    View Active Roadmap
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/30 text-xs text-slate-400 leading-relaxed font-sans">
              <strong>Pilot Pro-Tip:</strong> Achieve an overall rating above <strong>85%</strong> to automatically pass recruiters primary screening models! Ensure screenshots exist in README, setup commands are copyable, and structural architecture is explicitly graphed.
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};
