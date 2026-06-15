export type IngredientType = 'protein' | 'carb' | 'veggie' | 'dairy' | 'pantry'
export type DayName = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
export type EatingOut = 'normal' | 'work_lunch' | 'fast_casual' | 'date_restaurant'
export type RecipeSource = 'manual' | 'ai_generated'
export type UnitSystem = 'imperial' | 'metric'

export interface Ingredient {
  id: string
  name: string
  type: IngredientType
  defaultQtyG: number | null
  defaultQtyImperial: string | null
  groceryLabel: string
  notes: string | null
  sortOrder: number
}

export interface ProteinMethod {
  id: string
  ingredientId: string
  name: string
  steps: { order: number; instruction: string }[]
  source: RecipeSource
  ingredient?: Ingredient
}

export interface SauceComponent {
  item: string
  qty: string
  unit: string
}

export interface Sauce {
  id: string
  name: string
  components: SauceComponent[]
  instructions: string | null
  source: RecipeSource
}

export interface WeekBatch {
  weekStart: string
  protein1Id: string | null
  protein1MethodId: string | null
  protein2Id: string | null
  protein2MethodId: string | null
  carb1Id: string | null
  carb2Id: string | null
  veggie1Id: string | null
  veggie2Id: string | null
  sauce1Id: string | null
  sauce2Id: string | null
}

export interface DayPlan {
  weekStart: string
  dayName: DayName
  isWorkoutDay: boolean
  needsPreworkout: boolean
  eatingOut: EatingOut
  breakfastNote: string | null
  lunchProteinMethodId: string | null
  lunchCarbId: string | null
  lunchVeggieId: string | null
  lunchSauceId: string | null
  dinnerProteinMethodId: string | null
  dinnerCarbId: string | null
  dinnerVeggieId: string | null
  dinnerSauceId: string | null
  snackNote: string | null
}

export interface JournalEntry {
  date: string
  proteinHitG: number | null
  energyLevel: number | null
  giOkay: boolean | null
  notes: string | null
}

export interface ResolvedMeal {
  proteinMethod: ProteinMethod | null
  carb: Ingredient | null
  veggie: Ingredient | null
  sauce: Sauce | null
  estimatedProteinG: number
}
