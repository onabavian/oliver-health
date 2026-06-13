export type Category = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type Badge = 'batch' | 'fresh cook'
export type DayName = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
export type MealType = 'breakfast' | 'lunch' | 'dinner'
export type DayStatusValue = 'normal' | 'lunchOut' | 'travel' | 'dateNight'
export type RecipeSource = 'manual' | 'ai_generated'

export interface Ingredient {
  id?: string
  recipeId?: string
  groceryKey: string | null
  quantity: number | null
  isPantry: boolean
  displayLabel: string
  sortOrder: number
}

export interface Step {
  id?: string
  recipeId?: string
  stepOrder: number
  instruction: string
}

export interface Recipe {
  id: string
  name: string
  category: Category
  timeMinutes: number
  proteinG: number
  description: string
  badge: Badge | null
  sauce: string | null
  source: RecipeSource
  ingredients: Ingredient[]
  steps: Step[]
}

export interface DayMeals {
  breakfast: Recipe | null
  lunch: Recipe | null
  dinner: Recipe | null
}

export type WeekPlan = Record<DayName, DayMeals>
export type DayStatuses = Record<DayName, DayStatusValue>
