import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDayType } from '@/hooks/useDayType'
import { STORAGE_KEYS } from '@/config/constants'

const mockStorage: Record<string, string> = {}

beforeEach(() => {
  Object.keys(mockStorage).forEach(k => delete mockStorage[k])
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, value: string) => { mockStorage[key] = value },
    removeItem: (key: string) => { delete mockStorage[key] },
  })
})

describe('useDayType', () => {
  it('defaults to A when nothing is stored', () => {
    const { result } = renderHook(() => useDayType())
    expect(result.current[0]).toBe('A')
  })

  it('reads the persisted day type from localStorage', () => {
    mockStorage[STORAGE_KEYS.dayType] = JSON.stringify('B')
    const { result } = renderHook(() => useDayType())
    expect(result.current[0]).toBe('B')
  })

  it('updates state when setter is called', () => {
    const { result } = renderHook(() => useDayType())
    act(() => { result.current[1]('B') })
    expect(result.current[0]).toBe('B')
  })

  it('persists the new day type to localStorage', () => {
    const { result } = renderHook(() => useDayType())
    act(() => { result.current[1]('B') })
    expect(JSON.parse(mockStorage[STORAGE_KEYS.dayType])).toBe('B')
  })

  it('can toggle back from B to A', () => {
    mockStorage[STORAGE_KEYS.dayType] = JSON.stringify('B')
    const { result } = renderHook(() => useDayType())
    act(() => { result.current[1]('A') })
    expect(result.current[0]).toBe('A')
    expect(JSON.parse(mockStorage[STORAGE_KEYS.dayType])).toBe('A')
  })
})
