'use client'

import { useState } from 'react'
import { RECIPES, getRecipesByCategory } from '@/lib/recipes-data'
import type { Recipe, Category } from '@/types'

const CATEGORIES: { value: 'all' | Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
]

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-sm mb-3 overflow-hidden">
      <button className="w-full text-left p-4" onClick={() => setOpen(o => !o)}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{recipe.name}</p>
            <p className="text-sm text-gray-500 mt-0.5">
              {recipe.timeMinutes === 0 ? 'Prep night before' : `${recipe.timeMinutes} min`}
              {' · '}{recipe.proteinG}g protein
            </p>
            <p className="text-sm text-gray-500 mt-1">{recipe.description}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {recipe.badge && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                recipe.badge === 'batch' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {recipe.badge}
              </span>
            )}
            <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
          </div>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-2">Ingredients</p>
          <div className="space-y-1">
            {recipe.ingredients.map((ing, i) => (
              <p key={i} className="text-sm text-gray-700">• {ing.displayLabel}</p>
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-2">Steps</p>
          <div className="space-y-1.5">
            {recipe.steps.map(step => (
              <div key={step.stepOrder} className="flex gap-2.5">
                <span className="text-xs font-bold text-gray-400 pt-0.5 w-4 flex-shrink-0">{step.stepOrder}</span>
                <p className="text-sm text-gray-700">{step.instruction}</p>
              </div>
            ))}
          </div>
          {recipe.sauce && (
            <div className="mt-3 bg-amber-50 rounded-xl p-3">
              <p className="text-sm text-amber-800">🧄 {recipe.sauce}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function RecipesPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | Category>('all')
  const recipes = getRecipesByCategory(activeCategory)

  return (
    <>
      <h1 className="text-lg font-bold text-gray-900 mb-4">Recipes</h1>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === value
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </>
  )
}
