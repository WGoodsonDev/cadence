import type { DayType } from '@/types/schedule'
import type { Theme } from '@/types/ui'

interface HeaderProps {
  dayType: DayType
  onDayTypeChange: (type: DayType) => void
  theme: Theme
  onThemeToggle: () => void
}

const DAY_TYPE_OPTIONS: { value: DayType; label: string }[] = [
  { value: 'A', label: 'WFH' },
  { value: 'B', label: 'Office' },
]

export function Header({ dayType, onDayTypeChange, theme, onThemeToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Cadence
        </span>

        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-md border border-gray-200 dark:border-zinc-700">
            {DAY_TYPE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onDayTypeChange(value)}
                aria-pressed={dayType === value}
                className={[
                  'px-3 py-1 text-sm font-medium transition-colors',
                  dayType === value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-transparent text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-100',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={onThemeToggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>
    </header>
  )
}
