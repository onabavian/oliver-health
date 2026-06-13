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
