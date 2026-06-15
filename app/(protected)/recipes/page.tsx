import { createServiceClient } from '@/lib/supabase'
import RecipesBrowser from '@/components/RecipesBrowser'
import type { ProteinMethod, Sauce, Ingredient } from '@/types'

async function getData() {
  const sb = createServiceClient()
  const [{ data: methods }, { data: sauces }, { data: ingredients }] = await Promise.all([
    sb.from('protein_methods').select('*, ingredient:ingredients(*)').order('created_at'),
    sb.from('sauces').select('*').order('created_at'),
    sb.from('ingredients').select('*').order('sort_order'),
  ])
  return {
    methods: (methods ?? []) as (ProteinMethod & { ingredient: Ingredient })[],
    sauces: (sauces ?? []) as Sauce[],
    ingredients: (ingredients ?? []) as Ingredient[],
  }
}

export default async function RecipesPage() {
  const { methods, sauces, ingredients } = await getData()
  return <RecipesBrowser methods={methods} sauces={sauces} ingredients={ingredients} />
}
