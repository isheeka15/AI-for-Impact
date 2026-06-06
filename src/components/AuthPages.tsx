/**
 * Authentication Pages (Sign In and Sign Up)
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Cpu, Mail, Lock, User as UserIcon, ArrowRight, ArrowLeft, Terminal } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AuthPagesProps {
  onBackToLanding: () => void;
  onAuthSuccess: () => void;
  defaultMode?: "signin" | "signup";
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  onBackToLanding,
  onAuthSuccess,
  defaultMode = "signin"
}) => {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signin, signup } = useAuth();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        if (!email || !password) {
          throw new Error("Please fill in all credentials");
        }
        await signin(email, password);
      } else {
        if (!name || !email || !password) {
          throw new Error("All fields are mandatory for registration");
        }
        await signup(name, email, password);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Visual background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

      {/* Back button */}
      <button
        id="auth-back-btn"
        onClick={onBackToLanding}
        className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium font-sans cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      {/* Card container */}
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative z-10">
        
        {/* Brand logo header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-gradient-to-tr from-blue-600 to-violet-600 p-3 rounded-2xl mb-4">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white font-sans tracking-tight">
            {mode === "signin" ? "Welcome Back Pilot" : "Start Evaluating Today"}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-sans">
            {mode === "signin" 
              ? "Access your dashboard to continue evaluations" 
              : "Create an account to save histories & generate reports"
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium font-sans animate-bounce">
              {error}
            </div>
          )}

          {/* Name field (Signup only) */}
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 font-sans uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="auth-signup-name"
                  type="text"
                  placeholder="e.g. Heeka Roy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 font-sans uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5 animate-fade-in">
            <label className="text-xs font-semibold text-slate-300 font-sans uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Action button */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-950/20"
          >
            {loading ? (
              <span className="flex items-center gap-2 font-sans text-xs">
                <SpinnerIcon className="animate-spin w-4 h-4" /> Processing credentials...
              </span>
            ) : (
              <span className="flex items-center gap-2 font-sans font-semibold uppercase tracking-wider text-xs">
                {mode === "signin" ? "Sign In" : "Register Pilot"} <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Mode switch footer */}
        <div className="text-center mt-6 pt-6 border-t border-slate-800/80">
          {mode === "signin" ? (
            <p className="text-xs text-slate-400 font-sans">
              Don't have an portfolio profile?{" "}
              <button
                id="auth-toggle-to-signup"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className="text-blue-400 hover:text-blue-300 font-bold ml-1 hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-400 font-sans">
              Already registered your portfolio?{" "}
              <button
                id="auth-toggle-to-signin"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
                className="text-blue-400 hover:text-blue-300 font-extrabold ml-1 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

        {/* Demo Account Indicator */}
        <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-500 leading-relaxed flex items-center gap-2 font-sans">
          <Terminal className="w-4 h-4 text-slate-600 flex-shrink-0" />
          <span>
            <strong>Testing note:</strong> Register with any details or enter random credentials to log in!
          </span>
        </div>
      </div>
    </div>
  );
};

// Simple visual spinner component
const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      strokeWidth="4"
      strokeLinecap="round"
      className="opacity-25"
    />
    <path
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      className="opacity-75"
    />
  </svg>
);
