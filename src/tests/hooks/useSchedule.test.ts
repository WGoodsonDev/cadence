import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useSchedule } from '@/hooks/useSchedule'

describe('useSchedule', () => {
  it('returns the correct current block for type A mid-session', () => {
    // 9:30am = minute 570 → deep-work (9:15–12:30, minutes 555–750)
    const now = new Date('2026-06-28T09:30:00')
    const { result } = renderHook(() => useSchedule('A', now))
    expect(result.current.currentBlock?.id).toBe('deep-work')
    expect(result.current.nextBlock?.id).toBe('lunch')
    expect(result.current.minutesRemaining).toBe(180)
  })

  it('returns the correct block list length for type A (12 blocks)', () => {
    const now = new Date('2026-06-28T09:30:00')
    const { result } = renderHook(() => useSchedule('A', now))
    expect(result.current.blocks).toHaveLength(12)
  })

  it('returns the correct block list length for type B (13 blocks)', () => {
    const now = new Date('2026-06-28T09:30:00')
    const { result } = renderHook(() => useSchedule('B', now))
    expect(result.current.blocks).toHaveLength(13)
  })

  it('returns null currentBlock before the schedule starts', () => {
    // 6:00am = minute 360, before wake-intention at 7:00am (420)
    const now = new Date('2026-06-28T06:00:00')
    const { result } = renderHook(() => useSchedule('A', now))
    expect(result.current.currentBlock).toBeNull()
    expect(result.current.minutesRemaining).toBeNull()
  })

  it('returns null nextBlock for the final block of the day', () => {
    // 10:00pm = minute 1320, wind-down (21:30–23:00 = 1290–1380)
    const now = new Date('2026-06-28T22:00:00')
    const { result } = renderHook(() => useSchedule('A', now))
    expect(result.current.currentBlock?.id).toBe('wind-down')
    expect(result.current.nextBlock).toBeNull()
  })
})
