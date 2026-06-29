import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useNow } from '@/hooks/useNow'

describe('useNow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns a Date on initial render', () => {
    const { result } = renderHook(() => useNow())
    expect(result.current).toBeInstanceOf(Date)
  })

  it('updates after 30 seconds', () => {
    const { result } = renderHook(() => useNow())
    const initial = result.current.getTime()
    act(() => { vi.advanceTimersByTime(30_000) })
    expect(result.current.getTime()).toBeGreaterThan(initial)
  })

  it('does not update before 30 seconds have elapsed', () => {
    const { result } = renderHook(() => useNow())
    const initial = result.current.getTime()
    act(() => { vi.advanceTimersByTime(29_999) })
    expect(result.current.getTime()).toBe(initial)
  })

  it('clears the interval on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval')
    const { unmount } = renderHook(() => useNow())
    unmount()
    expect(clearSpy).toHaveBeenCalled()
    clearSpy.mockRestore()
  })
})
