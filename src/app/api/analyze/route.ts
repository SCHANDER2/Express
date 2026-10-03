import { GoogleGenAI, Type } from "@google/genai";
import { parseHtml } from "@/lib/parser";
import { runSeoChecks } from "@/lib/seo-checks";
import { calculateSeoScore, calculateCategoryScores, getScoreLabel } from "@/lib/scoring";
import type { AnalysisResult, SeoAuditData, AeoAnalysisData, GeoAnalysisData } from "@/types";

export const dynamic = 'force-dynamic';

function getAIClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({ apiKey: key });
}

// ---------------------------------------------------------------------------
// Schemas & Prompts
// ---------------------------------------------------------------------------

const AEO_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    queryPatterns: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          query: { type: Type.STRING },
          answerability: { type: Type.STRING }, // 'strong' | 'moderate' | 'weak'
          recommendation: { type: Type.STRING },
        },
        required: ["query", "answerability", "recommendation"]
      }
    },
    voiceSearchReadiness: { type: Type.NUMBER },
    featuredSnippetEligibility: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          eligible: { type: Type.BOOLEAN },
          snippetType: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ["eligible", "snippetType", "reason"]
      }
    },
    faqQuality: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
          score: { type: Type.NUMBER },
          improvement: { type: Type.STRING },
        },
        required: ["question", "answer", "score", "improvement"]
      }
    },
    directAnswerCoverage: { type: Type.NUMBER },
    contentClarity: { type: Type.NUMBER },
    personas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          intent: { type: Type.STRING },
          painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          engagementTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["role", "intent", "painPoints", "engagementTriggers"]
      }
    },
    intents: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          percentage: { type: Type.NUMBER },
        },
        required: ["type", "percentage"]
      }
    },
    contentGaps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          priority: { type: Type.STRING },
          status: { type: Type.STRING },
          recommendation: { type: Type.STRING },
        },
        required: ["topic", "priority", "status", "recommendation"]
      }
    },
    entities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          relevance: { type: Type.NUMBER },
        },
        required: ["name", "type", "relevance"]
      }
    }
  },
  required: [
    "queryPatterns", "voiceSearchReadiness", "featuredSnippetEligibility",
    "faqQuality", "directAnswerCoverage", "contentClarity", "personas",
    "intents", "contentGaps", "entities"
  ]
};

const GEO_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    citationWorthiness: { type: Type.NUMBER },
    semanticDensity: { type: Type.NUMBER },
    factualClaims: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          claim: { type: Type.STRING },
          verifiable: { type: Type.BOOLEAN },
          source: { type: Type.STRING },
        },
        required: ["claim", "verifiable", "source"]
      }
    },
    authoritySignals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          signal: { type: Type.STRING },
          present: { type: Type.BOOLEAN },
          impact: { type: Type.STRING },
        },
        required: ["signal", "present", "impact"]
      }
    },
    llmRetrievability: { type: Type.NUMBER },
    ragCompatibility: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          metric: { type: Type.STRING },
          score: { type: Type.NUMBER },
          detail: { type: Type.STRING },
        },
        required: ["metric", "score", "detail"]
      }
    },
    topicCoverage: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          depth: { type: Type.STRING }, // 'shallow' | 'moderate' | 'comprehensive'
          recommendation: { type: Type.STRING },
        },
        required: ["topic", "depth", "recommendation"]
      }
    },
    payloads: {
      type: Type.OBJECT,
      properties: {
        jsonLd: { type: Type.STRING },
        faqMarkdown: { type: Type.STRING },
        geoCopy: { type: Type.STRING },
      },
      required: ["jsonLd", "faqMarkdown", "geoCopy"]
    },
    competitors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          shareOfVoice: { type: Type.NUMBER },
          semanticGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          whyAiPrefers: { type: Type.STRING },
        },
        required: ["name", "shareOfVoice", "semanticGaps", "whyAiPrefers"]
      }
    },
    offSiteStrategy: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING },
          hubName: { type: Type.STRING },
          objectiveCopy: { type: Type.STRING },
        },
        required: ["platform", "hubName", "objectiveCopy"]
      }
    }
  },
  required: [
    "citationWorthiness", "semanticDensity", "factualClaims", "authoritySignals",
    "llmRetrievability", "ragCompatibility", "topicCoverage", "payloads",
    "competitors", "offSiteStrategy"
  ]
};

function buildAeoPrompt(text: string): string {
  return `You are an AEO (Answer Engine Optimization) analyst. Evaluate this content for answerability, featured snippets, voice search, FAQs, and intent.

CONTENT:
${text}

Extract query patterns, evaluate voice search readiness and featured snippet eligibility. Score FAQ quality. Identify personas, intents, content gaps, and entities.
`;
}

