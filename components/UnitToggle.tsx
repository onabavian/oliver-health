'use client'

import { createContext, useContext, useState } from 'react'
import type { UnitSystem, Ingredient } from '@/types'

const UnitCtx = createContext<{ unit: UnitSystem; toggle: () => void }>({
  unit: 'imperial',
  toggle: () => {},
})

export function UnitProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnit] = useState<UnitSystem>('imperial')
  return (
    <UnitCtx.Provider value={{ unit, toggle: () => setUnit(u => u === 'imperial' ? 'metric' : 'imperial') }}>
      {children}
    </UnitCtx.Provider>
  )
}

export function useUnit() {
  return useContext(UnitCtx)
}

export function UnitToggleButton() {
  const { unit, toggle } = useUnit()
  return (
    <button
      onClick={toggle}
      className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600"
    >
      {unit === 'imperial' ? 'oz → g' : 'g → oz'}
    </button>
  )
}

export function Qty({ ingredient }: { ingredient: Pick<Ingredient, 'defaultQtyG' | 'defaultQtyImperial' | 'notes'> }) {
  const { unit } = useUnit()
  const qty = unit === 'metric'
    ? (ingredient.defaultQtyG ? `${ingredient.defaultQtyG}g` : '—')
    : (ingredient.defaultQtyImperial ?? (ingredient.defaultQtyG ? `${ingredient.defaultQtyG}g` : '—'))
  return (
    <span className="text-sm text-gray-500">
      {qty}
      {ingredient.notes && <span className="text-gray-400 ml-1.5">({ingredient.notes})</span>}
    </span>
  )
}
