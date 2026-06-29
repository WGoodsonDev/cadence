import { describe, it, expect } from 'vitest'
import type { BlockCompletion } from '@/types/schedule'
import { getWeekDays, completionsByDay, computeStreak } from '@/lib/weeklyReview'

// 2026-06-25 is a Thursday in ISO week 26 (Mon Jun 22 – Sun Jun 28)
const THURSDAY = new Date('2026-06-25T09:00:00')
const MONDAY   = new Date('2026-06-22T09:00:00')
const SUNDAY   = new Date('2026-06-28T09:00:00')

const makeCompletion = (date: string, blockId = 'deep-work'): BlockCompletion => ({
  blockId,
  date,
  completedAt: `${date}T10:00:00Z`,
})

// ─── getWeekDays ────────────────────────────────────────────────────────────

describe('getWeekDays', () => {
  it('returns 7 days starting on Monday for a Thursday input', () => {
    const days = getWeekDays(THURSDAY)
    expect(days).toHaveLength(7)
    expect(days[0]).toBe('2026-06-22') // Monday
    expect(days[6]).toBe('2026-06-28') // Sunday
  })

  it('returns the same week when input is Monday', () => {
    const days = getWeekDays(MONDAY)
    expect(days[0]).toBe('2026-06-22')
    expect(days[6]).toBe('2026-06-28')
  })

  it('returns the same week when input is Sunday', () => {
    const days = getWeekDays(SUNDAY)
    expect(days[0]).toBe('2026-06-22')
    expect(days[6]).toBe('2026-06-28')
  })

  it('handles week rollover across months correctly', () => {
    // 2026-07-02 (Thursday) → week is Jun 29 – Jul 5
    const days = getWeekDays(new Date('2026-07-02T09:00:00'))
    expect(days[0]).toBe('2026-06-29')
    expect(days[6]).toBe('2026-07-05')
  })
})

// ─── completionsByDay ────────────────────────────────────────────────────────

describe('completionsByDay', () => {
  const weekDays = getWeekDays(THURSDAY)

  it('returns 0 for all days when completions are empty', () => {
    const result = completionsByDay([], weekDays)
    for (const day of weekDays) {
      expect(result[day]).toBe(0)
    }
  })

  it('counts completions correctly for days that have them', () => {
    const completions = [
      makeCompletion('2026-06-22'),
      makeCompletion('2026-06-22', 'lunch'),
      makeCompletion('2026-06-25'),
    ]
    const result = completionsByDay(completions, weekDays)
    expect(result['2026-06-22']).toBe(2)
    expect(result['2026-06-25']).toBe(1)
    expect(result['2026-06-23']).toBe(0)
  })

  it('ignores completions outside the given week', () => {
    const completions = [makeCompletion('2026-07-01')] // next week
    const result = completionsByDay(completions, weekDays)
    for (const day of weekDays) {
      expect(result[day]).toBe(0)
    }
  })

  it('includes all 7 days as keys in the result', () => {
    const result = completionsByDay([], weekDays)
    expect(Object.keys(result)).toHaveLength(7)
  })
})

// ─── computeStreak ──────────────────────────────────────────────────────────

describe('computeStreak', () => {
  it('returns 0 when there are no completions', () => {
    expect(computeStreak([], '2026-06-25')).toBe(0)
  })

  it('returns 0 when today has no completions', () => {
    const completions = [makeCompletion('2026-06-24')] // yesterday only
    expect(computeStreak(completions, '2026-06-25')).toBe(0)
  })

  it('returns 1 when only today has completions', () => {
    const completions = [makeCompletion('2026-06-25')]
    expect(computeStreak(completions, '2026-06-25')).toBe(1)
  })

  it('returns the correct count for consecutive days', () => {
    const completions = [
      makeCompletion('2026-06-23'),
      makeCompletion('2026-06-24'),
      makeCompletion('2026-06-25'),
    ]
    expect(computeStreak(completions, '2026-06-25')).toBe(3)
  })

  it('stops counting at a gap in the streak', () => {
    const completions = [
      makeCompletion('2026-06-21'), // gap on 22nd
      makeCompletion('2026-06-23'),
      makeCompletion('2026-06-24'),
      makeCompletion('2026-06-25'),
    ]
    expect(computeStreak(completions, '2026-06-25')).toBe(3)
  })

  it('counts multiple completions on the same day as a single streak day', () => {
    const completions = [
      makeCompletion('2026-06-25'),
      makeCompletion('2026-06-25', 'lunch'),
    ]
    expect(computeStreak(completions, '2026-06-25')).toBe(1)
  })
})
