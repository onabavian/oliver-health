-- Drop old tables (no data to preserve)
drop table if exists steps cascade;
drop table if exists ingredients cascade;
drop table if exists recipes cascade;
drop table if exists week_plan cascade;
drop table if exists day_status cascade;

-- Core grocery atoms
create table ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('protein','carb','veggie','dairy','pantry')),
  default_qty_g integer,
  default_qty_imperial text,
  grocery_label text not null,
  notes text,
  sort_order integer not null default 0
);

-- Cooking methods per protein (AI can add new ones)
create table protein_methods (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid not null references ingredients(id) on delete cascade,
  name text not null,
  steps jsonb not null default '[]',
  source text not null default 'manual' check (source in ('manual','ai_generated')),
  created_at timestamptz default now()
);

-- Sauce recipes (AI can add new ones)
create table sauces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  components jsonb not null default '[]',
  instructions text,
  source text not null default 'manual' check (source in ('manual','ai_generated')),
  created_at timestamptz default now()
);

-- Weekly batch cooking plan
create table week_batch (
  id uuid primary key default gen_random_uuid(),
  week_start date not null unique,
  protein1_id uuid references ingredients(id),
  protein1_method_id uuid references protein_methods(id),
  protein2_id uuid references ingredients(id),
  protein2_method_id uuid references protein_methods(id),
  carb1_id uuid references ingredients(id),
  carb2_id uuid references ingredients(id),
  veggie1_id uuid references ingredients(id),
  veggie2_id uuid references ingredients(id),
  sauce1_id uuid references sauces(id),
  sauce2_id uuid references sauces(id)
);

-- Per-day meal assembly + flags
create table day_plan (
  id uuid primary key default gen_random_uuid(),
  week_start date not null,
  day_name text not null check (day_name in ('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
  is_workout_day boolean not null default false,
  needs_preworkout boolean not null default false,
  eating_out text not null default 'normal' check (eating_out in ('normal','work_lunch','fast_casual','date_restaurant')),
  breakfast_note text,
  lunch_protein_method_id uuid references protein_methods(id),
  lunch_carb_id uuid references ingredients(id),
  lunch_veggie_id uuid references ingredients(id),
  lunch_sauce_id uuid references sauces(id),
  dinner_protein_method_id uuid references protein_methods(id),
  dinner_carb_id uuid references ingredients(id),
  dinner_veggie_id uuid references ingredients(id),
  dinner_sauce_id uuid references sauces(id),
  snack_note text,
  unique(week_start, day_name)
);

-- Daily structured journal
create table journal (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  protein_hit_g integer,
  energy_level smallint check (energy_level between 1 and 5),
  gi_okay boolean,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- App settings
create table settings (
  id uuid primary key default gen_random_uuid(),
  protein_target_g integer not null default 150,
  current_dose_mg decimal not null default 2.5,
  last_injection_date date,
  updated_at timestamptz default now()
);
