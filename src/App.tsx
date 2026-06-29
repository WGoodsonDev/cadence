import { useNow } from '@/hooks/useNow'
import { useDayType } from '@/hooks/useDayType'
import { useSchedule } from '@/hooks/useSchedule'
import { useBlockLog } from '@/hooks/useBlockLog'
import { useRotation } from '@/hooks/useRotation'
import { useTheme } from '@/hooks/useTheme'
import { Layout } from '@/components/layout'
import { CurrentBlockCard, NextBlockPreview, BlockList } from '@/components/blocks'
import { RotationTracker, LogSessionButton } from '@/components/rotation'

export default function App() {
  const now = useNow()
  const [dayType, setDayType] = useDayType()
  const [theme, toggleTheme] = useTheme()
  const { currentBlock, nextBlock, minutesRemaining, blocks, isSoftwareBlockPast } = useSchedule(dayType, now)
  const { isComplete, markComplete } = useBlockLog(now)
  const { prepCount, projectCount, todayEntry, logSession } = useRotation(now)

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
    </Layout>
  )
}
