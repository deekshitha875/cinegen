# CineGen — AI Content Creator Marketplace

> Built for the **Kampus.VC AI Content Creator Marketplace** hackathon challenge.

**Live URL:** `https://cinegen-marketplace.vercel.app` _(deploy and paste URL here)_

---

## Judge Access (Zero Friction)

| Role    | Email                    | Password   | What you can do                            |
|---------|--------------------------|------------|--------------------------------------------|
| Brand   | brand@cinegen.demo       | Demo@123   | Post briefs, view proposals, manage campaigns |
| Creator | creator@cinegen.demo     | Demo@123   | Browse briefs, submit proposals            |

### 1-click login at `/login`
- **"Continue as Brand"** — instant Brand access
- **"Continue as Creator"** — instant Creator access
- **"Explore as Guest"** — browse creators without login

### Navbar Role Switcher
The **Demo** badge in the navbar lets you flip between Brand and Creator modes instantly — no re-login required.

---

## Run Locally

```bash
git clone <your-repo>
cd cinegen
npm install
npm run dev
```

Visit `http://localhost:3000`

### With Gemini AI (optional)
```bash
cp .env.example .env.local
# Add your GEMINI_API_KEY
```
The app works fully without a Gemini key — the AI Brief Builder uses smart rule-based fallback.

---

## Features → Evaluation Rubric Mapping

| Criterion (weight) | Feature | Where to find |
|---|---|---|
| **Creator Profiles & AI Portfolios (30%)** | 18 creators, rich bios, 2-4 portfolio items each with full AI workflow timelines, tool proficiency badges, verification signals | `/creators` → any creator card |
| **Brief Definition (20%)** | AI Brief Builder (Gemini-powered) + manual form with 6 sections, completeness bar, live preview | `/briefs/new` |
| **Discovery & Filtering (25%)** | Search + 5 filter types (tools, specialization, availability, rate, verified-only), URL-synced, smart empty state | `/creators` |
| **User Experience (15%)** | Dark cinematic UI, framer-motion animations, role-aware navbar, instant role switching, toasts, responsive | All pages |
| **Presentation & Demo (10%)** | This README + `/docs/data-model.md` | Below |

### Bonus Features
- **Creator Verification Signals** — 3-tier verification panel (Tools / Workflow / Past Work) on every creator profile
- **AI-Assisted Brief Builder** — Gemini 2.0 Flash generates full structured briefs from a sentence; graceful fallback always works
- **Top Matches after publish** — after publishing a brief, see top 5 creator matches with % score and reasons
- **Engagement Stepper** — visual Discovery → Brief → Proposals → Hired → Delivered tracker

---

## Environment Variables

```env
GEMINI_API_KEY=        # Optional. AI brief generation. Falls back to rule-based if missing.
```

---

## Tech Stack

- **Next.js 14** App Router + TypeScript
- **Tailwind CSS** with custom dark cinematic theme (violet/cyan gradients, glass cards, grain overlay)
- **framer-motion** for animations and page transitions
- **sonner** for toasts
- **localStorage** for session and user-created data persistence
- **Gemini 2.0 Flash** via server-side API route (never exposes key to client)
- **No database** — seed data + localStorage, self-contained demo

---

## Project Structure

```
cinegen/
├── app/
│   ├── page.tsx              Landing page
│   ├── login/page.tsx        Login + 1-click demo access
│   ├── creators/
│   │   ├── page.tsx          Discovery with filters
│   │   └── [id]/page.tsx     Creator profile + portfolio modal
│   ├── briefs/
│   │   ├── page.tsx          Role-aware briefs listing
│   │   └── new/page.tsx      AI + manual brief builder
│   ├── dashboard/page.tsx    Role-specific dashboard
│   └── api/brief/route.ts   Gemini API + fallback
├── components/               All UI components
├── hooks/                    useSession, useCreators, useBriefs, useProposals
├── lib/
│   ├── seed/                 18 creators, 4 briefs, 4 proposals
│   ├── matchScore.ts         Creator-to-brief scoring algorithm
│   └── briefFallback.ts      Rule-based brief generator
├── types/index.ts            All TypeScript types
└── docs/data-model.md        Data model documentation
```
