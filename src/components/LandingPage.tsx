/**
 * Landing Page Component for ProtfoliQ
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
              ProtfoliQ
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
            ProtfoliQ – AI Portfolio Intelligence for Job-Ready Students
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed font-sans"
          >
            Analyze GitHub codebases and project presentations together to surface recruiter signals, skill gaps, and production readiness in one polished AI report.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all"
          >
            <div className="w-12 h-12 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-5 text-blue-400">
              <Github className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">GitHub Intelligence Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Audit repository structure, README quality, code hygiene, and production signals with AI-powered GitHub analysis.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-violet-500/30 transition-all"
          >
            <div className="w-12 h-12 rounded-3xl bg-violet-500/10 flex items-center justify-center mb-5 text-violet-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Recruiter View Mode</h3>
            <p className="text-slate-400 text-sm leading-relaxed">See your portfolio through recruiter eyes with positive/negative hiring signals and concise placement-ready guidance.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition-all"
          >
            <div className="w-12 h-12 rounded-3xl bg-cyan-500/10 flex items-center justify-center mb-5 text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Skill Inference</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Detect in-demand technical skills in your project and uncover missing abilities recruiters expect.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-all"
          >
            <div className="w-12 h-12 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-5 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Production Readiness</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Assess deployment readiness, security posture, and CI/CD maturity inside your portfolio.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-500/30 transition-all"
          >
            <div className="w-12 h-12 rounded-3xl bg-slate-500/10 flex items-center justify-center mb-5 text-slate-300">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Portfolio Benchmarking</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Compare your portfolio against average student, internship, and industry-level benchmarks.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/30 transition-all"
          >
            <div className="w-12 h-12 rounded-3xl bg-amber-500/10 flex items-center justify-center mb-5 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Roast Mode</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Enjoy a playful critique that exposes rough edges and surface quick wins for improvement.</p>
          </motion.div>
        </div>

        <section className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-20">
          <div className="xl:col-span-3 p-8 rounded-[2rem] bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Sample Analysis Preview</p>
                <h3 className="text-2xl font-bold text-white mt-2">Mock ProtfoliQ Audit Snapshot</h3>
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Demo</span>
            </div>
            <div className="rounded-[2rem] bg-slate-950 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-5 gap-4">
                <div>
                  <p className="text-xs uppercase text-slate-500 tracking-wide">Portfolio Score</p>
                  <p className="text-4xl font-black text-blue-400">87</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase text-slate-500 tracking-wide">Recruiter Fit</p>
                  <p className="text-lg font-bold text-violet-400">Strong</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "GitHub Intelligence", value: 84, color: "from-blue-500 to-cyan-500" },
                  { label: "Skill Inference", value: 78, color: "from-cyan-500 to-emerald-500" },
                  { label: "Production Readiness", value: 72, color: "from-violet-500 to-fuchsia-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 text-sm text-slate-400">
                <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4">
                  <p className="font-semibold text-white">Detected Skills</p>
                  <p>React, Node.js, TypeScript, Tailwind CSS</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4">
                  <p className="font-semibold text-white">Missing Skills</p>
                  <p>CI/CD, Docker, Unit Testing</p>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 p-8 rounded-[2rem] bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">Why ProtfoliQ?</p>
              <h4 className="text-xl font-bold text-white mb-3">Deliver a portfolio that recruiters trust</h4>
              <p className="text-slate-400 text-sm leading-relaxed">This preview shows the kind of recruiter-ready breakdown ProtfoliQ provides: clear scoring, skill highlights, and readiness signals that make interviews easier.</p>
            </div>
            <div className="mt-6 grid gap-3">
              <div className="rounded-3xl bg-slate-950/70 border border-slate-800 p-4">
                <p className="text-xs uppercase text-slate-500 tracking-wide mb-2">Benchmark Summary</p>
                <p className="text-sm text-slate-300">Above average student work, competitive for internships, closing in on industry-level polish.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/70 border border-slate-800 p-4">
                <p className="text-xs uppercase text-slate-500 tracking-wide mb-2">Roast Mode Insight</p>
                <p className="text-sm text-slate-300">Nice demo energy, but it still reads like a campus project without a formal release path.</p>
              </div>
            </div>
          </div>
        </section>

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
                      "Students often fail tech screenings not because of their code, but because of poor repository documentation and unguided project pitch architectures. ProtfoliQ provides exact advice to overcome this."
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
          &copy; {new Date().getFullYear()} ProtfoliQ. Powered securely by Gemini Advanced Models. All rights reserved.
        </footer>
      </main>
    </div>
  );
};
