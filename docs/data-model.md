# CineGen Data Model

## Overview

CineGen uses a flat, localStorage-first data model with no external database. All entities are TypeScript interfaces defined in `types/index.ts`. Seed data lives in `lib/seed/` and is merged at runtime with user-created data from localStorage.

---

## Core Entities

### CreatorProfile

The central entity representing an AI content creator.

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique creator ID (`creator-001`) |
| `name` | string | Full display name |
| `handle` | string | @username |
| `email` | string | Contact email |
| `avatarUrl` | string | Profile photo URL |
| `coverUrl` | string | Cover/banner image URL |
| `headline` | string | One-line value proposition |
| `bio` | string | Full bio (200-400 chars) |
| `location` | string | City, Country |
| `hourlyRateUsd` | number | Hourly rate in USD ($30–$150) |
| `availability` | `Available` \| `Limited` \| `Booked` | Current booking status |
| `specializations` | `ContentType[]` | Primary content types |
| `skills` | `string[]` | Human-readable skills |
| `verifiedTools` | `ToolProficiency[]` | AI tools with proficiency level |
| `languages` | `string[]` | Languages spoken |
| `stats` | `CreatorStats` | Platform performance metrics |
| `verification` | `VerificationState` | 3-signal trust indicators + badge |
| `portfolio` | `PortfolioItem[]` | 2–4 portfolio items |
| `joinedAt` | ISO date string | Platform join date |

### ToolProficiency

```typescript
{
  name: AiTool;         // "Midjourney" | "Runway" | "Kling" | etc.
  proficiency: "Expert" | "Advanced" | "Intermediate";
  verified: boolean;    // Has CineGen validated this claim?
}
```

Supported AI Tools: `Midjourney`, `Runway`, `Kling`, `Veo`, `Sora`, `Pika`, `Luma`, `Flux`, `ComfyUI`, `Stable Diffusion`, `ElevenLabs`, `Suno`, `HeyGen`, `Topaz`, `Higgsfield`, `DaVinci Resolve`, `Adobe Firefly`, `Udio`

### VerificationState

Three-signal trust system unique to AI-native creators:

```typescript
{
  toolsVerified: boolean;      // AI tool usage confirmed via API logs or portfolio
  workflowVerified: boolean;   // Full production pipeline reviewed
  pastWorkVerified: boolean;   // Client references confirmed
  badge: "Studio" | "Verified" | "Rising" | "Unverified";
}
```

Badge logic:
- **Studio** — all 3 signals verified, established track record
- **Verified** — ≥2 signals verified
- **Rising** — 0–1 signals, but growing portfolio
- **Unverified** — new creator, no verification yet

---

### PortfolioItem

Each creator has 2–4 portfolio items showcasing AI-generated work.

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique item ID |
| `creatorId` | string | FK → CreatorProfile |
| `title` | string | Work title |
| `description` | string | Project description |
| `mediaType` | `"video"` \| `"image"` \| `"animation"` \| `"series"` | Content format |
| `thumbnailUrl` | string | Preview image URL |
| `mediaUrl` | string | Full-resolution media URL |
| `aspectRatio` | `"16:9"` \| `"9:16"` \| `"1:1"` \| `"4:5"` \| `"2.39:1"` | Output format |
| `contentType` | ContentType | Category (Brand Film, Animation, etc.) |
| `styleTags` | `string[]` | Aesthetic tags (e.g. "cinematic", "neon") |
| `toolsUsed` | `AiTool[]` | Tools used in this work |
| `workflow` | `WorkflowStep[]` | Step-by-step production pipeline |
| `seedLogged` | boolean | Whether provenance is blockchain-logged |
| `commercialUse` | CommercialUse | Licensing details |
| `clientName?` | string | Optional — who commissioned this |
| `year` | number | Year of production |

### WorkflowStep

The key differentiator — shows judges exactly how AI content is produced:

```typescript
{
  step: number;     // 1-based order
  tool: string;     // Tool name (e.g. "Midjourney")
  prompt?: string;  // The actual prompt used (if applicable)
  note?: string;    // What was done in this step
}
```

Example workflow (Aryan Kapoor - Luminary Skincare):
1. **Midjourney** → `"luxury skincare product on marble surface, golden hour light, cinematic --ar 16:9 --v 6"` — 40 keyframes generated
2. **Runway** → Smooth camera push-in via Gen-3 Alpha
3. **Topaz** → Upscaled to 4K, noise reduction
4. **DaVinci Resolve** → Color grade + sound design + export

### CommercialUse

```typescript
{
  licenseTier: "Full Buyout" | "Commercial 1yr" | "Editorial Only" | "Royalty-Free" | "Limited";
  modelIndemnity: boolean;       // IP indemnity for AI-generated content
  trainingDataClean: boolean;    // Confirms no restricted training data used
}
```

---

### Brief

