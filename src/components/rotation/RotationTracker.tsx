import { ROTATION_TARGETS } from '@/config/constants'

interface RotationTrackerProps {
  prepCount: number
  projectCount: number
}

interface RowProps {
  label: string
  count: number
  target: number
}

function ProgressRow({ label, count, target }: RowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 flex-shrink-0 text-sm text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: target }).map((_, i) => (
          <div
            key={i}
            className={[
              'h-2.5 w-2.5 rounded-full transition-colors',
              i < count
                ? 'bg-indigo-500'
                : 'bg-gray-200 dark:bg-zinc-700',
            ].join(' ')}
          />
        ))}
      </div>
      <span className="ml-auto text-sm tabular-nums text-gray-500 dark:text-zinc-400">
        {count} / {target}
      </span>
    </div>
  )
}

export function RotationTracker({ prepCount, projectCount }: RotationTrackerProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <div className="mb-4 flex items-baseline justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
          Software Rotation
        </p>
        <p className="text-xs text-gray-400 dark:text-zinc-500">This week</p>
      </div>

      <div className="space-y-3">
        <ProgressRow
          label="Interview Prep"
          count={prepCount}
          target={ROTATION_TARGETS.prep}
        />
        <ProgressRow
          label="Project Work"
          count={projectCount}
          target={ROTATION_TARGETS.project}
        />
      </div>
    </div>
  )
}
