import type { DayType, ScheduleState } from '@/types/schedule'
import { SCHEDULES } from '@/config/schedule'
import { deriveScheduleState } from '@/lib/scheduler'

export const useSchedule = (dayType: DayType, now: Date): ScheduleState =>
  deriveScheduleState(SCHEDULES[dayType], now)
