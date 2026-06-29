import { useState } from 'react'
import type { Theme } from '@/types/ui'
import { storageGet, storageSet } from '@/lib/storage'
import { STORAGE_KEYS } from '@/config/constants'

const applyTheme = (theme: Theme): void => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

const getInitialTheme = (): Theme => {
  const stored = storageGet<Theme>(STORAGE_KEYS.theme)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = getInitialTheme()
    applyTheme(initial)
    return initial
  })

  const toggle = (): void => {
    setTheme(current => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      storageSet(STORAGE_KEYS.theme, next)
      return next
    })
  }

  return [theme, toggle]
}
