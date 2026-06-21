import { createServiceClient } from '@/lib/supabase'
import RecipesBrowser from '@/components/RecipesBrowser'
import type { ProteinMethod, Sauce, Ingredient } from '@/types'
import { getWeekStart } from '@/lib/week'

async function getData() {
  const sb = createServiceClient()
  const [{ data: methods }, { data: sauces }, { data: ingredients }, { data: savedBatches }] = await Promise.all([
    sb.from('protein_methods').select('*, ingredient:ingredients(*)').order('created_at'),
    sb.from('sauces').select('*').order('created_at'),
    sb.from('ingredients').select('*').order('sort_order'),
    sb.from('week_batch')
      .select(`*, protein1:ingredients!protein1_id(name), protein2:ingredients!protein2_id(name), carb1:ingredients!carb1_id(name), carb2:ingredients!carb2_id(name), veggie1:ingredients!veggie1_id(name), veggie2:ingredients!veggie2_id(name), sauce1:sauces!sauce1_id(name), sauce2:sauces!sauce2_id(name)`)
      .not('name', 'is', null)
      .order('week_start', { ascending: false }),
  ])
  return {
    methods: (methods ?? []) as (ProteinMethod & { ingredient: Ingredient })[],
    sauces: (sauces ?? []) as Sauce[],
    ingredients: (ingredients ?? []) as Ingredient[],
    savedBatches: (savedBatches ?? []) as Record<string, unknown>[],
    currentWeekStart: getWeekStart(),
  }
}

export default async function RecipesPage() {
  const data = await getData()
  return <RecipesBrowser {...data} />
}
