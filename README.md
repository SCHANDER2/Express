# EXPRESS — Generative & Answer Engine Optimization Pipeline

> Zero-friction AEO, GEO, and semantic search optimization platform.  
> Analyze any public website's AI-readiness and generate deploy-ready structured payloads.

---

## 🏗 Tech Stack

| Layer           | Technology                                                    |
| --------------- | ------------------------------------------------------------- |
| **Framework**   | [Next.js 16](https://nextjs.org/) (App Router)                |
| **Language**    | TypeScript 5                                                  |
| **AI Engine**   | [Google Gemini 2.5 Flash](https://ai.google.dev/) via `@google/genai` |
| **Styling**     | [Tailwind CSS 4](https://tailwindcss.com/)                    |
| **Icons**       | [Lucide React](https://lucide.dev/)                           |
| **Deployment**  | [Vercel](https://vercel.com/)                                 |

---

## 📂 Project Layout

```
EXPRESS/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts          # Server-side analysis pipeline (POST /api/analyze)
│   │   ├── error.tsx                 # Route-level error boundary (client)
│   │   ├── global-error.tsx          # Root-level error boundary (client)
│   │   ├── globals.css               # Design system tokens + Tailwind config
│   │   ├── layout.tsx                # Root layout with metadata & fonts
│   │   └── page.tsx                  # Main dashboard (client component)
│   ├── components/
│   │   ├── OffSiteStrategyZone.tsx   # Off-site PR hub strategy panel
│   │   ├── PayloadZone.tsx           # JSON-LD, FAQ, GEO copy deploy panel
│   │   └── ReportZone.tsx            # Market/Intent & Technical Audit panels
│   ├── data/                         # Static data assets
│   └── types.ts                      # Shared TypeScript interfaces
├── public/                           # Static assets
├── .env.local                        # Local environment variables (git-ignored)
├── .gitignore                        # Git exclusion rules
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
└── vercel.json                       # Vercel deployment settings
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.17
- **npm** ≥ 9 (or pnpm/yarn)
- A **Google Gemini API key** from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd Express
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Google Gemini API Key — used server-side only in /api/analyze
GEMINI_API_KEY=your_gemini_api_key_here
```

> **⚠️ Security Note:** The `GEMINI_API_KEY` variable is intentionally **not** prefixed with `NEXT_PUBLIC_`. This ensures it is only available in server-side route handlers and is never exposed to the client browser.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build Test

```bash
npm run build
npm start
```

---

## ☁️ Deploying to Vercel

### Step-by-Step

1. **Push your code** to a GitHub/GitLab/Bitbucket repository.

2. **Import your project** on [vercel.com/new](https://vercel.com/new).

3. **Set environment variables** in the Vercel dashboard:
   - Navigate to your project → **Settings** → **Environment Variables**
   - Add the following variable:

   | Name             | Value                        | Environment     |
   | ---------------- | ---------------------------- | --------------- |
   | `GEMINI_API_KEY` | `your_gemini_api_key_here`   | Production, Preview, Development |

4. **Deploy.** Vercel will automatically detect the Next.js framework and build your project.

### Vercel Configuration

The project includes a minimal `vercel.json`:

```json
{
  "framework": "nextjs"
}
```

No additional configuration is required. The API route at `/api/analyze` runs as a serverless function with the `GEMINI_API_KEY` available via `process.env`.

---

## 🔒 Security Architecture

| Concern                    | Mitigation                                                                                     |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| **API Key Exposure**       | `GEMINI_API_KEY` is server-only (no `NEXT_PUBLIC_` prefix). Never bundled into client JS.       |
| **Anti-Bot Evasion**       | Outbound scraping requests include full Chrome-equivalent headers (UA, Sec-Ch-Ua, DNT, etc.).  |
| **WAF-Blocked Domains**    | Graceful fallback with user-facing message for 403/429/503 responses from protected sites.      |
| **Error Boundaries**       | Route-level (`error.tsx`) and root-level (`global-error.tsx`) React error boundaries.          |
| **API Error Handling**     | All API errors return structured `{ error: string }` JSON. No stack traces leak to production. |
| **Timeout Protection**     | 15-second abort signal on all outbound fetch requests.                                         |
| **Env File Protection**    | `.env*` patterns in `.gitignore` prevent accidental secret commits.                            |

---

## 📜 Available Scripts

| Script          | Command            | Description                        |
| --------------- | ------------------- | ---------------------------------- |
| **dev**         | `npm run dev`       | Start development server           |
| **build**       | `npm run build`     | Create production build             |
| **start**       | `npm start`         | Serve production build locally      |
| **lint**        | `npm run lint`      | Run ESLint code quality checks      |

---

## 📐 Architecture Overview

```
┌─────────────────────┐
│   Browser Client    │  ← page.tsx (React Client Component)
│   (No secrets)      │
└─────────┬───────────┘
          │ POST /api/analyze { url }
          ▼
┌─────────────────────┐
│  API Route Handler  │  ← route.ts (Server-Side Only)
│  (GEMINI_API_KEY)   │
├─────────────────────┤
│  1. Fetch target URL│──→ Target Website (with browser headers)
│  2. Extract text    │
│  3. Gemini Analysis │──→ Google Gemini 2.5 Flash API
│  4. Transform JSON  │
└─────────┬───────────┘
          │ AnalysisData JSON
          ▼
┌─────────────────────┐
│   Dashboard UI      │  ← ReportZone, PayloadZone, OffSiteStrategyZone
└─────────────────────┘
```

---

## 📝 License

Private. All rights reserved.
