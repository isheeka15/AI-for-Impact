/**
 * AuthContext for client-side persistence and cache sync
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, PortfolioReport } from "../types";

interface AuthContextType {
  user: User | null;
  reports: PortfolioReport[];
  loading: boolean;
  signin: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  signout: () => void;
  fetchReports: () => Promise<void>;
  addReport: (report: PortfolioReport) => void;
  deleteReport: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>((() => {
    try {
      const stored = localStorage.getItem("pp_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })());

  const [reports, setReports] = useState<PortfolioReport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReports();
    } else {
      setReports([]);
    }
  }, [user]);

  const fetchReports = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (e) {
      console.error("Error fetching reports", e);
    } finally {
      setLoading(false);
    }
  };

  const signin = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      setUser(data.user);
      localStorage.setItem("pp_user", JSON.stringify(data.user));
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      setUser(data.user);
      localStorage.setItem("pp_user", JSON.stringify(data.user));
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const signout = () => {
    setUser(null);
    setReports([]);
    localStorage.removeItem("pp_user");
  };

  const addReport = (report: PortfolioReport) => {
    setReports((prev) => [report, ...prev]);
  };

  const deleteReport = async (id: string) => {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== id));
      } else {
        throw new Error("Failed to delete report from server");
      }
    } catch (err) {
      console.error("Error during deletion", err);
      // Fallback: update UI anyway
      setReports((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        reports,
        loading,
        signin,
        signup,
        signout,
        fetchReports,
        addReport,
        deleteReport,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
