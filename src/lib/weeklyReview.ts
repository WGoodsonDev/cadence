import type { BlockCompletion } from '@/types/schedule'
import { toDateString } from '@/lib/timeUtils'

// Returns the 7 ISO date strings (Mon–Sun) for the week containing `date`.
export const getWeekDays = (date: Date): string[] => {
  const d = new Date(date)
  const isoDay = d.getDay() || 7 // Monday=1 … Sunday=7
  d.setDate(d.getDate() - (isoDay - 1)) // rewind to Monday
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(d)
    day.setDate(d.getDate() + i)
    return toDateString(day)
  })
}

// Returns the number of completed blocks for each of the given dates.
export const completionsByDay = (
  completions: BlockCompletion[],
  weekDays: string[]
): Record<string, number> => {
  const result: Record<string, number> = {}
  for (const day of weekDays) {
    result[day] = completions.filter(c => c.date === day).length
  }
  return result
}

// Returns the current streak: consecutive days ending at `today` (inclusive)
// that each have at least one block completion.
export const computeStreak = (
  completions: BlockCompletion[],
  today: string
): number => {
  const daysWithCompletions = new Set(completions.map(c => c.date))
  let streak = 0
  // Use noon to avoid DST-related date shifts when subtracting days
  const d = new Date(today + 'T12:00:00')
  while (daysWithCompletions.has(toDateString(d))) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}
