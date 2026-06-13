# Migration Plan — Static HTML → Next.js

## Approach
- One branch: `feat/nextjs-migration`
- One phase at a time — each phase must be deployed and working before starting the next
- Never break existing functionality mid-phase
- The static `index.html` stays accessible during migration as a fallback

---

## Phase 1 — Next.js scaffold + Supabase schema
**Goal:** A working Next.js app deployed to Vercel that mirrors the current HTML app visually. No auth yet. Data is still static (hardcoded). Supabase schema is created but not yet used by the frontend.

### Steps
1. Initialize Next.js in the repo root:
   ```bash
   git checkout -b feat/nextjs-migration
   npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
   ```

2. Install dependencies:
   ```bash
   npm install @supabase/supabase-js next-auth@beta @anthropic-ai/sdk
   ```

3. Create `.env.local` (never commit this):
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ANTHROPIC_API_KEY=
   NEXTAUTH_SECRET=
   NEXTAUTH_URL=http://localhost:3000
   GITHUB_ID=
   GITHUB_SECRET=
   GITHUB_ALLOWED_ACCOUNT_ID=
   ```

4. Create Supabase project at supabase.com and apply this schema:

```sql
-- supabase/schema.sql
create extension if not exists "uuid-ossp";

create table recipes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null check (category in ('breakfast','lunch','dinner','snack')),
  time_minutes integer not null,
  protein_g integer not null,
  description text,
  badge text check (badge in ('batch','fresh cook')),
  sauce text,
  source text not null default 'manual' check (source in ('manual','ai_generated')),
  created_at timestamptz default now()
);

