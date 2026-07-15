// ============================================================
// EXPRESS Pipeline — Shared Analysis Types
// ============================================================
// Single source of truth for the data contract between the
// /api/analyze backend route and all frontend dashboard components.
// ============================================================

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
