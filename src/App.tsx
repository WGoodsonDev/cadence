import { useState } from 'react'
import { useNow } from '@/hooks/useNow'
import { useDayType } from '@/hooks/useDayType'
import { useSchedule } from '@/hooks/useSchedule'
import { useBlockLog } from '@/hooks/useBlockLog'
import { useRotation } from '@/hooks/useRotation'
import { useTheme } from '@/hooks/useTheme'
import { useWeeklyReview } from '@/hooks/useWeeklyReview'
import { Layout } from '@/components/layout'
import { CurrentBlockCard, NextBlockPreview, BlockList } from '@/components/blocks'
import { RotationTracker, LogSessionButton } from '@/components/rotation'
import { WeeklyReview } from '@/components/review'

export default function App() {
  const now = useNow()
  const [dayType, setDayType] = useDayType()
  const [theme, toggleTheme] = useTheme()
  const [showReview, setShowReview] = useState(false)

  const { currentBlock, nextBlock, minutesRemaining, blocks, isSoftwareBlockPast } = useSchedule(dayType, now)
  const { isComplete, markComplete } = useBlockLog(now)
  const { prepCount, projectCount, todayEntry, logSession } = useRotation(now)
  const weeklyReview = useWeeklyReview(now)

  return (
    <Layout
      dayType={dayType}
      onDayTypeChange={setDayType}
      theme={theme}
      onThemeToggle={toggleTheme}
    >
      <CurrentBlockCard currentBlock={currentBlock} minutesRemaining={minutesRemaining} />
      <NextBlockPreview nextBlock={nextBlock} />
      {isSoftwareBlockPast && (
        <LogSessionButton todayEntry={todayEntry} onLog={logSession} />
      )}
      <BlockList
        blocks={blocks}
        currentBlockId={currentBlock?.id ?? null}
        isComplete={isComplete}
        markComplete={markComplete}
      />
      <RotationTracker prepCount={prepCount} projectCount={projectCount} />

      <button
        onClick={() => setShowReview(v => !v)}
        className="w-full rounded-lg py-2 text-sm text-gray-400 transition-colors hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300"
      >
        {showReview ? '↑ Hide weekly review' : '↓ Weekly review'}
      </button>

      {showReview && <WeeklyReview {...weeklyReview} />}
    </Layout>
  )
}