create table ingredients (
  id uuid primary key default uuid_generate_v4(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  grocery_key text,
  quantity decimal,
  is_pantry boolean not null default false,
  display_label text not null,
  sort_order integer not null default 0
);

create table steps (
  id uuid primary key default uuid_generate_v4(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  step_order integer not null,
  instruction text not null
);

create table week_plan (
  id uuid primary key default uuid_generate_v4(),
  week_start date not null,
  day_name text not null check (day_name in ('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
  meal text not null check (meal in ('breakfast','lunch','dinner')),
  recipe_id uuid references recipes(id) on delete set null,
  unique(week_start, day_name, meal)
);

create table day_status (
  id uuid primary key default uuid_generate_v4(),
  week_start date not null,
  day_name text not null check (day_name in ('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
  status text not null check (status in ('normal','lunchOut','travel','dateNight')) default 'normal',
  unique(week_start, day_name)
);

create table settings (
  id uuid primary key default uuid_generate_v4(),
  protein_target_g integer not null default 150,
  current_dose_mg decimal not null default 2.5,
  last_injection_date date,
  updated_at timestamptz default now()
);
```

5. Build the 6-tab layout in Next.js using Tailwind, replicating the current app visually. Keep recipe data hardcoded in `lib/recipes-data.ts` for now — do not fetch from Supabase yet.

6. Set up Supabase client in `lib/supabase.ts`.

7. Connect repo to Vercel. Deploy. Verify app works at Vercel URL.

### Done when
- [ ] `npm run dev` works locally
- [ ] App deployed to Vercel and all 6 tabs render correctly
- [ ] Supabase schema applied (tables exist, empty)
- [ ] `.env.local` has all keys (Supabase only needed at this phase)

---

## Phase 2 — Seed data + dynamic recipes
**Goal:** Recipes come from Supabase, not hardcoded TypeScript. The Recipe browser tab is fully dynamic.

### Steps
1. Write seed script at `supabase/seed.ts` that inserts all 18 existing recipes with their ingredients and steps. Run it once:
   ```bash
   npx ts-node supabase/seed.ts
   ```

2. Create API route `app/api/recipes/route.ts`:
   - `GET` — returns all recipes with nested ingredients and steps
   - `POST` — creates a new recipe (used by AI generation later)

3. Create API route `app/api/recipes/[id]/route.ts`:
   - `GET` — single recipe
   - `PUT` — update recipe
   - `DELETE` — delete recipe

4. Update the Recipes page to fetch from the API route instead of the hardcoded data file.

5. Update the Planner page to use recipe IDs that match Supabase UUIDs (not the old `b1`, `l2` string IDs).

### Done when
- [ ] All 18 recipes visible in the app, loaded from Supabase
- [ ] Adding/removing a recipe row in Supabase dashboard reflects in the app immediately
- [ ] Old `lib/recipes-data.ts` file deleted

---

## Phase 3 — Auth
**Goal:** Only Oliver's GitHub account can access the app. Everyone else hits a login page.

### Steps
1. Create a GitHub OAuth app at github.com/settings/developers:
   - Homepage URL: your Vercel URL
   - Callback URL: `https://YOUR_VERCEL_URL/api/auth/callback/github`
   - Copy Client ID and Secret to env vars

2. Get your GitHub numeric account ID:
   ```bash
   curl https://api.github.com/users/onabavian | grep '"id"'
   ```
   Add as `GITHUB_ALLOWED_ACCOUNT_ID` in env vars.

3. Create `lib/auth.ts`:
   ```typescript
   import NextAuth from "next-auth"
   import GitHub from "next-auth/providers/github"

   export const { handlers, signIn, signOut, auth } = NextAuth({
     providers: [GitHub],
     callbacks: {
       signIn: ({ account }) => {
         return account?.providerAccountId === process.env.GITHUB_ALLOWED_ACCOUNT_ID
       },
     },
   })
   ```

4. Create `app/api/auth/[...nextauth]/route.ts`:
   ```typescript
   import { handlers } from "@/lib/auth"
   export const { GET, POST } = handlers
   ```

5. Create `app/(auth)/login/page.tsx` — simple login page with "Sign in with GitHub" button.

6. Create `app/(protected)/layout.tsx` — checks session, redirects to `/login` if not authenticated.

7. Update Vercel env vars with `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GITHUB_ID`, `GITHUB_SECRET`, `GITHUB_ALLOWED_ACCOUNT_ID`. Redeploy.

### Done when
- [ ] Visiting the app without being logged in redirects to `/login`
- [ ] Signing in with the correct GitHub account grants access
- [ ] Signing in with any other GitHub account is rejected

---

## Phase 4 — Planner + grocery list persistence
**Goal:** Week plan and day status overrides are saved to Supabase instead of localStorage. Data persists across devices (phone + laptop see the same plan).

### Steps
1. Create API route `app/api/plan/route.ts`:
   - `GET` — returns week plan + day statuses for the current week
   - `POST` — upserts a meal assignment or day status

2. Create a helper `lib/week.ts` that calculates the current week's Monday date (used as `week_start` key).

3. Update the Plan page to:
   - Fetch current week plan from API on load
   - On recipe select/remove, POST to API (optimistic UI update)
   - Show a loading state while fetching

4. Update the Shop page to:
   - Fetch week plan and day statuses from API
   - Day status buttons POST to API
   - Grocery list re-calculates from server data

5. Remove all localStorage usage for plan/status data (grocery checklist can stay in localStorage — it's ephemeral and device-specific).

### Done when
- [ ] Set a meal on laptop, see it on iPhone
- [ ] Change day status on iPhone, grocery list updates on laptop
- [ ] localStorage no longer used for plan or day status

---

## Phase 5 — AI recipe generation
**Goal:** Oliver can describe a meal and Claude generates a Zepbound-friendly recipe that saves directly to Supabase.

### Steps
1. Create `lib/anthropic.ts` with the Anthropic client and the recipe generation system prompt:

```typescript
import Anthropic from "@anthropic-ai/sdk"

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const RECIPE_SYSTEM_PROMPT = `You generate recipes for someone on Zepbound (tirzepatide), a GLP-1/GIP weight loss medication.

Rules:
- High protein (25g+ per serving minimum)
- Low fat (avoid fried, greasy, heavy cream sauces)
- Not spicy (GI sensitivity)
- Simple to make (air fryer, cast iron skillet, or stovetop)
- Ingredients should align with: chicken, salmon, ground beef (90/10), eggs, Greek yogurt, cottage cheese, deli turkey, sweet potato, avocado, spinach, zucchini, carrots, lemon, rice, oats, rice cakes, chickpeas

Return ONLY valid JSON matching this exact structure, no markdown, no explanation:
{
  "name": string,
  "category": "breakfast" | "lunch" | "dinner" | "snack",
  "time_minutes": number,
  "protein_g": number,
  "description": string,
  "badge": "batch" | "fresh cook" | null,
  "sauce": string | null,
  "ingredients": [
    {
      "grocery_key": string | null,
      "quantity": number | null,
      "is_pantry": boolean,
      "display_label": string,
      "sort_order": number
    }
  ],
  "steps": [
    { "step_order": number, "instruction": string }
  ]
}`
```

2. Create API route `app/api/recipes/generate/route.ts`:
   ```typescript
   // POST { prompt: string }
   // Calls Anthropic with haiku-4-5, returns parsed recipe JSON
   // Does NOT save to DB — client reviews first, then calls POST /api/recipes
   ```

3. Add "Generate with AI" UI to the Recipes page:
   - Text input: "Describe the meal you want..."
   - Submit → loading state → preview card showing generated recipe
   - "Save recipe" button → POST to `/api/recipes` → recipe appears in list
   - "Regenerate" button if the result isn't right

4. Use `claude-haiku-4-5` model — sufficient for structured JSON, very cheap (~$0.004 per call).

### Done when
- [ ] Can type "high protein salmon dinner with sweet potato" and get a recipe back
- [ ] Generated recipe previews before saving
- [ ] Saved recipe appears in the Recipe browser tab
- [ ] AI-generated recipes have `source: 'ai_generated'` in the DB

---

## Phase 6 — Cleanup + go live
**Goal:** Switch from GitHub Pages to Vercel as the primary hosting.

### Steps
1. Verify all phases work end-to-end on Vercel URL.
2. In GitHub repo: Settings → Pages → disable GitHub Pages (or change source to "None").
3. Update Vercel project to use the main branch (merge `feat/nextjs-migration` → `main`).
4. Update `NEXTAUTH_URL` env var to the final Vercel URL.
5. Update `manifest.json` `start_url` to the Vercel URL.
6. Re-add the app to iPhone home screen from the new Vercel URL.
7. Archive or delete the old static `index.html` (or keep it at `/legacy/index.html` for reference).

### Done when
- [ ] App is live at Vercel URL
- [ ] GitHub Pages is disabled
- [ ] App is re-installed on iPhone from Vercel URL
- [ ] Old `index.html` removed from root

---

## Not in scope (future phases)
These are planned but not part of this migration:
- Injection countdown tracker
- Weekly check-in log (weight + GI score)
- Progress charts
- Push notifications
- Custom domain

---

## Notes for Claude Code
- Work one phase at a time. Do not start Phase 2 until Phase 1 is confirmed working.
- Ask before adding any dependency not listed in Phase 1's install step.
- Keep components simple — this is a personal app, not a production SaaS.
- When in doubt about UI, replicate what the current `index.html` does.
- The existing recipe data (18 recipes with full ingredients/steps) is in `index.html` inside the `const RECIPES = [...]` JavaScript array. Use that as the seed data source.