<div align="center">

# 🎬 CineGen
### AI-Native Creative Marketplace

**Discover talent. Define campaigns. Create with confidence.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-cinegen--bytexl.vercel.app-6d28d9?style=for-the-badge)](https://cinegen-bytexl.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.0_Flash-4285F4?style=for-the-badge&logo=google)](https://aistudio.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

> Built for the **Kampus.VC AI Content Creator Marketplace Hackathon**

</div>

---

## 1. What is CineGen?

CineGen is an AI-native creative marketplace that connects **brands and agencies** with **verified AI content creators** — filmmakers, animators, generative artists, and motion designers.

### The Problem It Solves
Brands struggle to find, evaluate, and brief AI creators because:
- No standard portfolios exist for AI-generated work
- No way to verify which tools a creator actually uses
- Traditional freelance platforms don't understand AI-specific workflows
- Licensing and commercial-use requirements are unclear
- Briefing AI creators requires a different structure than traditional briefs

### How CineGen Solves It
- **Transparent portfolios** — creators show tools, prompts, and step-by-step workflow, not just final output
- **Explainable matching** — % compatibility scores with reasons, not a black box
- **AI Brief Builder** — Gemini AI turns a rough idea into a complete structured brief
- **Commercial Risk Scanner** — flags IP and licensing issues before engagement
- **Verification Evidence** — audited proof of tools and workflows

---

## 2. Judge Access — Zero Friction

> No signup. No OTP. No email verification. **Instant access.**

### 🔗 Live URL
```
https://cinegen-bytexl.vercel.app
```

A **judge welcome banner** appears at the top with instant access. Click it or go to `/login`.

### 1-Click Login

| Button | What you get |
|--------|-------------|
| **"Continue as Brand"** | Full brand dashboard, post briefs, AI builder, proposals |
| **"Continue as Creator"** | Creator dashboard, browse briefs, submit proposals |
| **"Explore as Guest"** | Browse all 18 creators without logging in |

### Manual Credentials

| Role | Email | Password |
|------|-------|----------|
| 🏢 Brand (Arjun Mehta) | `brand@cinegen.demo` | `Demo@123` |
| 🎬 Creator (Aryan Kapoor) | `creator@cinegen.demo` | `Demo@123` |

### All 18 Creator Accounts — Password: `Demo@123`

| Creator | Email | Specialty |
|---------|-------|-----------|
| Aryan Kapoor | aryan@cinegen.demo | AI Filmmaker |
| Priya Nair | priya@cinegen.demo | Animator |
| Rahul Sharma | rahul@cinegen.demo | 3D Visualizer |
| Zara Ahmed | zara@cinegen.demo | Fashion Filmmaker |
| Marcus Chen | marcus@cinegen.demo | VFX Director |
| Anjali Desai | anjali@cinegen.demo | Audio Director |
| Vikram Rajan | vikram@cinegen.demo | Product Commercial |
| Lena Volkov | lena@cinegen.demo | Music Video |
| Dev Patel | dev@cinegen.demo | Motion Designer |
| Yuna Kim | yuna@cinegen.demo | K-Style Content |
| Rohan Mathur | rohan@cinegen.demo | Documentary |
| Aisha Okafor | aisha@cinegen.demo | Brand Storyteller |
| Sameer Joshi | sameer@cinegen.demo | Social Media |
| Carlos Rivera | carlos@cinegen.demo | Sports Content |
| Meera Iyer | meera@cinegen.demo | Art-House |
| Tanvir Sheikh | tanvir@cinegen.demo | Architecture Viz |
| Natasha Pinto | natasha@cinegen.demo | Fashion Editorial |
| Ishaan Verma | ishaan@cinegen.demo | Gaming Content |

> 💡 **Tip:** The **Demo** switcher in the navbar lets you flip between Brand ↔ Creator instantly — no re-login needed.

---

## 3. Full Demo Guide

### 🏢 Brand Workflow

**Step 1 — Login**
- Go to `/login` → click **"Continue as Brand"** → lands on dashboard instantly

**Step 2 — Dashboard**
- Stats: Active Briefs, Proposals Received, Creators Hired, Total Budget
- Engagement stepper: Discovery → Brief → Proposals → Hired → **Delivered**
- Click **"✓ Mark Delivered"** on an Accepted engagement to complete the full lifecycle
- Primary action card: Post Brief / Estimate Budget

**Step 3 — Discover Creators**
- Click **Discover** in navbar
- Search: try "cinematic" or "Runway"
- Filter by: AI tools, specialization, availability, rate range, verified only
- Sort by: Top Rated, Rate Low→High, Most Projects
- Click **"⚖️ Compare Creators"** for side-by-side analysis

**Step 4 — Creator Profile**
- Click any creator card
- **Style DNA** — hexagonal radar chart: Cinematic / Bold / Minimal / Experimental / Commercial / Artistic
- **Portfolio** — click any item → full modal with step-by-step production workflow
- **Verification Evidence** — audited proof bullets per verified badge
- **AI Tools & Proficiency** — Expert / Advanced / Intermediate per tool
- Click **"Invite to Brief"** to express interest

**Step 5 — AI Brief Builder**
- Go to **Briefs → Create Brief**
- Select **"AI Brief Builder"** tab
- Type a rough idea: *"A cinematic 30-second ad for a luxury skincare brand"*
- Click **"Generate Brief with Gemini AI"**
- Watch fields fill progressively with animation
- **Brief Intelligence panel** (right sidebar) gives live audit:
  - Score out of 100
  - 🔴 Errors: missing required fields
  - 🟡 Warnings: recommended additions
  - 🔵 Tips: improvement suggestions
- Click **"Publish Brief"**

**Step 6 — Match Results**
- See Top 5 Creator Matches with:
  - SVG circular score rings (color-coded)
  - Explainable reason tags: "Tool overlap ✓", "Specialization match ✓", "Budget fit ✓"

**Step 7 — Tools Menu (navbar → Tools ▾)**

| Tool | Path | What it does |
|------|------|-------------|
| Budget Estimator | `/estimator` | Content type + platform + quality = instant cost estimate + savings vs agency |
| Risk Scanner | `/risk-scanner` | Flags IP risks, license gaps, model indemnity, synthetic voice disclosure |
| Compare Creators | `/compare` | Side-by-side table for up to 3 creators + AI recommendation |
| Leaderboard | `/leaderboard` | Creator rankings with podium, multiple metrics, time filters |

---

### 🎬 Creator Workflow

**Step 1 — Login**
- Go to `/login` → click **"Continue as Creator"**

**Step 2 — Dashboard**
- Stats: Proposals Sent, Accepted, Open Briefs, Response Rate
- **"🔔 New Briefs Matching Your Profile"** — live pulsing badge
- Proposal tracker: Pending → Shortlisted → Accepted → Rejected
- Open briefs feed with budget ranges

**Step 3 — Browse & Apply**
- Click **Briefs** → see open brand campaigns
- Click **"Apply"** → fill message, price, timeline → submit

---

### 🆕 New User Registration

- Go to `/register` → choose Brand or Creator → fill details → account created
- **Creator path** → redirects to `/onboarding`:
  - Step 1: Headline + Bio + Location
  - Step 2: AI Tools + Specializations + Skills
  - Step 3: Availability + Hourly Rate
  - Click **"Launch My Profile"** → dashboard

---

## 4. Features

### Core Features
| Feature | Description |
|---------|-------------|
| 18 Creator Profiles | Full profiles with bio, tools, specializations, stats, portfolios |
| AI Portfolios | Each item shows tools, prompts, step-by-step workflow |
| Creator Search | Full-text search by name, skill, tool, specialization, bio |
| 5 Filter Dimensions | Tools, specialization, availability, rate range, verified-only |
| 4 Sort Options | Relevance, top rated, rate asc/desc, most projects |
| Brand Dashboard | Stats, engagement stepper, recent briefs, primary action |
| Creator Dashboard | Proposals tracker, matching briefs alert, stats |
| Proposal System | Submit, track status, accept/reject, mark delivered |
| Auth & Onboarding | Demo login, register, 3-step creator onboarding |

### Unique Features
| Feature | Description |
|---------|-------------|
| 🧠 Brief Intelligence | Real-time audit: score/100, errors, warnings, fix tips |
| 🧬 Style DNA | SVG radar chart: 6 style axes per creator |
| 🎯 Match Score Rings | SVG circular rings with explainable reason tags |
| ✅ Verification Evidence | Audited proof bullets per verified badge |
| ⚖️ Creator Comparison | Side-by-side table + AI recommendation |
| 💰 Budget Estimator | AI cost vs traditional agency + savings % |
| 🛡️ Risk Scanner | IP/licensing/compliance audit with fix recommendations |
| 🏆 Leaderboard | Rankings with podium, multiple metrics, time filters |
| 🔔 Brief Matching Alert | Live pulsing badge for new matching briefs |
| ✓ Mark as Delivered | Complete full engagement lifecycle |

---

## 5. Tech Stack

### Framework & Language
| Tech | Version | Purpose |
|------|---------|---------|
| Next.js | 14.2.35 | App Router, SSR, API routes |
| React | 18.x | UI components, hooks |
| TypeScript | 5.x | Full type safety |

### Styling & Animation
| Tech | Purpose |
|------|---------|
| Tailwind CSS | Utility-first dark cinematic design system |
| Framer Motion | Animations, transitions, score rings, steppers |
| Lucide React | Icon library |
| Custom CSS | Glass morphism, grain overlay, gradient utilities |

### AI & Intelligence
| Tech | Purpose |
|------|---------|
| Google Gemini 2.0 Flash | Brief generation — server-side API route only |
| `lib/briefFallback.ts` | Rule-based brief generator (works without API key) |
| `lib/matchScore.ts` | Creator-to-brief compatibility scoring algorithm |
| `BriefIntelligence.tsx` | Real-time brief audit engine |
| `StyleDNA.tsx` | Style scoring + SVG radar chart renderer |

### Data & State
| Tech | Purpose |
|------|---------|
| localStorage | Session, briefs, proposals, registered users |
| Seed data | 18 creator profiles in `lib/seed/creators.ts` |
| Custom hooks | useSession, useCreators, useBriefs, useProposals |
| Sonner | Toast notifications |

### Auth & Deployment
| Tech | Purpose |
|------|---------|
| Cookie + localStorage | Role in cookie for middleware, session in localStorage |
| Next.js middleware | Protects brand-only routes, redirects unauthenticated users |
| Vercel | Auto-deploy on every GitHub push |
| GitHub | Source control |

---

## 6. Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser (Client)               │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Pages   │  │  Hooks   │  │  Components  │  │
│  │/creators │  │useSession│  │BriefIntel    │  │
│  │/briefs   │  │useCreators│ │StyleDNA      │  │
│  │/dashboard│  │useBriefs │  │Navbar        │  │
│  │/estimator│  │useProposals│ │CreatorCard  │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│                      ↓                           │
│              localStorage / cookies              │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│              Next.js Server (Vercel Edge)        │
│                                                  │
│  /api/brief/route.ts → Gemini 2.0 Flash API     │
│  middleware.ts → Route protection                │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│           Google Gemini 2.0 Flash API            │
│        (server-side only, key never exposed)     │
└─────────────────────────────────────────────────┘
```

---

## 7. Project Structure

```
cinegen/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── login/page.tsx              # Login + demo credentials
│   ├── register/page.tsx           # New user signup
│   ├── onboarding/page.tsx         # Creator profile setup
│   ├── creators/
│   │   ├── page.tsx                # Discovery + filters
│   │   └── [id]/page.tsx           # Full creator profile
│   ├── briefs/
│   │   ├── page.tsx                # Brief listing
│   │   └── new/page.tsx            # AI Brief Builder
│   ├── dashboard/page.tsx          # Brand + Creator dashboards
│   ├── compare/page.tsx            # Side-by-side comparison
│   ├── leaderboard/page.tsx        # Creator rankings
│   ├── estimator/page.tsx          # Budget calculator
│   ├── risk-scanner/page.tsx       # Commercial risk audit
│   └── api/brief/route.ts          # Gemini API server route
│
├── components/
│   ├── layout/Navbar.tsx           # Nav with Tools dropdown
│   ├── layout/Footer.tsx           # Footer with all links
│   ├── briefs/BriefIntelligence.tsx
│   └── creators/
│       ├── CreatorCard.tsx
│       ├── CreatorCardSkeleton.tsx
│       └── StyleDNA.tsx
│
├── hooks/
│   ├── useSession.ts               # Auth — login, logout, role switch
│   ├── useCreators.ts
│   ├── useBriefs.ts
│   └── useProposals.ts
│
├── lib/
│   ├── seed/creators.ts            # 18 detailed creator profiles
│   ├── matchScore.ts               # Scoring algorithm
│   ├── briefFallback.ts            # AI fallback generator
│   └── storage.ts                  # localStorage wrapper
│
├── types/index.ts                  # All TypeScript types
└── middleware.ts                   # Route protection
```

---

## 8. Run Locally

```bash
git clone https://github.com/deekshitha875/cinegen.git
cd cinegen
npm install
npm run dev
```

Open **http://localhost:3000**

### Enable Gemini AI (optional)
```bash
cp .env.example .env.local
# Add: GEMINI_API_KEY=your_key_here
```
Get a free key at [aistudio.google.com](https://aistudio.google.com)

> App works 100% without a Gemini key — Brief Builder uses smart rule-based fallback automatically.

---

## 9. Rubric Coverage

| Criterion | Weight | What We Built |
|-----------|--------|---------------|
| Creator Profiles & AI Portfolios | 30% | 18 profiles, full workflow portfolios, 3-tier verification with evidence, Style DNA, tool proficiency badges |
| Brief Definition | 20% | AI Brief Builder (Gemini) + 6-section manual form + Brief Intelligence audit panel + full commercial use fields |
| Discovery & Filtering | 25% | Full-text search + 5 filters + 4 sorts + Compare + Leaderboard |
| User Experience | 15% | Dark cinematic UI, Framer Motion animations, Tools dropdown, dashboard action cards, responsive |
| Presentation & Demo | 10% | Live demo + this README + full walkthrough |

### Bonus Features Built
| Bonus | Implementation |
|-------|---------------|
| Creator Verification Signals | Evidence panel with audited proof bullets per badge |
| AI-Assisted Brief Builder | Gemini 2.0 Flash + progressive field animation |
| Brief Compiler / Intelligence | Real-time score + errors + warnings + fix tips |
| Commercial Use Compatibility | Risk Scanner + commercial fields in every brief |
| Explainable Matching | SVG score rings + reason tags after publish |
| Style DNA | Radar chart per creator |
| Budget Estimator | AI cost vs agency + savings % |
| Creator Comparison | Side-by-side + AI recommendation |
| Leaderboard | Rankings with podium |

---

<div align="center">

**Built with ❤️ for the Kampus.VC Hackathon**

[🚀 Live Demo](https://cinegen-bytexl.vercel.app) · [💻 GitHub](https://github.com/deekshitha875/cinegen)

</div>
