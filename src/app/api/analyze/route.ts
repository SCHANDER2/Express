// ============================================================
// EXPRESS Pipeline — /api/analyze Route Handler
// ============================================================
// Accepts POST { url }, scrapes the target page, runs a
// multi-module Gemini semantic analysis, and returns structured
// AnalysisData JSON for the dashboard to consume.
// ============================================================

import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisData } from "@/types";

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// 1. Gemini Client Initialization
// ---------------------------------------------------------------------------
function getAIClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to your environment variables."
    );
  }
  return new GoogleGenAI({ apiKey: key });
}

// ---------------------------------------------------------------------------
// 2. HTML → Clean Text Extraction
// ---------------------------------------------------------------------------
function extractVisibleText(html: string): string {
  let text = html;

  // Remove everything inside <script>, <style>, <noscript>, <svg>, <iframe>
  text = text.replace(/<(script|style|noscript|svg|iframe)[^>]*>[\s\S]*?<\/\1>/gi, " ");

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, " ");

  // Remove all HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/&\w+;/g, " ");

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  // Truncate to ~15,000 chars to stay within Gemini token budget
  if (text.length > 15000) {
    text = text.slice(0, 15000) + "\n\n[...content truncated for analysis...]";
  }

  return text;
}

// ---------------------------------------------------------------------------
// 3. Gemini Response Schema (strict structured output)
// ---------------------------------------------------------------------------
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    entityName: { type: Type.STRING, description: "The primary entity/organization/product name identified on the page." },
    entityType: { type: Type.STRING, description: "Classification: Organization, SaaS Product, E-Commerce, Agency, Blog, etc." },
    overallScore: { type: Type.NUMBER, description: "Overall AEO/GEO readiness score from 0 to 100." },
    aeoScore: { type: Type.NUMBER, description: "Answer Engine Optimization score from 0 to 100." },
    geoScore: { type: Type.NUMBER, description: "Generative Engine Optimization score from 0 to 100." },
    performanceScore: { type: Type.NUMBER, description: "Estimated content quality/performance score from 0 to 100." },

    // Module 1: De-Jargonization — Entities
    entities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, description: "Organization, Product, Technology, Topic, Service, Person, etc." },
          relevance: { type: Type.NUMBER, description: "Relevance weight from 0.0 to 1.0." },
        },
        required: ["name", "type", "relevance"],
      },
      description: "Top 5-7 semantic entities extracted from the page content.",
    },

    // Module 2: Intent & Behavioral Mapping — Personas
    personas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING, description: "e.g., Decision Maker (CTO/VP Engineering)" },
          intent: { type: Type.STRING, description: "e.g., Commercial / Transactional" },
          painPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 specific pain points this persona would experience." },
          engagementTriggers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 specific engagement triggers that would convert this persona." },
        },
        required: ["role", "intent", "painPoints", "engagementTriggers"],
      },
      description: "3 distinct target audience personas.",
    },

    // Module 2: Intent Distribution
    intents: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "e.g., Informational (How it works, Docs)" },
          percentage: { type: Type.NUMBER, description: "Estimated percentage of traffic intent, must sum to 100." },
        },
        required: ["type", "percentage"],
      },
      description: "4 search intent categories with percentage breakdown summing to 100.",
    },

    // Module 2: Content Gaps
    contentGaps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING, description: "The missing or underperforming content topic." },
          priority: { type: Type.STRING, description: "High, Medium, or Low." },
          status: { type: Type.STRING, description: "e.g., Missing completely, Poorly optimized for LLMs, Non-semantic HTML structure, Outdated links" },
          recommendation: { type: Type.STRING, description: "Specific actionable recommendation to fix this gap." },
        },
        required: ["topic", "priority", "status", "recommendation"],
      },
      description: "4 content gaps identified on the website.",
    },

    // Module 1/2: Technical Insights
    technicalInsights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          metric: { type: Type.STRING, description: "e.g., Semantic Heading Nesting, JSON-LD Metadata Schema" },
          value: { type: Type.STRING, description: "Current state value, e.g., Not Detected, Improper (H3 before H2)" },
          status: { type: Type.STRING, description: "optimal, warning, or critical" },
          details: { type: Type.STRING, description: "Detailed explanation of why this matters for AI search engines." },
        },
        required: ["metric", "value", "status", "details"],
      },
      description: "4 technical diagnostic insights about the website's AI-readiness.",
    },

    // Module 5: Payload Generation
    jsonLdSchema: { type: Type.STRING, description: "Complete JSON-LD schema.org structured data block (raw JSON string, no wrapping script tag)." },
    faqMarkdown: { type: Type.STRING, description: "LLM-optimized FAQ Markdown block with 3 Q&A pairs using ### and #### headers." },
    geoCopy: { type: Type.STRING, description: "GEO authority HTML section for site footer/about page with semantic markup." },

    // Module 6: Competitor Compare & Off-Site Strategy
    competitors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the competitor." },
          shareOfVoice: { type: Type.NUMBER, description: "Share of Voice visibility score (0 to 100 integer)." },
          semanticGaps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Detailed semantic gaps (topical focus points the competitor ranks for that our user is completely missing)."
          },
          whyAiPrefers: { type: Type.STRING, description: "Concise summary explaining exactly why the AI prefers them." }
        },
        required: ["name", "shareOfVoice", "semanticGaps", "whyAiPrefers"]
      },
      description: "List of 2-3 inferred industry market competitors based on the scraped utility context."
    },
    offSiteStrategy: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING, description: "Platform name (e.g., Reddit, Quora, Dev.to, IndieHackers)." },
          hubName: { type: Type.STRING, description: "Specific subreddit or channel/forum category (e.g., r/saas, Quora space, Dev.to/webdev)." },
          objectiveCopy: { type: Type.STRING, description: "Custom, pre-written objective copy tailored for the user to post off-site to build AI citation authority." }
        },
        required: ["platform", "hubName", "objectiveCopy"]
      },
      description: "List of 3 targeted external digital hubs with custom pre-written copy."
    },
  },
  required: [
    "entityName", "entityType", "overallScore", "aeoScore", "geoScore", "performanceScore",
    "entities", "personas", "intents", "contentGaps", "technicalInsights",
    "jsonLdSchema", "faqMarkdown", "geoCopy", "competitors", "offSiteStrategy"
  ],
};

