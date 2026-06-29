import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRotation } from '@/hooks/useRotation'
import { STORAGE_KEYS } from '@/config/constants'

// 2026-06-25 (Thursday) = ISO week 26
const WEEK1_DATE = new Date('2026-06-25T09:00:00')
const WEEK1_KEY = '2026-W26'
// 2026-06-29 (Monday) = ISO week 27
const WEEK2_DATE = new Date('2026-06-29T09:00:00')

const TODAY = '2026-06-25'

const mockStorage: Record<string, string> = {}

beforeEach(() => {
  Object.keys(mockStorage).forEach(k => delete mockStorage[k])
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, value: string) => { mockStorage[key] = value },
    removeItem: (key: string) => { delete mockStorage[key] },
  })
})

describe('useRotation', () => {
  it('starts with empty entries when nothing is stored', () => {
    const { result } = renderHook(() => useRotation(WEEK1_DATE))
    expect(result.current.entries).toHaveLength(0)
  })

  it('logSession adds a prep entry', () => {
    const { result } = renderHook(() => useRotation(WEEK1_DATE))
    act(() => { result.current.logSession('prep') })
    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0].sessionType).toBe('prep')
    expect(result.current.entries[0].date).toBe(TODAY)
  })

  it('logSession adds a project entry', () => {
    const { result } = renderHook(() => useRotation(WEEK1_DATE))
    act(() => { result.current.logSession('project') })
    expect(result.current.entries[0].sessionType).toBe('project')
  })

  it('prepCount and projectCount reflect logged entries', () => {
    const { result } = renderHook(() => useRotation(WEEK1_DATE))
    act(() => {
      result.current.logSession('prep')
      result.current.logSession('prep')
      result.current.logSession('project')
    })
    expect(result.current.prepCount).toBe(2)
    expect(result.current.projectCount).toBe(1)
  })

  it('todayEntry is null when nothing has been logged today', () => {
    const { result } = renderHook(() => useRotation(WEEK1_DATE))
    expect(result.current.todayEntry).toBeNull()
  })

  it('todayEntry returns the logged entry for today', () => {
    const { result } = renderHook(() => useRotation(WEEK1_DATE))
    act(() => { result.current.logSession('prep') })
    expect(result.current.todayEntry?.sessionType).toBe('prep')
    expect(result.current.todayEntry?.date).toBe(TODAY)
  })

  it('persists entries to localStorage under the correct key', () => {
    const { result } = renderHook(() => useRotation(WEEK1_DATE))
    act(() => { result.current.logSession('prep') })
    const stored = JSON.parse(mockStorage[STORAGE_KEYS.rotation(WEEK1_KEY)])
    expect(stored.weekKey).toBe(WEEK1_KEY)
    expect(stored.entries).toHaveLength(1)
  })

  it('reads stored data for the current week on init', () => {
    mockStorage[STORAGE_KEYS.rotation(WEEK1_KEY)] = JSON.stringify({
      weekKey: WEEK1_KEY,
      entries: [{ date: TODAY, sessionType: 'project', loggedAt: '2026-06-25T08:00:00Z' }],
    })
    const { result } = renderHook(() => useRotation(WEEK1_DATE))
    expect(result.current.entries).toHaveLength(1)
    expect(result.current.projectCount).toBe(1)
  })

  it('ignores stored data from a previous week on init', () => {
    // Store week 1 data, then init the hook with a week 2 date
    mockStorage[STORAGE_KEYS.rotation(WEEK1_KEY)] = JSON.stringify({
      weekKey: WEEK1_KEY,
      entries: [{ date: '2026-06-25', sessionType: 'prep', loggedAt: '2026-06-25T08:00:00Z' }],
    })
    const { result } = renderHook(() => useRotation(WEEK2_DATE))
    expect(result.current.entries).toHaveLength(0)
  })

  it('resets entries when the week changes mid-session', () => {
    const { result, rerender } = renderHook(
      ({ now }) => useRotation(now),
      { initialProps: { now: WEEK1_DATE } }
    )
    act(() => { result.current.logSession('prep') })
    expect(result.current.entries).toHaveLength(1)

    act(() => { rerender({ now: WEEK2_DATE }) })
    expect(result.current.entries).toHaveLength(0)
    expect(result.current.prepCount).toBe(0)
  })
})
