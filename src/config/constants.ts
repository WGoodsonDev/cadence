export const ROTATION_TARGETS = {
  prep: 3,
  project: 2,
} as const

export const STORAGE_KEYS = {
  dayType: 'cadence-day-type',
  blockLog: 'cadence-block-log',
  theme: 'cadence-theme',
  rotation: (weekKey: string) => `cadence-rotation-${weekKey}`,
} as const

export const WEEK_START_DAY = 1 // Monday