A brand's creative request posted to the platform.

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique brief ID |
| `brandId` | string | FK → brand user |
| `brandName` | string | Display name of posting brand |
| `campaignTitle` | string | Campaign name |
| `objective` | string | What the content should achieve |
| `contentType` | ContentType | Type of content needed |
| `style` | string | Visual style description |
| `aspectRatios` | `AspectRatio[]` | Required output formats |
| `durationSeconds?` | number | For video content |
| `resolution?` | string | `"1080p"` \| `"4K"` \| `"8K"` |
| `quantity` | number | Number of deliverables |
| `toolsPreferred` | `AiTool[]` | Preferred AI tools |
| `referenceLinks` | `string[]` | Reference content URLs |
| `budgetMin` | number | USD minimum |
| `budgetMax` | number | USD maximum |
| `deadline` | ISO date string | Submission deadline |
| `commercialUse` | BriefCommercialUse | Licensing requirements |
| `negativeKeywords` | `string[]` | What to avoid |
| `status` | `"Draft"` \| `"Open"` \| `"In Review"` \| `"Hired"` \| `"Delivered"` | Lifecycle stage |
| `generatedByAI` | boolean | Was this brief AI-generated? |
| `rawIdea?` | string | Original plain-language idea |

### BriefCommercialUse

```typescript
{
  licenseTier: LicenseTier;
  modelIndemnityRequired: boolean;
  workflowHandoffRequired: boolean;
  usageRegions: string[];          // ["India", "UAE", "Global"]
  usageDurationMonths: number;
  exclusivity: boolean;
}
```

---

### Proposal

A creator's bid on an open brief.

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique proposal ID |
| `briefId` | string | FK → Brief |
| `creatorId` | string | FK → CreatorProfile |
| `message` | string | Pitch message from creator |
| `price` | number | Proposed price in USD |
| `timelineDays` | number | Proposed delivery timeline |
| `status` | `"Pending"` \| `"Shortlisted"` \| `"Accepted"` \| `"Rejected"` | Review status |
| `createdAt` | ISO date string | Submission time |

---

## ER Diagram

```mermaid
erDiagram
    CREATOR_PROFILE {
        string id PK
        string name
        string handle
        string headline
        string location
        int hourlyRateUsd
        string availability
        string joinedAt
    }

    TOOL_PROFICIENCY {
        string name FK
        string proficiency
        boolean verified
    }

    VERIFICATION_STATE {
        string creatorId PK_FK
        boolean toolsVerified
        boolean workflowVerified
        boolean pastWorkVerified
        string badge
    }

    PORTFOLIO_ITEM {
        string id PK
        string creatorId FK
        string title
        string mediaType
        string aspectRatio
        string contentType
        boolean seedLogged
        int year
    }

    WORKFLOW_STEP {
        int step
        string portfolioItemId FK
        string tool
        string prompt
        string note
    }

    COMMERCIAL_USE {
        string portfolioItemId PK_FK
        string licenseTier
        boolean modelIndemnity
        boolean trainingDataClean
    }

    BRIEF {
        string id PK
        string brandId
        string campaignTitle
        string contentType
        int budgetMin
        int budgetMax
        string deadline
        string status
        boolean generatedByAI
    }

    BRIEF_COMMERCIAL_USE {
        string briefId PK_FK
        string licenseTier
        boolean modelIndemnityRequired
        boolean exclusivity
        int usageDurationMonths
    }

    PROPOSAL {
        string id PK
        string briefId FK
        string creatorId FK
        int price
        int timelineDays
        string status
        string createdAt
    }

    CREATOR_PROFILE ||--|| VERIFICATION_STATE : "has"
    CREATOR_PROFILE ||--o{ TOOL_PROFICIENCY : "uses"
    CREATOR_PROFILE ||--o{ PORTFOLIO_ITEM : "owns"
    PORTFOLIO_ITEM ||--o{ WORKFLOW_STEP : "contains"
    PORTFOLIO_ITEM ||--|| COMMERCIAL_USE : "has"
    BRIEF ||--|| BRIEF_COMMERCIAL_USE : "requires"
    BRIEF ||--o{ PROPOSAL : "receives"
    CREATOR_PROFILE ||--o{ PROPOSAL : "submits"
```

---

## Match Scoring Algorithm

When a brief is published, CineGen scores every creator against it:

| Signal | Weight | How scored |
|---|---|---|
| Tool overlap | 35% | % of brief's preferred tools the creator uses |
| Specialization match | 25% | Exact match = full, adjacent type = half |
| Aspect ratio experience | 10% | Has portfolio item in required format |
| License tier match | 10% | Creator has offered this license tier before |
| Rating bonus | 10% | `(avgRating / 5) × 10` |
| Availability | 5% | Available = 5, Limited = 2, Booked = 0 |
| Verification badge | 5% | Studio = 5, Verified = 3, others = 0 |
| Budget fit | 5% | Creator daily rate within brief budget range |

Result: `MatchResult { creator, score: 0–100, reasons: string[] }` — the `reasons` array provides a human-readable explanation shown in the "Top Matches" UI.

---

## LocalStorage Keys

```
cinegen_session      → Session JSON (role, userId, name)
cinegen_briefs       → Brief[] (user-created only; seed briefs in /lib/seed/)
cinegen_proposals    → Proposal[] (user-created + seed overrides)
cinegen_theme        → "dark" | "light"
```

Seed data is always merged at read time and is never written to localStorage. This means the demo always has content even on a fresh browser.
