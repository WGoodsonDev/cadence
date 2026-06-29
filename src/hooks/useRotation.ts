import { useState, useEffect } from 'react'
import type { WeeklyRotation, RotationEntry, RotationSessionType } from '@/types/schedule'
import { storageGet, storageSet } from '@/lib/storage'
import { STORAGE_KEYS } from '@/config/constants'
import { toDateString, toWeekKey } from '@/lib/timeUtils'

export const useRotation = (
  now: Date
): {
  entries: RotationEntry[]
  prepCount: number
  projectCount: number
  todayEntry: RotationEntry | null
  logSession: (type: RotationSessionType) => void
} => {
  const weekKey = toWeekKey(now)
  const today = toDateString(now)

  const [rotation, setRotation] = useState<WeeklyRotation>(() => {
    const stored = storageGet<WeeklyRotation>(STORAGE_KEYS.rotation(weekKey))
    return stored?.weekKey === weekKey ? stored : { weekKey, entries: [] }
  })

  // Auto-reset when crossing into a new week
  useEffect(() => {
    if (rotation.weekKey !== weekKey) {
      const stored = storageGet<WeeklyRotation>(STORAGE_KEYS.rotation(weekKey))
      setRotation(stored?.weekKey === weekKey ? stored : { weekKey, entries: [] })
    }
  }, [weekKey, rotation.weekKey])

  // Derive entries for the current week, guarding against the brief moment
  // before the useEffect above fires on a week boundary
  const currentEntries = rotation.weekKey === weekKey ? rotation.entries : []

  const logSession = (type: RotationSessionType): void => {
    const entry: RotationEntry = {
      date: today,
      sessionType: type,
      loggedAt: new Date().toISOString(),
    }
    setRotation(prev => {
      const prevEntries = prev.weekKey === weekKey ? prev.entries : []
      const next: WeeklyRotation = { weekKey, entries: [...prevEntries, entry] }
      // storageSet inside functional updater is intentional: React guarantees
      // updaters receive the pending state, so batched calls compose correctly.
      // localStorage writes are idempotent so the StrictMode double-invoke is safe.
      storageSet(STORAGE_KEYS.rotation(weekKey), next)
      return next
    })
  }

  const prepCount = currentEntries.filter(e => e.sessionType === 'prep').length
  const projectCount = currentEntries.filter(e => e.sessionType === 'project').length
  const todayEntry = currentEntries.find(e => e.date === today) ?? null

  return { entries: currentEntries, prepCount, projectCount, todayEntry, logSession }
}
