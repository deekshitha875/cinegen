<div align="center">

# 🎬 CineGen
### AI-Native Creative Marketplace

**Discover talent. Define campaigns. Create with confidence.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-cinegen--bytexl.vercel.app-6d28d9?style=for-the-badge)](https://cinegen-bytexl.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.0_Flash-4285F4?style=for-the-badge&logo=google)](https://aistudio.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)

---

> Built for the **Kampus.VC AI Content Creator Marketplace Hackathon**

</div>

---

## 🎯 The Problem

Brands spend weeks finding the right creative talent. With AI filmmakers, animators and generative artists — that search is even harder. There are no standard portfolios, no way to evaluate AI-specific skills, and no structured way to brief them.

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
| **"Continue as Brand"** | Full brand dashboard, post briefs, view proposals |
| **"Continue as Creator"** | Creator dashboard, browse briefs, submit proposals |
| **"Explore as Guest"** | Browse all 18 creators without logging in |

### Manual Credentials

| Role | Email | Password |
|------|-------|----------|
| 🏢 Brand (Arjun Mehta) | `brand@cinegen.demo` | `Demo@123` |
| 🎬 Creator (Aryan Kapoor) | `creator@cinegen.demo` | `Demo@123` |

### All 18 Creator Accounts
> All use password: `Demo@123`

| Name | Email |
|------|-------|
| Aryan Kapoor | aryan@cinegen.demo |
| Priya Nair | priya@cinegen.demo |
| Rahul Sharma | rahul@cinegen.demo |
| Zara Ahmed | zara@cinegen.demo |
| Marcus Chen | marcus@cinegen.demo |
| Anjali Desai | anjali@cinegen.demo |
| Vikram Rajan | vikram@cinegen.demo |
| Lena Volkov | lena@cinegen.demo |
| Dev Patel | dev@cinegen.demo |
| Yuna Kim | yuna@cinegen.demo |
| Rohan Mathur | rohan@cinegen.demo |
| Aisha Okafor | aisha@cinegen.demo |
| Sameer Joshi | sameer@cinegen.demo |
| Carlos Rivera | carlos@cinegen.demo |
| Meera Iyer | meera@cinegen.demo |
| Tanvir Sheikh | tanvir@cinegen.demo |
| Natasha Pinto | natasha@cinegen.demo |
| Ishaan Verma | ishaan@cinegen.demo |

> 💡 **Navbar tip:** The **Demo** switcher in the top bar lets you flip between Brand ↔ Creator instantly — no re-login needed.

---

## 🗺️ Evaluation Walkthrough

### As a Brand — follow this flow:

```
/login → Continue as Brand
    ↓
/creators → Search & filter creators
    ↓
/creators/[id] → View full profile, portfolio, tools, verification
    ↓
/briefs/new → AI Brief Builder → type any campaign idea → Gemini generates full brief
    ↓
Publish → See top 5 creator matches with % scores + reasons
    ↓
/dashboard → View briefs, proposals received, active engagements
```

### As a Creator — follow this flow:

```
/login → Continue as Creator
    ↓
/dashboard → See proposals sent, open briefs, stats
    ↓
/briefs → Browse all open brand campaigns
    ↓
Submit a proposal on any brief
    ↓
Track status: Pending → Shortlisted → Accepted
```

### New User Registration:
```
/register → Choose Brand or Creator → Fill details
    ↓ (Creator)
/onboarding → Add tools, specializations, rate, availability
    ↓
/dashboard → Your personalized dashboard
```

---

## ✨ Features

### 🔍 Creator Discovery & Profiles
- **18 fully fleshed creator profiles** — headline, bio, location, specializations, verified AI tools
- **AI-specific portfolios** — each portfolio item shows the full production workflow: tools used, prompts, step-by-step process — not just the final output
- **3-tier verification badges** — Studio / Verified / Rising — based on tools verified, workflow verified, past work confirmed
- **Rich search** — search by name, skill, tool, specialization, bio
- **5 filter dimensions** — AI tools, specialization, availability status, hourly rate range, verified-only toggle
- **Smart sort** — by relevance, top rated, rate (low→high / high→low), most projects

### 🤖 AI Brief Builder (Gemini-Powered)
- Type a rough campaign idea in plain English
- **Gemini 2.0 Flash** generates a complete structured brief with: campaign title, objective, content type, visual style, aspect ratios, duration, preferred AI tools, budget range, deadline, license tier, usage regions
- Fields fill progressively with a streaming animation effect
- **Brief Completeness Bar** — real-time % score as you fill the form
- **Graceful fallback** — smart rule-based generator works even without a Gemini API key

### 🎯 Creative Fit Engine (Match Scoring)
- After publishing a brief, instantly see **top 5 creator matches**
- Each match shows a **% compatibility score** with explainable reasons:
  - Tool overlap
  - Specialization match
  - Availability
  - Rate compatibility
  - Portfolio evidence
- Transparent, not a black box

### 📋 Brief Management
- Full manual brief builder with 6 sections: Campaign Details, Content Specs, AI Tools, Budget & Timeline, Commercial Use, Negative Keywords
- Commercial use fields: License tier, model indemnity, workflow handoff, exclusivity, usage regions, duration
- Save as Draft or Publish live
- Role-aware briefs page — brands see their own briefs, creators see open briefs to apply to

### 📊 Dashboards
**Brand Dashboard:**
- Stats: Active briefs, proposals received, creators hired, total budget
- Active engagements with visual stepper (Discovery → Brief → Proposals → Hired → Delivered)
- Recent briefs with proposal counts
- Quick "Create New Brief" CTA

**Creator Dashboard:**
- Stats: Proposals sent, accepted, open briefs, response rate
- My proposals with status badges (Pending / Shortlisted / Accepted / Rejected)
- Matching open briefs with apply button

### 🔐 Auth & Onboarding
- Login with demo credentials or 1-click role buttons
- **Register page** — new brand or creator can sign up
- **Creator onboarding flow** — 3-step profile setup: headline & bio → tools & specializations → rate & availability
- Registered users stored in localStorage, can log back in
- Session persists across tabs via cookie + localStorage sync

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS — dark cinematic theme (violet/cyan, glass cards) |
| Animations | Framer Motion |
| AI | Gemini 2.0 Flash (server-side API route) |
| Toasts | Sonner |
| Data | Seed data + localStorage (no database needed) |
| Deployment | Vercel (auto-deploy on push) |

---

## 📁 Project Structure

```
cinegen/
├── app/
│   ├── page.tsx                  # Landing page with hero, stats, creator cards, CTA
│   ├── login/page.tsx            # Login + 1-click demo + all 18 credentials
│   ├── register/page.tsx         # New user signup (brand or creator)
│   ├── onboarding/page.tsx       # 3-step creator profile setup
│   ├── creators/
│   │   ├── page.tsx              # Discovery page with search + filters
│   │   └── [id]/page.tsx         # Full creator profile + portfolio
│   ├── briefs/
│   │   ├── page.tsx              # Role-aware brief listing
│   │   └── new/page.tsx          # AI brief builder + manual form
│   ├── dashboard/page.tsx        # Brand + Creator dashboards
│   └── api/brief/route.ts        # Gemini API server route + fallback
│
├── components/
│   ├── layout/Navbar.tsx         # Sticky nav, role switcher, mobile menu
│   ├── layout/Footer.tsx
│   └── creators/
│       ├── CreatorCard.tsx       # Creator card with tools, rating, availability
│       └── CreatorCardSkeleton.tsx
│
├── hooks/
│   ├── useSession.ts             # Auth state, login, logout, role switch
│   ├── useCreators.ts            # Creator data
│   ├── useBriefs.ts              # Brief CRUD
│   └── useProposals.ts           # Proposal management
│
├── lib/
│   ├── seed/creators.ts          # 18 detailed creator profiles
│   ├── matchScore.ts             # Creator ↔ Brief scoring algorithm
│   ├── briefFallback.ts          # Rule-based brief generator (no API needed)
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
| Creator Profiles & AI Portfolios | 30% | 18 creators, full AI workflow portfolios, 3-tier verification, tool proficiency badges |
| Brief Definition | 20% | AI Brief Builder (Gemini) + 6-section manual form + completeness score + commercial use fields |
| Discovery & Filtering | 25% | Full-text search + 5 filter types + 4 sort options + smart empty state |
| User Experience | 15% | Dark cinematic UI, framer-motion animations, role-aware nav, responsive, instant role switch |
| Presentation & Demo | 10% | This README + live demo + full evaluation walkthrough |

---

<div align="center">

**Built with ❤️ for the Kampus.VC Hackathon**

[🚀 Live Demo](https://cinegen-bytexl.vercel.app) · [💻 GitHub](https://github.com/deekshitha875/cinegen)

</div>
