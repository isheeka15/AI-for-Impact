/**
 * ProtfoliQ Shared Types
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface RepoAnalysis {
  repoName: string;
  repoUrl: string;
  score: number;
  readmeQuality: number; // 0-100
  documentationQuality: number; // 0-100
  structureQuality: number; // 0-100
  commitActivity: number; // 0-100
  screenshotsPresent: boolean;
  setupInstructions: boolean;
  deploymentLinks: boolean;
  summary: string;
  suggestions: string[];
}

export interface PresentationAnalysis {
  docName: string;
  score: number;
  problemStatement: number; // 0-100
  objective: number; // 0-100
  architecture: number; // 0-100
  techStack: number; // 0-100
  futureScope: number; // 0-100
  conclusion: number; // 0-100
  summary: string;
  suggestions: string[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  type: 'critical' | 'recommended' | 'optional';
  description: string;
  actionItem: string;
  status: 'todo' | 'completed';
}

export interface RecruiterView {
  summary: string;
  positiveSignals: string[];
  negativeSignals: string[];
}

export interface BenchmarkComparison {
  averageStudent: number;
  internshipCandidate: number;
  industryPortfolio: number;
  summary: string;
}

export interface PortfolioReport {
  id: string;
  userId: string;
  date: string;
  repoUrl: string;
  docName: string;
  
  // Scoring
  githubScore: number;
  presentationScore: number;
  documentationScore: number; // combination of README and structure quality
  overallScore: number;
  portfolioScore: number;
  codeQualityScore: number;
  architectureScore: number;
  securityScore: number;
  productionReadinessScore: number;
  projectCompleteness: number;
  
  industryReadinessScore: number; // 0-100 based on standard matching
  placementReadinessScore: number; // 0-100 based on placements/placement tests

  recruiterView: RecruiterView;
  detectedSkills: string[];
  missingSkills: string[];
  benchmarkComparison: BenchmarkComparison;
  roastMode: string;
  improvementRoadmap: RoadmapItem[];

  // Detailed Analysis
  repoAnalysis: RepoAnalysis;
  presentationAnalysis: PresentationAnalysis;
  
  strengths: string[];
  weaknesses: string[];
  missingSections: string[];
  
  // Roadmap
  roadmap: RoadmapItem[];
}
