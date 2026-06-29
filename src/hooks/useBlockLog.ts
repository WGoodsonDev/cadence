import { useState } from 'react'
import type { BlockCompletion } from '@/types/schedule'
import { storageGet, storageSet } from '@/lib/storage'
import { STORAGE_KEYS } from '@/config/constants'
import { toDateString } from '@/lib/timeUtils'

export const useBlockLog = (
  now: Date
): {
  completions: BlockCompletion[]
  markComplete: (blockId: string) => void
  isComplete: (blockId: string) => boolean
} => {
  const today = toDateString(now)
  const [log, setLog] = useState<BlockCompletion[]>(
    () => storageGet<BlockCompletion[]>(STORAGE_KEYS.blockLog) ?? []
  )

  const todayCompletions = log.filter(c => c.date === today)

  const markComplete = (blockId: string): void => {
    if (todayCompletions.some(c => c.blockId === blockId)) return
    const entry: BlockCompletion = {
      blockId,
      completedAt: new Date().toISOString(),
      date: today,
    }
    const next = [...log, entry]
    setLog(next)
    storageSet(STORAGE_KEYS.blockLog, next)
  }

  const isComplete = (blockId: string): boolean =>
    todayCompletions.some(c => c.blockId === blockId)

  return { completions: todayCompletions, markComplete, isComplete }
}