// ---------------------------------------------------------------------------
// 4. Analysis Prompt
// ---------------------------------------------------------------------------
function buildPrompt(url: string, text: string): string {
  return `You are EXPRESS, an elite AI optimization analyst specializing in AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), and semantic search readiness analysis. You are analyzing a website to assess its visibility and retrievability by AI search engines, LLMs, and conversational assistants.

TARGET URL: ${url}

EXTRACTED WEBSITE TEXT:
---
${text}
---

Execute the following analysis modules in a single pass:

## MODULE 1 — De-Jargonization & Entity Extraction
- Identify the primary entity name and its type (Organization, SaaS Product, E-Commerce, Agency, Blog, etc.).
- Extract 5-7 core semantic entities from the content (organizations, products, technologies, topics, services).
- For each entity, assign a relevance weight (0.0–1.0) based on how central it is to the page's purpose.
- Translate any vague corporate jargon ("synergy", "leverage", "empower", "next-generation solutions") into precise, ground-truth functional descriptions.

## MODULE 2 — Intent & Behavioral Mapping
- Profile 3 distinct target audience personas who would search for this website. For each:
  - Assign a role (e.g., "Decision Maker (CTO/VP Engineering)") and primary intent type.
  - List 3 specific search pain points they would encounter on this site.
  - List 3 specific engagement triggers that would convert them.
- Generate a search intent distribution (4 categories: Informational, Commercial, Transactional, Navigational) with percentages summing to 100.
- Identify 4 content gaps — missing or underperforming content areas that hurt AI discoverability. For each, assign a priority (High/Medium/Low), current status, and an actionable recommendation.
- Generate 4 technical diagnostic insights about the site's AI-readiness:
  - Evaluate: semantic heading hierarchy, JSON-LD/structured data presence, content accessibility for AI crawlers, and content structure/performance.
  - For each, provide the metric name, current value, status (optimal/warning/critical), and detailed explanation.

## MODULE 5 — Payload Generation
- Generate a complete, valid JSON-LD schema.org block (as a raw JSON string) appropriate for this entity type. Include proper @context, @type, name, description, and any relevant nested properties.
- Generate an LLM-optimized FAQ Markdown block with exactly 3 Q&A pairs. Use ### for the section title and #### for each question. Answers should be factual, specific, and directly derived from the website content.
- Generate a GEO authority HTML section suitable for a site footer or about page. Include semantic HTML tags (<section>, <h2>, <p>, <strong>) with specific, quantified claims derived from or inspired by the content.

## MODULE 6 — Competitor Profiling & Off-Site PR Strategy
- Systematically infer 2-3 key industry competitors for the target site based on the scraped content and context.
- For each competitor:
  - Provide a name.
  - Calculate an AI "Share of Voice" visibility score (0 to 100 integer) indicating how frequently and positively they are mentioned or cited by AI search engines and RAG pipelines relative to the user.
  - Detail 3 specific "Semantic Gaps" (topics, keywords, or content focus areas the competitor ranks highly for in LLM knowledge graphs but our user completely lacks).
  - Summarize exactly "Why the AI prefers them" (concise, data-driven synthesis of their LLM authority edge).
- Identify 3 targeted external digital hubs (specific Subreddits like r/saas, Quora spaces, Dev.to, or niche business/developer forums) where the user can build AI citation authority.
- For each hub, write custom, highly objective, value-first copy/posts tailored for the user's product to build credibility and citations in AI training datasets. The copy must sound human, helpful, and completely objective (not promotional or spammy).

## SCORING
- Assign an overall AEO/GEO readiness score (0–100) based on how well the site currently performs across all modules.
- Assign individual AEO (Answer Engine Optimization) and GEO (Generative Engine Optimization) scores (0–100).
- Assign a content quality/performance score (0–100).

Be specific, analytical, and data-driven. Avoid generic filler. Every recommendation must be actionable and every insight must reference observable evidence from the extracted text.`;
}

