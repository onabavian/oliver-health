import type { DayName } from '@/types'

export function getWeekStart(date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day // shift to Monday
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

export const DAYS: DayName[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const DEFAULT_TRAIN_DAYS = new Set<DayName>(['Mon', 'Tue', 'Thu', 'Fri'])
