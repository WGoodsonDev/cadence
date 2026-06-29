import type { Block } from '@/types/schedule'
import { formatMinute } from '@/lib/timeUtils'

interface CurrentBlockCardProps {
  currentBlock: Block | null
  minutesRemaining: number | null
}

export function CurrentBlockCard({ currentBlock, minutesRemaining }: CurrentBlockCardProps) {
  if (currentBlock === null) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
          Current Block
        </p>
        <p className="mt-2 text-lg font-medium text-gray-500 dark:text-zinc-400">
          Outside scheduled hours
        </p>
      </div>
    )
  }

  const duration = currentBlock.endMinute - currentBlock.startMinute
  const elapsed = duration - (minutesRemaining ?? 0)
  const progress = Math.min(100, Math.max(0, (elapsed / duration) * 100))

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
        Current Block
      </p>

      <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {currentBlock.label}
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
        {formatMinute(currentBlock.startMinute)} – {formatMinute(currentBlock.endMinute)}
      </p>

      <div className="mt-5 space-y-1.5">
        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-[width] duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-sm tabular-nums text-gray-500 dark:text-zinc-400">
          {minutesRemaining} min left
        </p>
      </div>
    </div>
  )
}
