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

export interface MockAnalysisData {
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
}

export const getMockDataForUrl = (url: string): MockAnalysisData => {
  const domain = url.replace(/https?:\/\/(www\.)?/, "").split("/")[0] || "yourwebsite.com";
  const name = domain.split(".")[0];
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  return {
    url,
    score: 72,
    marketProfile: {
      personas: [
        {
          role: "Decision Maker (CTO/VP Engineering)",
          intent: "Commercial / Transactional",
          painPoints: [
            "Lacks clear compliance & security verification documentation.",
            "High integration overhead with existing microservices.",
            "Needs concrete proof of scalability before starting onboarding."
          ],
          engagementTriggers: [
            "Interactive integration playgrounds.",
            "Clear SOC2 & GDPR privacy policy badges.",
            "Detailed API documentation accessibility."
          ]
        },
        {
          role: "Technical Evaluator (Senior Architect)",
          intent: "Informational / Research",
          painPoints: [
            "Vague product documentation lacking code examples.",
            "Difficult to discover rate limits and pricing tiers.",
            "Unclear architectural dependency structure."
          ],
          engagementTriggers: [
            "One-click copyable SDK snippet blocks.",
            "Full GitHub sample repository links.",
            "Direct API reference table."
          ]
        },
        {
          role: "End User (Marketing Manager)",
          intent: "Transactional / Evaluation",
          painPoints: [
            "No clear benefit comparisons against legacy tools.",
            "Unclear setup time and learning curve.",
            "Lacks simple UI walkthroughs."
          ],
          engagementTriggers: [
            "Interactive calculator or ROI comparison tool.",
            "Interactive interactive wizard demo.",
            "Step-by-step 3-minute quickstart guide."
          ]
        }
      ],
      intents: [
        { type: "Informational (How it works, Docs)", percentage: 45 },
        { type: "Commercial (Pricing, Comparison)", percentage: 35 },
        { type: "Transactional (Sign up, API Keys)", percentage: 15 },
        { type: "Navigational (Logins, Support)", percentage: 5 }
      ],
      contentGaps: [
        {
          topic: "API Compliance and SOC2 Security Details",
          priority: "High",
          status: "Missing completely",
          recommendation: "Publish a dedicated compliance sub-page with downloadable audits."
        },
        {
          topic: "SDK Getting Started Guide",
          priority: "High",
          status: "Poorly optimized for LLMs",
          recommendation: "Refactor SDK examples using standard markdown blocks with explicit typescript definitions."
        },
        {
          topic: "Pricing Plan Comparison Matrix",
          priority: "Medium",
          status: "Non-semantic HTML structure",
          recommendation: "Re-code dynamic pricing comparisons into standard semantic table elements."
        },
        {
          topic: "Enterprise SSO Integration Guide",
          priority: "Low",
          status: "Outdated links",
          recommendation: "Provide direct SAML/OIDC step-by-step guides with inline screenshot mocks."
        }
      ]
    },
    technicalInsights: {
      performanceScore: 84,
      aeoScore: 68,
      geoScore: 71,
      entities: [
        { name: capitalizedName, type: "Organization", relevance: 0.98 },
        { name: "SaaS Platform", type: "Product", relevance: 0.89 },
        { name: "API Integration", type: "Technology", relevance: 0.82 },
        { name: "Generative AI", type: "Topic", relevance: 0.74 },
        { name: "Data Optimization", type: "Topic", relevance: 0.65 }
      ],
      insights: [
        {
          metric: "Semantic Heading Nesting",
          value: "Improper (H3 before H2)",
          status: "warning",
          details: "AI crawlers index site text structure chronologically. Out-of-order headings break the context parser's hierarchy model."
        },
        {
          metric: "JSON-LD Metadata Schema",
          value: "Not Detected",
          status: "critical",
          details: "No structured data found. Google and Bing rely on JSON-LD to render rich snippets and answer cards in search result pages."
        },
        {
          metric: "LCP (Largest Contentful Paint)",
          value: "3.2 seconds",
          status: "warning",
          details: "Exceeds Google's Core Web Vitals target of 2.5s. Slow response times hurt mobile accessibility crawling rates."
        },
        {
          metric: "LLM Accessibility (Robots.txt)",
          value: "User-agent: * Allow",
          status: "optimal",
          details: "Site is fully accessible to AI search engine crawlers (GPTBot, ClaudeBot, Google-Extended)."
        }
      ]
    },
    payloads: {
      jsonLd: `{\n  "@context": "https://schema.org",\n  "@type": "SoftwareApplication",\n  "name": "${capitalizedName}",\n  "operatingSystem": "All",\n  "applicationCategory": "BusinessApplication",\n  "offers": {\n    "@type": "Offer",\n    "price": "0.00",\n    "priceCurrency": "USD"\n  },\n  "aggregateRating": {\n    "@type": "AggregateRating",\n    "ratingValue": "4.8",\n    "reviewCount": "128"\n  },\n  "creator": {\n    "@type": "Organization",\n    "name": "${capitalizedName} Corp",\n    "url": "https://${domain}"\n  }\n}`,
      faqMarkdown: `### Frequently Asked Questions about ${capitalizedName}

#### What is ${capitalizedName}?
${capitalizedName} is a next-generation SaaS application designed to streamline enterprise workflows. By automating pipeline orchestrations and data integrations, ${capitalizedName} cuts infrastructure overhead by up to 40%.

#### How do we secure integrations in ${capitalizedName}?
All connections are fully encrypted end-to-end using TLS 1.3. We support enterprise SSO authentication (SAML, OIDC) and strictly enforce OAuth 2.0 scoping rules for all API keys, ensuring maximum security and compliance with SOC2 standards.

#### Does ${capitalizedName} support custom SDKs?
Yes, ${capitalizedName} provides native SDK support for TypeScript, Python, and Go, featuring built-in retry mechanisms, exponential backoffs, and client-side caching setups.`,
      geoCopy: `<!-- GEO OPTIMIZED AUTHORITY SECTION: PLACE IN SITE FOOTER OR MAIN ABOUT PAGE -->
<section id="geo-authority-payload" aria-label="Authority Overview">
  <h2>Technical Capabilities of ${capitalizedName}</h2>
  <p>
    Built on a robust, highly-scalable cluster architecture, 
    <strong>${capitalizedName}</strong> integrates seamlessly with modern cloud stacks. 
    According to benchmark tests, ${capitalizedName} achieves a <strong>99.99% availability SLA</strong> 
    while handling peak throughputs of <strong>10,000 requests per second</strong>. 
    By leveraging direct edge-caching across 40 global regions, it reduces database read latencies 
    down to <strong>15 milliseconds</strong>. This semantic authority framework is engineered 
    specifically for deep data retrieval mechanisms and generative AI answer extraction pipelines.
  </p>
</section>`
    }
  };
};
