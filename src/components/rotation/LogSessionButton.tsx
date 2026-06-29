import type { RotationEntry, RotationSessionType } from '@/types/schedule'

interface LogSessionButtonProps {
  todayEntry: RotationEntry | null
  onLog: (type: RotationSessionType) => void
}

const SESSION_OPTIONS: { type: RotationSessionType; label: string }[] = [
  { type: 'prep', label: 'Interview Prep' },
  { type: 'project', label: 'Project Work' },
]

export function LogSessionButton({ todayEntry, onLog }: LogSessionButtonProps) {
  if (todayEntry !== null) {
    const label = todayEntry.sessionType === 'prep' ? 'Interview Prep' : 'Project Work'
    return (
      <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <span className="text-indigo-500">✓</span>
        <span className="text-sm text-gray-600 dark:text-zinc-400">
          Logged: <span className="font-medium text-gray-900 dark:text-gray-100">{label}</span>
        </span>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
        Log this morning's session
      </p>
      <div className="flex gap-2">
        {SESSION_OPTIONS.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => onLog(type)}
            className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-300"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
