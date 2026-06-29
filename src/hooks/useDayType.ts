import { useState } from 'react'
import type { DayType } from '@/types/schedule'
import { storageGet, storageSet } from '@/lib/storage'
import { STORAGE_KEYS } from '@/config/constants'

export const useDayType = (): [DayType, (type: DayType) => void] => {
  const [dayType, setDayTypeState] = useState<DayType>(
    () => storageGet<DayType>(STORAGE_KEYS.dayType) ?? 'A'
  )

  const setDayType = (type: DayType): void => {
    setDayTypeState(type)
    storageSet(STORAGE_KEYS.dayType, type)
  }

  return [dayType, setDayType]
}
