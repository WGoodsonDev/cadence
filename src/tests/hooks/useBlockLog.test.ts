import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBlockLog } from '@/hooks/useBlockLog'
import { STORAGE_KEYS } from '@/config/constants'

const mockStorage: Record<string, string> = {}

const TODAY = new Date('2026-06-28T09:00:00')
const TODAY_STR = '2026-06-28'
const YESTERDAY_STR = '2026-06-27'

beforeEach(() => {
  Object.keys(mockStorage).forEach(k => delete mockStorage[k])
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, value: string) => { mockStorage[key] = value },
    removeItem: (key: string) => { delete mockStorage[key] },
  })
})

describe('useBlockLog', () => {
  it('starts with empty completions when log is empty', () => {
    const { result } = renderHook(() => useBlockLog(TODAY))
    expect(result.current.completions).toHaveLength(0)
  })

  it('markComplete adds a completion for today', () => {
    const { result } = renderHook(() => useBlockLog(TODAY))
    act(() => { result.current.markComplete('deep-work') })
    expect(result.current.completions).toHaveLength(1)
    expect(result.current.completions[0].blockId).toBe('deep-work')
    expect(result.current.completions[0].date).toBe(TODAY_STR)
  })

  it('isComplete returns true after markComplete', () => {
    const { result } = renderHook(() => useBlockLog(TODAY))
    act(() => { result.current.markComplete('deep-work') })
    expect(result.current.isComplete('deep-work')).toBe(true)
  })

  it('isComplete returns false for a block that has not been marked', () => {
    const { result } = renderHook(() => useBlockLog(TODAY))
    expect(result.current.isComplete('deep-work')).toBe(false)
  })

  it('markComplete is idempotent — double-marking stays at one entry', () => {
    const { result } = renderHook(() => useBlockLog(TODAY))
    act(() => {
      result.current.markComplete('deep-work')
      result.current.markComplete('deep-work')
    })
    expect(result.current.completions).toHaveLength(1)
  })

  it('filters out completions from other dates', () => {
    mockStorage[STORAGE_KEYS.blockLog] = JSON.stringify([
      { blockId: 'lunch', completedAt: '2026-06-27T13:00:00Z', date: YESTERDAY_STR },
    ])
    const { result } = renderHook(() => useBlockLog(TODAY))
    expect(result.current.completions).toHaveLength(0)
    expect(result.current.isComplete('lunch')).toBe(false)
  })

  it('persists completions to localStorage', () => {
    const { result } = renderHook(() => useBlockLog(TODAY))
    act(() => { result.current.markComplete('deep-work') })
    const stored = JSON.parse(mockStorage[STORAGE_KEYS.blockLog])
    expect(stored).toHaveLength(1)
    expect(stored[0].blockId).toBe('deep-work')
  })

  it('preserves completions from other dates when adding a new one', () => {
    mockStorage[STORAGE_KEYS.blockLog] = JSON.stringify([
      { blockId: 'lunch', completedAt: '2026-06-27T13:00:00Z', date: YESTERDAY_STR },
    ])
    const { result } = renderHook(() => useBlockLog(TODAY))
    act(() => { result.current.markComplete('deep-work') })
    const stored = JSON.parse(mockStorage[STORAGE_KEYS.blockLog])
    expect(stored).toHaveLength(2)
  })
})
