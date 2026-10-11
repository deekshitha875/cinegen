<div align="center">

# 🎬 CineGen
### AI-Native Creative Marketplace

**Discover talent. Define campaigns. Create with confidence.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-cinegen--bytexl.vercel.app-6d28d9?style=for-the-badge)](https://cinegen-bytexl.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.0_Flash-4285F4?style=for-the-badge&logo=google)](https://aistudio.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

---

> Built for the **Kampus.VC AI Content Creator Marketplace Hackathon**

</div>

---

## 🎯 The Problem

Brands spend weeks finding the right creative talent. With AI filmmakers, animators and generative artists — that search is even harder. No standard portfolios, no way to evaluate AI-specific skills, no structured way to brief them.

**CineGen solves this end-to-end.**

---

## ⚡ Judge Access — Zero Friction

> No sign-up. No OTP. No email verification. **Instant access.**

### 🔗 Live URL
```
https://cinegen-bytexl.vercel.app
```

### 1-Click Login (Recommended)
Go to **[/login](https://cinegen-bytexl.vercel.app/login)** → click the role button:

| Button | What you get |
|--------|-------------|
| **"Continue as Brand"** | Full brand dashboard, post briefs, AI brief builder, view proposals |
| **"Continue as Creator"** | Creator dashboard, browse briefs, submit proposals |
| **"Explore as Guest"** | Browse all 18 creators without logging in |

### Manual Credentials

| Role | Email | Password |
|------|-------|----------|
| 🏢 Brand (Arjun Mehta) | `brand@cinegen.demo` | `Demo@123` |
| 🎬 Creator (Aryan Kapoor) | `creator@cinegen.demo` | `Demo@123` |

### All 18 Creator Accounts
> All use password: `Demo@123`

| Name | Email | Specialization |
|------|-------|---------------|
| Aryan Kapoor | aryan@cinegen.demo | AI Filmmaker |
| Priya Nair | priya@cinegen.demo | Animator |
| Rahul Sharma | rahul@cinegen.demo | 3D Visualizer |
| Zara Ahmed | zara@cinegen.demo | Fashion Filmmaker |
| Marcus Chen | marcus@cinegen.demo | VFX Director |
| Anjali Desai | anjali@cinegen.demo | Audio Director |
| Vikram Rajan | vikram@cinegen.demo | Product Commercial |
| Lena Volkov | lena@cinegen.demo | Music Video Director |
| Dev Patel | dev@cinegen.demo | Motion Designer |
| Yuna Kim | yuna@cinegen.demo | K-Style Creator |
| Rohan Mathur | rohan@cinegen.demo | Documentary |
| Aisha Okafor | aisha@cinegen.demo | Brand Storyteller |
| Sameer Joshi | sameer@cinegen.demo | Social Media |
| Carlos Rivera | carlos@cinegen.demo | Sports Content |
| Meera Iyer | meera@cinegen.demo | Art-House |
| Tanvir Sheikh | tanvir@cinegen.demo | Architecture Viz |
| Natasha Pinto | natasha@cinegen.demo | Fashion Editorial |
| Ishaan Verma | ishaan@cinegen.demo | Gaming Content |

> 💡 **Navbar tip:** The **Demo** switcher in the top bar lets you flip between Brand ↔ Creator instantly — no re-login needed.

---

## 🗺️ Full Evaluation Walkthrough

### As a Brand — follow this flow:

```
/login → Continue as Brand
    ↓
/creators → Search & filter 18 AI creators by tool, rate, availability, specialization
    ↓
/creators/[id] → View full profile, Style DNA radar, portfolio, verification evidence
    ↓
/compare → Select 2-3 creators for side-by-side comparison + AI recommendation
    ↓
/briefs/new → AI Brief Builder → type any campaign idea → Gemini generates full brief
             → Brief Intelligence panel audits your brief in real-time (score + fixes)
    ↓
Publish → See top 5 creator matches with SVG score rings + explainable reason tags
    ↓
/dashboard → Primary action card + briefs + proposals + engagement stepper
    ↓
/estimator → Budget calculator: content type + platform + quality = instant cost estimate
    ↓
/risk-scanner → Commercial risk audit: IP flags, license conflicts, model indemnity checks
```

### As a Creator — follow this flow:

```
/login → Continue as Creator
    ↓
/dashboard → "New Briefs Matching Your Profile" alert + proposal tracker
    ↓
/briefs → Browse open brand campaigns with budget + deadline
    ↓
Submit a proposal → Track: Pending → Shortlisted → Accepted
    ↓
/leaderboard → See where you rank vs other creators
```

### New User Registration:
```
/register → Choose Brand or Creator
    ↓ (Creator path)
/onboarding → 3-step setup: Headline & Bio → Tools & Specializations → Rate & Availability
    ↓
/dashboard → Your personalized dashboard
```

---

## ✨ All Features

### 🔍 Creator Discovery
- **18 fully detailed creator profiles** with bio, location, tools, specializations
- **Transparent AI portfolios** — each item shows the full production workflow: tools, prompts, step-by-step process
- **3-tier verification badges** — Studio / Verified / Rising — with actual evidence bullets per verified item
- **Full-text search** — by name, skill, tool, specialization, bio
- **5 filter dimensions** — AI tools, specialization, availability, hourly rate range, verified-only
- **4 sort options** — relevance, top rated, rate (asc/desc), most projects

### 🧬 Style DNA (Unique)
- Hexagonal radar chart on every creator profile
- 6 axes: Cinematic, Bold, Minimal, Experimental, Commercial, Artistic
- Auto-calculated from tools, bio, specializations, and stats
- Bar breakdown showing top 3 dominant styles

### 🤖 AI Brief Builder
- Type a rough campaign idea → **Gemini 2.0 Flash** generates complete structured brief
- Fields fill progressively with streaming animation
- **Brief Completeness Bar** — real-time % score
- **Brief Intelligence Panel** — AI audits brief: score/100, errors, warnings, tips with fix suggestions
- Smart rule-based fallback works without Gemini key

### 🎯 Creative Fit Engine
- After publishing, see **top 5 creator matches**
- **SVG circular score rings** (color coded: violet=great, cyan=good, amber=fair)
- **Explainable reason tags** — tool overlap, specialization match, availability, rate fit
- No black box — every recommendation is explained

### ⚖️ Creator Comparison (Unique)
- Select up to 3 creators side-by-side
- Table: rate, rating, projects, repeat clients, response time, tools, availability
- Best value highlighted in violet
- **AI Recommendation** picks the winner with reasoning

### 💰 Budget Estimator (Unique)
- Pick content type, platform, quality level, region, quantity
- Instant estimate: min–max cost range
- Savings % vs traditional agency
- Typical delivery timeline + matching creator count
- Works without login

### 🛡️ Commercial Risk Scanner (Unique)
- Configure campaign: platforms, usage type, license, region, AI tools
- Flags: broadcast license gaps, model indemnity requirements, training data risks, synthetic voice disclosure, editorial-commercial conflicts
- Color-coded severity: High / Medium / Low
- Fix recommendations + specific clause references

### 🏆 Creator Leaderboard (Unique)
- Podium for top 3 with gold/silver/bronze styling
- Sortable by projects, rating, repeat client rate
- Weekly / Monthly / All Time filters

### 📊 Dashboards
**Brand:** Primary action card + stats + engagement stepper (Discovery→Brief→Proposals→Hired→Delivered) + recent briefs

**Creator:** Matching briefs alert with live pulse badge + proposal status tracker + open briefs feed

### 🔐 Auth & Onboarding
- 1-click demo login (no friction)
- Register page for new brands/creators
- 3-step creator onboarding flow
- Registered users stored in localStorage
- Session persists across tabs

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS — dark cinematic theme |
| Animations | Framer Motion |
| AI | Gemini 2.0 Flash (server-side) |
| Toasts | Sonner |
| Data | Seed data + localStorage |
| Deployment | Vercel (auto-deploy on push) |

---

## 📁 Project Structure

```
cinegen/
├── app/
│   ├── page.tsx                  # Landing page — hero, stats, features strip, creator cards
│   ├── login/page.tsx            # Login + 1-click demo + all 18 credentials
│   ├── register/page.tsx         # New user signup (brand or creator)
│   ├── onboarding/page.tsx       # 3-step creator profile setup
│   ├── creators/
│   │   ├── page.tsx              # Discovery — search, filters, sort
│   │   └── [id]/page.tsx         # Creator profile — Style DNA, portfolio, verification evidence
│   ├── briefs/
│   │   ├── page.tsx              # Role-aware brief listing
│   │   └── new/page.tsx          # AI brief builder + Brief Intelligence panel
│   ├── dashboard/page.tsx        # Brand + Creator dashboards
│   ├── compare/page.tsx          # Side-by-side creator comparison
│   ├── leaderboard/page.tsx      # Creator rankings with podium
│   ├── estimator/page.tsx        # Budget calculator
│   ├── risk-scanner/page.tsx     # Commercial risk audit tool
│   └── api/brief/route.ts        # Gemini API + rule-based fallback
│
├── components/
│   ├── layout/Navbar.tsx         # Nav with Tools dropdown
│   ├── layout/Footer.tsx         # Full footer with all page links
│   ├── briefs/BriefIntelligence.tsx  # Real-time brief audit panel
│   └── creators/
│       ├── CreatorCard.tsx
│       ├── CreatorCardSkeleton.tsx
│       └── StyleDNA.tsx          # Radar chart component
│
├── hooks/
│   ├── useSession.ts             # Auth — login, logout, role switch, registered users
│   ├── useCreators.ts
│   ├── useBriefs.ts
│   └── useProposals.ts
│
├── lib/
│   ├── seed/creators.ts          # 18 detailed creator profiles
│   ├── matchScore.ts             # Creator ↔ Brief scoring algorithm
│   ├── briefFallback.ts          # Rule-based brief generator
│   └── storage.ts                # localStorage wrapper
│
└── types/index.ts                # All TypeScript types
```

---

## 🚀 Run Locally

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

> The app works 100% without a Gemini key — the Brief Builder uses smart rule-based fallback automatically.

---

## 📊 Rubric Coverage

| Criterion | Weight | What we built |
|-----------|--------|---------------|
| Creator Profiles & AI Portfolios | 30% | 18 creators, full AI workflow portfolios, 3-tier verification with evidence, Style DNA radar, tool proficiency badges |
| Brief Definition | 20% | AI Brief Builder (Gemini) + 6-section manual form + Brief Intelligence audit panel + commercial use fields |
| Discovery & Filtering | 25% | Full-text search + 5 filter types + 4 sort options + Compare tool + Leaderboard |
| User Experience | 15% | Dark cinematic UI, framer-motion, Tools dropdown nav, dashboard action cards, responsive |
| Presentation & Demo | 10% | This README + live demo + full walkthrough above |

### Bonus Features Built
| Bonus | Where |
|-------|-------|
| Creator Verification Signals | Creator profile → Verification Evidence panel |
| AI-Assisted Brief Builder | `/briefs/new` → AI Brief Builder tab |
| Brief Compiler / Intelligence | `/briefs/new` → right sidebar panel |
| Commercial Use Compatibility | `/risk-scanner` + brief commercial use fields |
| Explainable Matching | Post-publish match results with score rings + reasons |
| Style DNA | Creator profile → Style DNA radar chart |
| Budget Estimator | `/estimator` |
| Creator Comparison | `/compare` |
| Creator Leaderboard | `/leaderboard` |

---

<div align="center">

**Built with ❤️ for the Kampus.VC Hackathon**

[🚀 Live Demo](https://cinegen-bytexl.vercel.app) · [💻 GitHub](https://github.com/deekshitha875/cinegen)

</div>
