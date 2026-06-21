export type IngredientType = 'protein' | 'carb' | 'veggie' | 'dairy' | 'pantry' | 'breakfast' | 'snack'
export type DayName = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
export type MealBypass = 'normal' | 'skipped' | 'eating_out' | 'date_night' | 'event'
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
  name: string | null
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
  breakfastItemIds: string[]
  snackItemIds: string[]
}

export interface DayPlan {
  weekStart: string
  dayName: DayName
  isWorkoutDay: boolean
  needsPreworkout: boolean
  breakfastBypass: MealBypass
  lunchBypass: MealBypass
  lunchBypassNote: string | null
  dinnerBypass: MealBypass
  dinnerBypassNote: string | null
  snackBypass: MealBypass
}

export interface JournalEntry {
  date: string
  energyLevel: number | null
  giOkay: boolean | null
  notes: string | null
}

export interface SavedBatch {
  id: string
  weekStart: string
  name: string
  protein1?: { name: string } | null
  protein2?: { name: string } | null
  carb1?: { name: string } | null
  carb2?: { name: string } | null
  veggie1?: { name: string } | null
  veggie2?: { name: string } | null
  sauce1?: { name: string } | null
  sauce2?: { name: string } | null
  breakfastItemIds: string[]
  snackItemIds: string[]
}
