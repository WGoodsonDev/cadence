import { describe, it, expect } from 'vitest'
import type { Block, DaySchedule } from '@/types/schedule'
import { getCurrentBlock, getNextBlock, deriveScheduleState } from '@/lib/scheduler'

const blockA: Block = { id: 'block-a', label: 'Block A', startMinute: 420, endMinute: 480, isSoftwareBlock: false }
const blockB: Block = { id: 'block-b', label: 'Block B', startMinute: 480, endMinute: 540, isSoftwareBlock: false }
const blockC: Block = { id: 'block-c', label: 'Block C', startMinute: 540, endMinute: 600, isSoftwareBlock: false }

const blocks: Block[] = [blockA, blockB, blockC]

const testSchedule: DaySchedule = { dayType: 'A', blocks }

const makeDate = (hour: number, minute: number): Date => {
  const d = new Date()
  d.setHours(hour, minute, 0, 0)
  return d
}

describe('getCurrentBlock', () => {
  it('returns the block active mid-block', () => {
    expect(getCurrentBlock(blocks, 450)).toBe(blockA)
  })

  it('returns null before the first block', () => {
    expect(getCurrentBlock(blocks, 419)).toBeNull()
  })

  it('returns null after the last block', () => {
    expect(getCurrentBlock(blocks, 601)).toBeNull()
  })

  it('returns block at exact start boundary', () => {
    expect(getCurrentBlock(blocks, 420)).toBe(blockA)
  })

  it('returns block 1 minute before end boundary', () => {
    expect(getCurrentBlock(blocks, 479)).toBe(blockA)
  })

  it('returns null at exact end boundary (block is no longer active)', () => {
    expect(getCurrentBlock(blocks, 480)).toBe(blockB)
  })
})

describe('getNextBlock', () => {
  it('returns the next block when current is not last', () => {
    expect(getNextBlock(blocks, blockA)).toBe(blockB)
  })

  it('returns null when current is the last block', () => {
    expect(getNextBlock(blocks, blockC)).toBeNull()
  })

  it('returns the first block when current is null', () => {
    expect(getNextBlock(blocks, null)).toBe(blockA)
  })
})

describe('deriveScheduleState', () => {
  it('returns correct current, next, and minutesRemaining mid-session', () => {
    // 7:30am = minute 450, mid block-a (420–480)
    const state = deriveScheduleState(testSchedule, makeDate(7, 30))
    expect(state.currentBlock).toBe(blockA)
    expect(state.nextBlock).toBe(blockB)
    expect(state.minutesRemaining).toBe(30)
  })

  it('returns null current and first block as next before schedule starts', () => {
    // 6:59am = minute 419, before block-a starts
    const state = deriveScheduleState(testSchedule, makeDate(6, 59))
    expect(state.currentBlock).toBeNull()
    expect(state.nextBlock).toBe(blockA)
    expect(state.minutesRemaining).toBeNull()
  })

  it('returns the final block as current and null as next', () => {
    // 9:30am = minute 570, mid block-c (540–600), the last block
    const state = deriveScheduleState(testSchedule, makeDate(9, 30))
    expect(state.currentBlock).toBe(blockC)
    expect(state.nextBlock).toBeNull()
    expect(state.minutesRemaining).toBe(30)
  })

  it('includes all blocks in the returned state', () => {
    const state = deriveScheduleState(testSchedule, makeDate(7, 30))
    expect(state.blocks).toBe(testSchedule.blocks)
  })
})
