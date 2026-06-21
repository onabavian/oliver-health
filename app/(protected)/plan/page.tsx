import { createServiceClient } from '@/lib/supabase'
import { getWeekStart } from '@/lib/week'
import PlanEditor from '@/components/PlanEditor'
import type { Ingredient, ProteinMethod, Sauce } from '@/types'

async function getData() {
  const sb = createServiceClient()
  const weekStart = getWeekStart()
  const [
    { data: batch },
    { data: days },
    { data: proteins },
    { data: methods },
    { data: carbs },
    { data: veggies },
    { data: sauces },
    { data: breakfastItems },
    { data: snackItems },
  ] = await Promise.all([
    sb.from('week_batch').select('*').eq('week_start', weekStart).maybeSingle(),
    sb.from('day_plan').select('*').eq('week_start', weekStart),
    sb.from('ingredients').select('*').eq('type', 'protein').order('sort_order'),
    sb.from('protein_methods').select('*, ingredient:ingredients(*)').order('created_at'),
    sb.from('ingredients').select('*').eq('type', 'carb').order('sort_order'),
    sb.from('ingredients').select('*').eq('type', 'veggie').order('sort_order'),
    sb.from('sauces').select('*').order('created_at'),
    sb.from('ingredients').select('*').eq('type', 'breakfast').order('sort_order'),
    sb.from('ingredients').select('*').eq('type', 'snack').order('sort_order'),
  ])
  return {
    batch: batch as Record<string, unknown> | null,
    days: (days ?? []) as Record<string, unknown>[],
    proteins: (proteins ?? []) as Ingredient[],
    methods: (methods ?? []) as (ProteinMethod & { ingredient: Ingredient })[],
    carbs: (carbs ?? []) as Ingredient[],
    veggies: (veggies ?? []) as Ingredient[],
    sauces: (sauces ?? []) as Sauce[],
    breakfastItems: (breakfastItems ?? []) as Ingredient[],
    snackItems: (snackItems ?? []) as Ingredient[],
    weekStart,
  }
}

export default async function PlanPage() {
  const data = await getData()
  return <PlanEditor {...data} />
}
