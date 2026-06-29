import { useNow } from '@/hooks/useNow'
import { useDayType } from '@/hooks/useDayType'
import { useSchedule } from '@/hooks/useSchedule'
import { useBlockLog } from '@/hooks/useBlockLog'
import { useTheme } from '@/hooks/useTheme'
import { Layout } from '@/components/layout'
import { CurrentBlockCard, NextBlockPreview, BlockList } from '@/components/blocks'

export default function App() {
  const now = useNow()
  const [dayType, setDayType] = useDayType()
  const [theme, toggleTheme] = useTheme()
  const { currentBlock, nextBlock, minutesRemaining, blocks } = useSchedule(dayType, now)
  const { isComplete, markComplete } = useBlockLog(now)

  return (
    <Layout
      dayType={dayType}
      onDayTypeChange={setDayType}
      theme={theme}
      onThemeToggle={toggleTheme}
    >
      <CurrentBlockCard currentBlock={currentBlock} minutesRemaining={minutesRemaining} />
      <NextBlockPreview nextBlock={nextBlock} />
      <BlockList
        blocks={blocks}
        currentBlockId={currentBlock?.id ?? null}
        isComplete={isComplete}
        markComplete={markComplete}
      />
    </Layout>
  )
}
