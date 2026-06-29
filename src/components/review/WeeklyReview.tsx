import { ROTATION_TARGETS } from '@/config/constants'

interface WeeklyReviewProps {
  weekDays: string[]
  completionsByDay: Record<string, number>
  streak: number
  prepCount: number
  projectCount: number
  today: string
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MAX_BLOCKS = 12 // scale for progress bars

function formatWeekRange(weekDays: string[]): string {
  const start = new Date(weekDays[0] + 'T12:00:00')
  const end   = new Date(weekDays[6] + 'T12:00:00')
  const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short' })
  const startMonth = monthFmt.format(start)
  const endMonth   = monthFmt.format(end)
  const startDay = start.getDate()
  const endDay   = end.getDate()
  return startMonth === endMonth
    ? `${startMonth} ${startDay} – ${endDay}`
    : `${startMonth} ${startDay} – ${endMonth} ${endDay}`
}

export function WeeklyReview({
  weekDays,
  completionsByDay,
  streak,
  prepCount,
  projectCount,
  today,
}: WeeklyReviewProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
      {/* Header */}
      <div className="mb-4 flex items-baseline justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
          Weekly Review
        </p>
        <p className="text-xs text-gray-400 dark:text-zinc-500">
          {formatWeekRange(weekDays)}
        </p>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <p className="mb-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          {streak}-day streak
        </p>
      )}

      {/* Day rows */}
      <div className="space-y-2">
        {weekDays.map((date, i) => {
          const count = completionsByDay[date] ?? 0
          const isToday = date === today
          const isFuture = date > today
          const pct = Math.min(100, (count / MAX_BLOCKS) * 100)

          return (
            <div key={date} className="flex items-center gap-3">
              <span
                className={[
                  'w-7 flex-shrink-0 text-xs font-medium',
                  isToday
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-zinc-400',
                ].join(' ')}
              >
                {DAY_LABELS[i]}
              </span>

              <div className="flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800" style={{ height: '6px' }}>
                <div
                  className={[
                    'h-full rounded-full transition-[width]',
                    isFuture ? 'bg-transparent' : 'bg-indigo-500',
                  ].join(' ')}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <span
                className={[
                  'w-16 text-right text-xs tabular-nums',
                  isFuture
                    ? 'text-gray-300 dark:text-zinc-600'
                    : 'text-gray-500 dark:text-zinc-400',
                ].join(' ')}
              >
                {isFuture ? '—' : `${count} block${count !== 1 ? 's' : ''}`}
              </span>
            </div>
          )
        })}
      </div>

      {/* Rotation summary */}
      <div className="mt-4 border-t border-gray-100 pt-4 dark:border-zinc-800">
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          <span className="font-medium text-gray-700 dark:text-zinc-300">Rotation</span>
          {'  ·  '}
          Prep {prepCount}/{ROTATION_TARGETS.prep}
          {'  ·  '}
          Project {projectCount}/{ROTATION_TARGETS.project}
        </p>
      </div>
    </div>
  )
}