// ---------------------------------------------------------------------------
// 5. Transform Gemini response → AnalysisData
// ---------------------------------------------------------------------------
interface GeminiResponse {
  entityName: string;
  entityType: string;
  overallScore: number;
  aeoScore: number;
  geoScore: number;
  performanceScore: number;
  entities: { name: string; type: string; relevance: number }[];
  personas: { role: string; intent: string; painPoints: string[]; engagementTriggers: string[] }[];
  intents: { type: string; percentage: number }[];
  contentGaps: { topic: string; priority: string; status: string; recommendation: string }[];
  technicalInsights: { metric: string; value: string; status: string; details: string }[];
  jsonLdSchema: string;
  faqMarkdown: string;
  geoCopy: string;
  competitors: { name: string; shareOfVoice: number; semanticGaps: string[]; whyAiPrefers: string }[];
  offSiteStrategy: { platform: string; hubName: string; objectiveCopy: string }[];
}

function transformResponse(url: string, raw: GeminiResponse): AnalysisData {
  return {
    url,
    score: Math.max(0, Math.min(100, Math.round(raw.overallScore))),
    marketProfile: {
      personas: raw.personas.map((p) => ({
        role: p.role,
        intent: p.intent,
        painPoints: Array.isArray(p.painPoints) ? p.painPoints : [],
        engagementTriggers: Array.isArray(p.engagementTriggers) ? p.engagementTriggers : [],
      })),
      intents: raw.intents.map((i) => ({
        type: i.type,
        percentage: Math.round(i.percentage),
      })),
      contentGaps: raw.contentGaps.map((g) => ({
        topic: g.topic,
        priority: (["High", "Medium", "Low"].includes(g.priority) ? g.priority : "Medium") as "High" | "Medium" | "Low",
        status: g.status,
        recommendation: g.recommendation,
      })),
    },
    technicalInsights: {
      performanceScore: Math.max(0, Math.min(100, Math.round(raw.performanceScore))),
      entities: raw.entities.map((e) => ({
        name: e.name,
        type: e.type,
        relevance: Math.max(0, Math.min(1, e.relevance)),
      })),
      insights: raw.technicalInsights.map((t) => ({
        metric: t.metric,
        value: t.value,
        status: (["optimal", "warning", "critical"].includes(t.status) ? t.status : "warning") as "optimal" | "warning" | "critical",
        details: t.details,
      })),
      aeoScore: Math.max(0, Math.min(100, Math.round(raw.aeoScore))),
      geoScore: Math.max(0, Math.min(100, Math.round(raw.geoScore))),
    },
    payloads: {
      jsonLd: raw.jsonLdSchema,
      faqMarkdown: raw.faqMarkdown,
      geoCopy: raw.geoCopy,
    },
    competitors: Array.isArray(raw.competitors) ? raw.competitors.map((c) => ({
      name: c.name || "Unknown Competitor",
      shareOfVoice: Math.max(0, Math.min(100, Math.round(c.shareOfVoice || 0))),
      semanticGaps: Array.isArray(c.semanticGaps) ? c.semanticGaps : [],
      whyAiPrefers: c.whyAiPrefers || "",
    })) : [],
    offSiteStrategy: Array.isArray(raw.offSiteStrategy) ? raw.offSiteStrategy.map((h) => ({
      platform: h.platform || "External Hub",
      hubName: h.hubName || "General Topic",
      objectiveCopy: h.objectiveCopy || "",
    })) : [],
  };
}

