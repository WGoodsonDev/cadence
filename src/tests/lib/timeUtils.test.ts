import { describe, it, expect } from 'vitest'
import {
  minuteOfDay,
  toDateString,
  toWeekKey,
  formatMinute,
  minutesUntil,
} from '@/lib/timeUtils'

describe('minuteOfDay', () => {
  it('returns 0 at midnight', () => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    expect(minuteOfDay(d)).toBe(0)
  })

  it('returns 430 at 7:10am', () => {
    const d = new Date()
    d.setHours(7, 10, 0, 0)
    expect(minuteOfDay(d)).toBe(430)
  })

  it('returns 720 at noon', () => {
    const d = new Date()
    d.setHours(12, 0, 0, 0)
    expect(minuteOfDay(d)).toBe(720)
  })

  it('returns 1439 at 11:59pm', () => {
    const d = new Date()
    d.setHours(23, 59, 0, 0)
    expect(minuteOfDay(d)).toBe(1439)
  })
})

describe('toDateString', () => {
  it('returns YYYY-MM-DD format', () => {
    expect(toDateString(new Date(2026, 5, 28))).toBe('2026-06-28')
  })

  it('pads single-digit month and day with leading zeros', () => {
    expect(toDateString(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('toWeekKey', () => {
  it('returns correct ISO week key for a Thursday (week anchor day)', () => {
    // Jan 1, 2026 is a Thursday → W01 of 2026
    expect(toWeekKey(new Date(2026, 0, 1))).toBe('2026-W01')
  })

  it('treats Monday as the first day of the week', () => {
    // Jan 5, 2026 (Monday) starts W02; Jan 4 (Sunday) is still W01
    expect(toWeekKey(new Date(2026, 0, 4))).toBe('2026-W01')
    expect(toWeekKey(new Date(2026, 0, 5))).toBe('2026-W02')
  })

  it('handles week rollover at year boundary', () => {
    // Dec 28, 2025 (Sunday) → 2025-W52; Dec 29, 2025 (Monday) → 2026-W01
    expect(toWeekKey(new Date(2025, 11, 28))).toBe('2025-W52')
    expect(toWeekKey(new Date(2025, 11, 29))).toBe('2026-W01')
  })
})

describe('formatMinute', () => {
  it('formats 0 as 12:00am', () => {
    expect(formatMinute(0)).toBe('12:00am')
  })

  it('formats 430 as 7:10am', () => {
    expect(formatMinute(430)).toBe('7:10am')
  })

  it('formats 720 as 12:00pm', () => {
    expect(formatMinute(720)).toBe('12:00pm')
  })

  it('formats 810 as 1:30pm', () => {
    expect(formatMinute(810)).toBe('1:30pm')
  })
})

describe('minutesUntil', () => {
  it('returns correct difference for basic case', () => {
    expect(minutesUntil(430, 495)).toBe(65)
  })

  it('returns 0 when current equals end', () => {
    expect(minutesUntil(495, 495)).toBe(0)
  })

  it('returns negative when current is past end', () => {
    expect(minutesUntil(500, 495)).toBe(-5)
  })
})
