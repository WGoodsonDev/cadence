import type { Block, DaySchedule, ScheduleState } from '@/types/schedule'
import { minuteOfDay, minutesUntil } from '@/lib/timeUtils'

export const getCurrentBlock = (
  blocks: Block[],
  currentMinute: number
): Block | null =>
  blocks.find(
    b => currentMinute >= b.startMinute && currentMinute < b.endMinute
  ) ?? null

export const getNextBlock = (
  blocks: Block[],
  currentBlock: Block | null
): Block | null => {
  if (currentBlock === null) return blocks[0] ?? null
  const idx = blocks.findIndex(b => b.id === currentBlock.id)
  if (idx === -1 || idx === blocks.length - 1) return null
  return blocks[idx + 1]
}

export const deriveScheduleState = (
  schedule: DaySchedule,
  now: Date
): ScheduleState => {
  const currentMinute = minuteOfDay(now)
  const currentBlock = getCurrentBlock(schedule.blocks, currentMinute)
  const nextBlock = getNextBlock(schedule.blocks, currentBlock)
  const minutesRemaining = currentBlock
    ? minutesUntil(currentMinute, currentBlock.endMinute)
    : null
  return { currentBlock, nextBlock, minutesRemaining, blocks: schedule.blocks }
}