// ---------------------------------------------------------------------------
// 6. POST Handler
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    // --- Parse & validate request body ---
    const body = await request.json().catch(() => null);

    if (!body || typeof body.url !== "string" || !body.url.trim()) {
      return Response.json(
        { error: "Missing or invalid 'url' field. Please provide a valid website URL." },
        { status: 400 }
      );
    }

    let targetUrl: string;
    try {
      const raw = body.url.trim();
      targetUrl = raw.startsWith("http") ? raw : `https://${raw}`;
      new URL(targetUrl); // validate
    } catch {
      return Response.json(
        { error: "Invalid URL format. Please provide a valid URL (e.g., https://example.com)." },
        { status: 400 }
      );
    }

    // --- Fetch the target page HTML ---
    let html: string;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const pageResponse = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "Sec-Ch-Ua":
            '"Chromium";v="126", "Google Chrome";v="126", "Not-A.Brand";v="8"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
          DNT: "1",
        },
      });

      clearTimeout(timeout);

      if (!pageResponse.ok) {
        // Detect aggressive anti-bot blocking (403, 429, Cloudflare 503)
        const blockedCodes = [403, 429, 503];
        if (blockedCodes.includes(pageResponse.status)) {
          return Response.json(
            {
              error: `This domain is highly protected (HTTP ${pageResponse.status}). The target website actively blocks automated analysis. Try a different URL, or check if the site uses Cloudflare, Akamai, or similar WAF protection.`,
            },
            { status: 422 }
          );
        }
        return Response.json(
          { error: `Failed to fetch the target URL. Server responded with status ${pageResponse.status}.` },
          { status: 502 }
        );
      }

      html = await pageResponse.text();
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.name === "AbortError"
          ? "Request timed out after 15 seconds. The target server may be slow or unresponsive."
          : "Could not connect to the target URL. Please check the address and try again.";

      return Response.json({ error: message }, { status: 502 });
    }

    // --- Extract clean text ---
    const extractedText = extractVisibleText(html);

    if (extractedText.length < 50) {
      return Response.json(
        { error: "Could not extract sufficient text content from the page. The site may be heavily JavaScript-rendered or empty." },
        { status: 422 }
      );
    }

    // --- Run Gemini analysis ---
    let geminiResult: GeminiResponse;
    try {
      const response = await getAIClient().models.generateContent({
        model: "gemini-2.5-flash",
        contents: buildPrompt(targetUrl, extractedText),
        config: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini API.");
      }

      geminiResult = JSON.parse(text) as GeminiResponse;
    } catch (err: unknown) {
      console.error("[EXPRESS] Gemini API error:", err);
      const message =
        err instanceof Error ? err.message : "Unknown Gemini API error.";
      return Response.json(
        { error: `AI analysis failed: ${message}` },
        { status: 500 }
      );
    }

    // --- Transform & respond ---
    const analysisData = transformResponse(targetUrl, geminiResult);
    return Response.json(analysisData);
  } catch (err: unknown) {
    console.error("[EXPRESS] Unhandled route error:", err);
    return Response.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 }
    );
  }
}
