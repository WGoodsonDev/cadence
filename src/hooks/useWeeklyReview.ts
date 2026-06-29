import type { BlockCompletion, WeeklyRotation } from '@/types/schedule'
import { storageGet } from '@/lib/storage'
import { STORAGE_KEYS } from '@/config/constants'
import { toDateString, toWeekKey } from '@/lib/timeUtils'
import { getWeekDays, completionsByDay, computeStreak } from '@/lib/weeklyReview'

export const useWeeklyReview = (
  now: Date
): {
  weekDays: string[]
  completionsByDay: Record<string, number>
  streak: number
  prepCount: number
  projectCount: number
  today: string
} => {
  const today = toDateString(now)
  const weekKey = toWeekKey(now)

  const allCompletions = storageGet<BlockCompletion[]>(STORAGE_KEYS.blockLog) ?? []
  const storedRotation = storageGet<WeeklyRotation>(STORAGE_KEYS.rotation(weekKey))
  const entries = storedRotation?.weekKey === weekKey ? storedRotation.entries : []

  const weekDays = getWeekDays(now)

  return {
    weekDays,
    completionsByDay: completionsByDay(allCompletions, weekDays),
    streak: computeStreak(allCompletions, today),
    prepCount: entries.filter(e => e.sessionType === 'prep').length,
    projectCount: entries.filter(e => e.sessionType === 'project').length,
    today,
  }
}
