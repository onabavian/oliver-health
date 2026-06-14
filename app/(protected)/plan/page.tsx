'use client'

import { useState } from 'react'
import { RECIPES } from '@/lib/recipes-data'
import type { Recipe, DayName, MealType, WeekPlan } from '@/types'

const DAYS: DayName[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TRAIN_DAYS = new Set<DayName>(['Mon', 'Tue', 'Thu', 'Fri'])
const MEALS: MealType[] = ['breakfast', 'lunch', 'dinner']

function emptyPlan(): WeekPlan {
  return Object.fromEntries(
    DAYS.map(d => [d, { breakfast: null, lunch: null, dinner: null }])
  ) as WeekPlan
}

export default function PlanPage() {
  const [plan, setPlan] = useState<WeekPlan>(emptyPlan)
  const [activeDay, setActiveDay] = useState<DayName>('Mon')
  const [picker, setPicker] = useState<MealType | null>(null)

  const dayPlan = plan[activeDay]

  const totalMeals = DAYS.flatMap(d => MEALS.map(m => plan[d][m])).filter(Boolean).length
  const totalProtein = DAYS.flatMap(d => MEALS.map(m => plan[d][m]))
    .reduce((sum, r) => sum + (r?.proteinG ?? 0), 0)

  function assignMeal(meal: MealType, recipe: Recipe) {
    setPlan(p => ({ ...p, [activeDay]: { ...p[activeDay], [meal]: recipe } }))
    setPicker(null)
  }

  function clearMeal(meal: MealType) {
    setPlan(p => ({ ...p, [activeDay]: { ...p[activeDay], [meal]: null } }))
  }

  return (
    <>
      <h1 className="text-lg font-bold text-gray-900 mb-4">Meal planner</h1>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm">
          <p className="text-xl font-bold text-gray-900">{totalMeals}</p>
          <p className="text-xs text-gray-500">meals planned</p>
        </div>
        <div className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm">
          <p className="text-xl font-bold text-blue-600">{totalProtein}g</p>
          <p className="text-xs text-gray-500">total protein</p>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-shrink-0 flex flex-col items-center w-11 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeDay === day ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            <span>{day}</span>
            <span className={`text-xs mt-0.5 ${activeDay === day ? 'opacity-60' : 'text-gray-400'}`}>
              {TRAIN_DAYS.has(day) ? 'T' : 'R'}
            </span>
          </button>
        ))}
      </div>

      {MEALS.map(meal => (
        <div key={meal} className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 capitalize">{meal}</p>
          {dayPlan[meal] ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{dayPlan[meal]!.name}</p>
                <p className="text-sm text-gray-500">{dayPlan[meal]!.proteinG}g protein</p>
              </div>
              <button
                onClick={() => clearMeal(meal)}
                className="text-xs text-red-500 font-medium px-2 py-1"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              onClick={() => setPicker(meal)}
              className="w-full text-sm text-emerald-600 font-medium py-2 border border-dashed border-emerald-300 rounded-xl"
            >
              + Add {meal}
            </button>
          )}
        </div>
      ))}

      {picker !== null && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setPicker(null)}
        >
          <div
            className="bg-white rounded-t-2xl w-full max-h-[70vh] overflow-y-auto p-4"
            onClick={e => e.stopPropagation()}
          >
            <p className="font-semibold text-gray-900 mb-3 capitalize">Pick {picker}</p>
            {RECIPES.map(recipe => (
              <button
                key={recipe.id}
                className="w-full text-left flex items-center justify-between p-3 mb-1.5 bg-gray-50 rounded-xl"
                onClick={() => assignMeal(picker, recipe)}
              >
                <span className="font-medium text-gray-800 text-sm">{recipe.name}</span>
                <span className="text-sm text-gray-500 flex-shrink-0 ml-2">{recipe.proteinG}g</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
