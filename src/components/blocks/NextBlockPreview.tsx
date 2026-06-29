import type { Block } from '@/types/schedule'
import { formatMinute } from '@/lib/timeUtils'

interface NextBlockPreviewProps {
  nextBlock: Block | null
}

export function NextBlockPreview({ nextBlock }: NextBlockPreviewProps) {
  if (nextBlock === null) {
    return (
      <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <p className="text-sm text-gray-400 dark:text-zinc-500">
          No more blocks today
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-baseline gap-2 rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
        Up next
      </span>
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {nextBlock.label}
      </span>
      <span className="ml-auto text-sm tabular-nums text-gray-500 dark:text-zinc-400">
        {formatMinute(nextBlock.startMinute)}
      </span>
    </div>
  )
}