function buildGeoPrompt(text: string): string {
  return `You are a GEO (Generative Engine Optimization) analyst. Evaluate this content for citation worthiness, RAG compatibility, LLM retrievability, and authority signals.

CONTENT:
${text}

Evaluate citation worthiness, factual claims, and semantic density. Identify topic coverage depth, RAG compatibility. Generate a JSON-LD snippet, an FAQ markdown snippet, and GEO copy. Identify competitors and an off-site strategy hub list.
`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.url !== "string" || !body.url.trim()) {
      return Response.json({ error: "Missing or invalid 'url' field." }, { status: 400 });
    }

    const moduleReq = body.module || 'seo';
    if (!['seo', 'aeo', 'geo', 'full'].includes(moduleReq)) {
      return Response.json({ error: "Invalid module." }, { status: 400 });
    }

    let targetUrl: string;
    try {
      const raw = body.url.trim();
      targetUrl = raw.startsWith("http") ? raw : `https://${raw}`;
      new URL(targetUrl);
    } catch {
      return Response.json({ error: "Invalid URL format." }, { status: 400 });
    }

    // Fetch the target page HTML
    let html: string;
    let statusCode: number;
    const startMs = Date.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const pageResponse = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      clearTimeout(timeout);
      statusCode = pageResponse.status;

      if (!pageResponse.ok) {
        if ([403, 429, 503].includes(statusCode)) {
          return Response.json({ error: `Domain is highly protected (HTTP ${statusCode}).` }, { status: 422 });
        }
        return Response.json({ error: `Failed to fetch target URL. Status ${statusCode}.` }, { status: 502 });
      }

      html = await pageResponse.text();
    } catch (err: unknown) {
      return Response.json({ error: "Could not connect to the target URL or request timed out." }, { status: 502 });
    }
    const responseTime = Date.now() - startMs;

    // Parse HTML
    const parsedPage = parseHtml(html, targetUrl, statusCode, responseTime);
    const seoIssues = runSeoChecks(parsedPage);
    const seoScore = calculateSeoScore(seoIssues);
    
    let criticalCount = 0, warningCount = 0, goodCount = 0;
    for (const i of seoIssues) {
      if (i.severity === 'critical') criticalCount++;
      else if (i.severity === 'warning') warningCount++;
      else goodCount++;
    }

    const seoData: SeoAuditData = {
      url: targetUrl,
      score: seoScore,
      scoreLabel: getScoreLabel(seoScore),
      parsedPage,
      issues: seoIssues,
      summary: { critical: criticalCount, warnings: warningCount, good: goodCount, total: seoIssues.length },
      categoryScores: calculateCategoryScores(seoIssues),
    };

    const result: AnalysisResult = {
      module: moduleReq as 'seo' | 'aeo' | 'geo' | 'full',
      url: targetUrl,
      timestamp: new Date().toISOString(),
    };

    if (moduleReq === 'seo' || moduleReq === 'full') {
      result.seo = seoData;
    }

    if (moduleReq === 'aeo' || moduleReq === 'full') {
      const client = getAIClient();
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: buildAeoPrompt(parsedPage.textContent),
        config: {
          responseMimeType: "application/json",
          responseSchema: AEO_SCHEMA,
        },
      });
      const data = JSON.parse(response.text!) as Omit<AeoAnalysisData, 'url' | 'score' | 'scoreLabel'>;
      
      let aeoScore = Math.round((data.voiceSearchReadiness + data.directAnswerCoverage + data.contentClarity) / 3);
      
      result.aeo = {
        url: targetUrl,
        score: aeoScore,
        scoreLabel: getScoreLabel(aeoScore),
        ...data,
      };
    }

    if (moduleReq === 'geo' || moduleReq === 'full') {
      const client = getAIClient();
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: buildGeoPrompt(parsedPage.textContent),
        config: {
          responseMimeType: "application/json",
          responseSchema: GEO_SCHEMA,
        },
      });
      const data = JSON.parse(response.text!) as Omit<GeoAnalysisData, 'url' | 'score' | 'scoreLabel'>;
      
      let geoScore = Math.round((data.citationWorthiness + data.semanticDensity + data.llmRetrievability) / 3);

      result.geo = {
        url: targetUrl,
        score: geoScore,
        scoreLabel: getScoreLabel(geoScore),
        ...data,
      };
    }

    return Response.json(result);
  } catch (err: unknown) {
    console.error("[EXPRESS] Unhandled route error:", err);
    return Response.json({ error: "An unexpected server error occurred." }, { status: 500 });
  }
}
