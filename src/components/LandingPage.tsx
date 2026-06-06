/**
 * Landing Page Component for PortfolioPilot AI
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { 
  Github, 
  FileText, 
  Cpu, 
  Award, 
  TrendingUp, 
  Terminal, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight,
  BookOpen
} from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="relative min-h-screen text-slate-100 overflow-hidden bg-slate-950">
      
      {/* Decorative Blur Overlays */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {/* Hero Header */}
      <header id="landing-header" className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-blue-600 to-violet-600 p-1.5 rounded-lg">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              PortfolioPilot <span className="text-blue-500">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="landing-login-btn"
              onClick={onLogin}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              id="landing-get-started-btn"
              onClick={onStart}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-1.5 px-4 rounded-full transition-all shadow-lg shadow-blue-900/30 font-sans cursor-pointer"
            >
              Get Sample Review
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 mb-6"
          >
            <Award className="w-3.5 h-3.5 text-blue-400" />
            Empowering Computer Science Students
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white leading-tight font-sans"
          >
            Evaluate and Pilot Your Projects to{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Industry Grade
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed font-sans"
          >
            Review GitHub repositories, scrutinize presentation slides, and generate high-fidelity portfolio dashboards using Gemini intelligence. Bridge the gap between placement requirements and technical proficiency.
          </motion.p>

          {/* CTA Group */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <button
              id="landing-cta-primary"
              onClick={onStart}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-xl shadow-blue-950/50 flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-sans cursor-pointer"
            >
              Analyze My Portfolio Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="landing-cta-secondary"
              onClick={onLogin}
              className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-medium py-3 px-8 rounded-xl transition-all text-sm uppercase tracking-wider font-sans cursor-pointer"
            >
              Create Account
            </button>
          </motion.div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-left">
          
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-900 hover:border-blue-500/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <Github className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-3 font-sans">GitHub Repo Audit</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 font-sans">
              Reviews README quality, codebase density, folder arrangements, screenshots availability, and links to deploy preview websites. Generates a logical quality metric.
            </p>
            <span className="text-blue-500 text-xs font-semibold flex items-center gap-1">
              Analyze structure & docs <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-900 hover:border-violet-500/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 text-violet-400 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-3 font-sans">Presentation Reviewer</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 font-sans">
              Accepts slide decks/PDFs. Rates critical categories like Objectives, Problem Statements, Tech Architecture, concluding arguments, and future expansion scope.
            </p>
            <span className="text-violet-500 text-xs font-semibold flex items-center gap-1">
              Refine your presentation deck <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-900 hover:border-cyan-500/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-3 font-sans">Portfolio Master Score</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 font-sans">
              Assembles scores into cohesive metrics with placements & industry standards checks. Charts strengths, weaknesses, gaps, and an actionable roadmap to hit 95+.
            </p>
            <span className="text-cyan-500 text-xs font-semibold flex items-center gap-1">
              View target improvement roadmap <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </motion.div>

        </div>

        {/* Informative Stats Banner Segment */}
        <div id="stats-banner" className="py-12 border-t border-b border-slate-900 mt-28">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-extrabold text-white">93.4%</div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-sans">Review Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-500">10k+</div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-sans">Student Projects Evaluated</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">4.8 / 5</div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-sans">Placement Prep Rating</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-violet-500">Instant</div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-sans">Gemini-Powered Audits</div>
            </div>
          </div>
        </div>

        {/* Security & Support Guarantee */}
        <div id="landing-security" className="mt-28 p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-slate-900 relative">
          <div className="absolute top-1/2 left-12 w-32 h-32 rounded-full bg-blue-500/10 blur-[80px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold font-sans text-white mb-4">Enterprise standard checks, made accessible to students</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-sans">
                Our evaluation templates mirror real test systems used at major software corporations. Receive professional assessments, documentation grades, and architectural critiques instantly.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-slate-300 text-sm font-sans">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  GDPR & privacy-compliant file parsing.
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm font-sans">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  GitHub REST APIs for file layout auditing.
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm font-sans">
                  <BookOpen className="w-4 h-4 text-violet-400" />
                  Placement preparedness checks in text templates.
                </div>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl max-w-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                    <Briefcase className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold font-sans">Hiring Manager Readiness</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                      "Students often fail tech screenings not because of their code, but because of poor repository documentation and unguided project pitch architectures. PortfolioPilot AI provides exact advice to overcome this."
                    </p>
                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-3 font-sans">
                      CS Placement Director
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer id="landing-footer" className="mt-32 text-center text-xs text-slate-600 font-sans">
          &copy; {new Date().getFullYear()} PortfolioPilot AI. Powered securely by Gemini Advanced Models. All rights reserved.
        </footer>
      </main>
    </div>
  );
};
