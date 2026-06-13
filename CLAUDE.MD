# Oliver Health — Project Context for Claude Code

## What this is
A personal health reference and meal planning app built for one user (Oliver). It tracks a Zepbound (tirzepatide) protocol including food timing, drug management, supplements, weekly meal planning, and grocery list generation.

## Current state
A single self-contained `index.html` PWA hosted on GitHub Pages at `https://onabavian.github.io/oliver-health/`. It contains all recipe data, planner logic, and grocery calculation in one file with localStorage persistence.

## Migration goal
Move to a proper Next.js 14 app on Vercel with:
- Supabase (Postgres) for all data (recipes, planner, settings)
- NextAuth.js + GitHub OAuth for auth (single user — Oliver's GitHub account only)
- Anthropic API for AI recipe generation (server-side only)
- Private GitHub repo + Vercel deployment

## Active branch
`feat/nextjs-migration`

## Tech stack (already decided — do not change)
- **Framework:** Next.js 14 with App Router and TypeScript
- **Database:** Supabase (Postgres)
- **Auth:** NextAuth.js v5 with GitHub provider
- **AI:** Anthropic SDK (`@anthropic-ai/sdk`)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Package manager:** npm

## Project structure
```
oliver-health/
├── app/
│   ├── (auth)/login/page.tsx       # Login page
│   ├── (protected)/                # Auth-guarded routes
│   │   ├── layout.tsx              # Auth check + nav
│   │   ├── page.tsx                # Food tab (home)
│   │   ├── recipes/page.tsx
│   │   ├── plan/page.tsx
│   │   ├── shop/page.tsx
│   │   ├── health/page.tsx
│   │   └── guide/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── recipes/route.ts            # GET all, POST create
│       ├── recipes/[id]/route.ts       # GET, PUT, DELETE
│       ├── recipes/generate/route.ts   # AI generation
│       └── plan/route.ts               # GET/POST week plan
├── components/
│   ├── Navigation.tsx
│   ├── RecipeCard.tsx
│   ├── MealPlanner.tsx
│   └── GroceryList.tsx
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── auth.ts             # NextAuth config
│   └── anthropic.ts        # Anthropic client + prompts
├── types/index.ts
├── supabase/
│   ├── schema.sql          # Full DB schema
│   └── seed.ts             # Seed script for 18 existing recipes
├── CLAUDE.md               # This file
└── MIGRATION.md            # Phased migration plan
```

## Environment variables needed
```
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GITHUB_ID=
GITHUB_SECRET=
GITHUB_ALLOWED_ACCOUNT_ID=   # Oliver's GitHub numeric ID
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
```

## Auth — single user restriction
```typescript
// lib/auth.ts
callbacks: {
  signIn: ({ account }) => {
    return account?.providerAccountId === process.env.GITHUB_ALLOWED_ACCOUNT_ID
  }
}
```

## Key conventions
- All DB calls go through Supabase server client (never expose service role key to browser)
- Anthropic API is called ONLY from API routes, never client-side
- Use `haiku-4-5` model for recipe generation (cost-efficient, sufficient for structured JSON)
- Tailwind only for styling — no additional component libraries unless explicitly approved
- Mobile-first design — the app is primarily used on iPhone
- Every phase must be independently deployable before starting the next

## What the current app does (reference)
Six tabs: Food (timing guide), Recipes (18 recipes in 4 categories), Plan (weekly meal planner B/L/D), Shop (grocery list from plan + day status overrides), Health (drug + supplement protocol), Guide (eating out + Sunday prep).

The grocery list auto-generates from planned meals. Day status buttons (normal / lunch out / travel / date night) adjust what gets added to the shopping list.

See MIGRATION.md for the full phased plan.