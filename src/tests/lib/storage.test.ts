import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { storageGet, storageSet, storageRemove } from '@/lib/storage'

beforeEach(() => {
  const store: Record<string, string> = {}
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('storageGet', () => {
  it('returns the parsed value for an existing key', () => {
    storageSet('key', { x: 1 })
    expect(storageGet('key')).toEqual({ x: 1 })
  })

  it('returns null for a missing key', () => {
    expect(storageGet('nonexistent')).toBeNull()
  })

  it('returns null for malformed JSON without throwing', () => {
    localStorage.setItem('bad', '{not valid json')
    expect(() => storageGet('bad')).not.toThrow()
    expect(storageGet('bad')).toBeNull()
  })
})

describe('storageSet', () => {
  it('stores a value that is retrievable by storageGet', () => {
    storageSet('name', 'cadence')
    expect(storageGet<string>('name')).toBe('cadence')
  })

  it('overwrites an existing value', () => {
    storageSet('count', 1)
    storageSet('count', 2)
    expect(storageGet<number>('count')).toBe(2)
  })
})

describe('storageRemove', () => {
  it('key is absent after remove', () => {
    storageSet('temp', true)
    storageRemove('temp')
    expect(storageGet('temp')).toBeNull()
  })

  it('is a no-op on a missing key', () => {
    expect(() => storageRemove('nonexistent')).not.toThrow()
  })
})
