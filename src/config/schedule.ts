import type { DaySchedule, DayType } from '@/types/schedule'

export const SCHEDULE_A: DaySchedule = {
  dayType: 'A',
  blocks: [
    { id: 'wake-intention',       label: 'Wake + Intention',      startMinute: 420,  endMinute: 430,  isSoftwareBlock: false },
    { id: 'software-transition',  label: 'Software Transition',   startMinute: 430,  endMinute: 495,  isSoftwareBlock: true  },
    { id: 'get-ready-breakfast',  label: 'Get Ready + Breakfast', startMinute: 495,  endMinute: 540,  isSoftwareBlock: false },
    { id: 'workday-startup',      label: 'Workday Startup',       startMinute: 540,  endMinute: 555,  isSoftwareBlock: false },
    { id: 'deep-work',            label: 'Deep Work',             startMinute: 555,  endMinute: 750,  isSoftwareBlock: false },
    { id: 'lunch',                label: 'Lunch',                 startMinute: 750,  endMinute: 795,  isSoftwareBlock: false },
    { id: 'afternoon-work',       label: 'Afternoon Work',        startMinute: 795,  endMinute: 1005, isSoftwareBlock: false },
    { id: 'workday-shutdown',     label: 'Workday Shutdown',      startMinute: 1005, endMinute: 1020, isSoftwareBlock: false },
    { id: 'movement',             label: 'Movement',              startMinute: 1020, endMinute: 1080, isSoftwareBlock: false },
    { id: 'solo-intentional-hour',label: 'Solo Intentional Hour', startMinute: 1080, endMinute: 1140, isSoftwareBlock: false },
    { id: 'dinner-partner-time',  label: 'Dinner + Partner Time', startMinute: 1140, endMinute: 1290, isSoftwareBlock: false },
    { id: 'wind-down',            label: 'Wind Down',             startMinute: 1290, endMinute: 1380, isSoftwareBlock: false },
  ],
}

export const SCHEDULE_B: DaySchedule = {
  dayType: 'B',
  blocks: [
    { id: 'wake-intention',       label: 'Wake + Intention',      startMinute: 420,  endMinute: 430,  isSoftwareBlock: false },
    { id: 'software-transition',  label: 'Software Transition',   startMinute: 430,  endMinute: 490,  isSoftwareBlock: true  },
    { id: 'commute-out',          label: 'Commute',               startMinute: 507,  endMinute: 550,  isSoftwareBlock: false },
    { id: 'workday-startup',      label: 'Workday Startup',       startMinute: 550,  endMinute: 560,  isSoftwareBlock: false },
    { id: 'deep-work',            label: 'Deep Work',             startMinute: 560,  endMinute: 750,  isSoftwareBlock: false },
    { id: 'lunch',                label: 'Lunch',                 startMinute: 750,  endMinute: 795,  isSoftwareBlock: false },
    { id: 'afternoon-work',       label: 'Afternoon Work',        startMinute: 795,  endMinute: 1010, isSoftwareBlock: false },
    { id: 'workday-shutdown',     label: 'Workday Shutdown',      startMinute: 1010, endMinute: 1020, isSoftwareBlock: false },
    { id: 'commute-home',         label: 'Commute Home',          startMinute: 1020, endMinute: 1065, isSoftwareBlock: false },
    { id: 'arrive-decompress',    label: 'Arrive + Decompress',   startMinute: 1065, endMinute: 1080, isSoftwareBlock: false },
    { id: 'solo-intentional-hour',label: 'Solo Intentional Hour', startMinute: 1080, endMinute: 1140, isSoftwareBlock: false },
    { id: 'dinner-partner-time',  label: 'Dinner + Partner Time', startMinute: 1140, endMinute: 1290, isSoftwareBlock: false },
    { id: 'wind-down',            label: 'Wind Down',             startMinute: 1290, endMinute: 1380, isSoftwareBlock: false },
  ],
}

export const SCHEDULES: Record<DayType, DaySchedule> = {
  A: SCHEDULE_A,
  B: SCHEDULE_B,
}
