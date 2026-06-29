import type { Block } from '@/types/schedule'
import { formatMinute } from '@/lib/timeUtils'

interface BlockListProps {
  blocks: Block[]
  currentBlockId: string | null
  isComplete: (blockId: string) => boolean
  markComplete: (blockId: string) => void
}

function CheckIcon() {
  return (
    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2 6l3 3 5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BlockList({ blocks, currentBlockId, isComplete, markComplete }: BlockListProps) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
        Today
      </h3>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 divide-y divide-gray-100 dark:bg-zinc-900 dark:ring-zinc-800 dark:divide-zinc-800">
        {blocks.map(block => {
          const active = block.id === currentBlockId
          const done = isComplete(block.id)

          return (
            <div
              key={block.id}
              className={[
                'flex items-center gap-3 py-3 pr-4 transition-colors',
                active
                  ? 'border-l-2 border-indigo-500 pl-3.5 bg-indigo-50/60 dark:bg-indigo-950/20'
                  : 'border-l-2 border-transparent pl-3.5',
              ].join(' ')}
            >
              <button
                onClick={() => markComplete(block.id)}
                disabled={done}
                aria-label={done ? `${block.label} completed` : `Mark ${block.label} complete`}
                className={[
                  'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  done
                    ? 'border-indigo-500 bg-indigo-500 cursor-default'
                    : active
                    ? 'border-indigo-400 hover:border-indigo-500'
                    : 'border-gray-300 hover:border-gray-400 dark:border-zinc-600 dark:hover:border-zinc-400',
                ].join(' ')}
              >
                {done && <CheckIcon />}
              </button>

              <span
                className={[
                  'flex-1 text-sm',
                  done
                    ? 'text-gray-400 dark:text-zinc-500'
                    : active
                    ? 'font-semibold text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-800 dark:text-gray-200',
                ].join(' ')}
              >
                {block.label}
              </span>

              <span
                className={[
                  'text-xs tabular-nums',
                  active
                    ? 'text-indigo-500 dark:text-indigo-400'
                    : 'text-gray-400 dark:text-zinc-500',
                ].join(' ')}
              >
                {formatMinute(block.startMinute)} – {formatMinute(block.endMinute)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
