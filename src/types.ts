// ============================================================
// EXPRESS Pipeline — Shared Analysis Types
// ============================================================
// Single source of truth for the data contract between the
// /api/analyze backend route and all frontend dashboard components.
// ============================================================

import { ParsedPage } from '@/lib/parser';
import { SeoIssue } from '@/lib/seo-checks';

export interface Persona {
  role: string;
  intent: string;
  painPoints: string[];
  engagementTriggers: string[];
}

export interface ContentGap {
  topic: string;
  priority: "High" | "Medium" | "Low";
  status: string;
  recommendation: string;
}

export interface Entity {
  name: string;
  type: string;
  relevance: number; // 0 to 1
}

export interface TechnicalInsight {
  metric: string;
  value: string;
  status: "optimal" | "warning" | "critical";
  details: string;
}

export interface Competitor {
  name: string;
  shareOfVoice: number;
  semanticGaps: string[];
  whyAiPrefers: string;
}

export interface OffSiteHub {
  platform: string;
  hubName: string;
  objectiveCopy: string;
}

export interface AnalysisData {
  url: string;
  score: number;
  marketProfile: {
    personas: Persona[];
    intents: { type: string; percentage: number }[];
    contentGaps: ContentGap[];
  };
  technicalInsights: {
    performanceScore: number;
    entities: Entity[];
    insights: TechnicalInsight[];
    aeoScore: number;
    geoScore: number;
  };
  payloads: {
    jsonLd: string;
    faqMarkdown: string;
    geoCopy: string;
  };
  competitors: Competitor[];
  offSiteStrategy: OffSiteHub[];
}

export interface SeoAuditData {
  url: string;
  score: number;
  scoreLabel: string;
  parsedPage: ParsedPage;
  issues: SeoIssue[];
  summary: { critical: number; warnings: number; good: number; total: number };
  categoryScores: Record<string, { score: number; total: number; passed: number; critical: number; warnings: number }>;
}

export interface AeoAnalysisData {
  url: string;
  score: number;
  scoreLabel: string;
  queryPatterns: { query: string; answerability: 'strong' | 'moderate' | 'weak'; recommendation: string }[];
  voiceSearchReadiness: number;
  featuredSnippetEligibility: { eligible: boolean; snippetType: string; reason: string }[];
  faqQuality: { question: string; answer: string; score: number; improvement: string }[];
  directAnswerCoverage: number;
  contentClarity: number;
  personas: Persona[];
  intents: { type: string; percentage: number }[];
  contentGaps: ContentGap[];
  entities: Entity[];
}

export interface GeoAnalysisData {
  url: string;
  score: number;
  scoreLabel: string;
  citationWorthiness: number;
  semanticDensity: number;
  factualClaims: { claim: string; verifiable: boolean; source: string }[];
  authoritySignals: { signal: string; present: boolean; impact: string }[];
  llmRetrievability: number;
  ragCompatibility: { metric: string; score: number; detail: string }[];
  topicCoverage: { topic: string; depth: 'shallow' | 'moderate' | 'comprehensive'; recommendation: string }[];
  payloads: { jsonLd: string; faqMarkdown: string; geoCopy: string };
  competitors: Competitor[];
  offSiteStrategy: OffSiteHub[];
}

export interface AnalysisResult {
  module: 'seo' | 'aeo' | 'geo' | 'full';
  url: string;
  timestamp: string;
  seo?: SeoAuditData;
  aeo?: AeoAnalysisData;
  geo?: GeoAnalysisData;
}
