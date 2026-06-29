import type { ReactNode } from 'react'
import type { DayType } from '@/types/schedule'
import type { Theme } from '@/types/ui'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
  dayType: DayType
  onDayTypeChange: (type: DayType) => void
  theme: Theme
  onThemeToggle: () => void
}

export function Layout({ children, dayType, onDayTypeChange, theme, onThemeToggle }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-gray-100">
      <Header
        dayType={dayType}
        onDayTypeChange={onDayTypeChange}
        theme={theme}
        onThemeToggle={onThemeToggle}
      />
      <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        {children}
      </main>
    </div>
  )
}
