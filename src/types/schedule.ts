export type DayType = 'A' | 'B';

export interface Block {
  id: string;
  label: string;
  startMinute: number;
  endMinute: number;
  notes?: string;
  isSoftwareBlock: boolean;
}

export interface DaySchedule {
  dayType: DayType;
  blocks: Block[];
}

export interface BlockCompletion {
  blockId: string;
  completedAt: string; // ISO 8601
  date: string;        // 'YYYY-MM-DD'
}

export type RotationSessionType = 'prep' | 'project';

export interface RotationEntry {
  date: string;            // 'YYYY-MM-DD'
  sessionType: RotationSessionType;
  loggedAt: string;        // ISO 8601
}

export interface WeeklyRotation {
  weekKey: string;         // ISO week string e.g. '2026-W27'
  entries: RotationEntry[];
}

export interface ScheduleState {
  currentBlock: Block | null;
  nextBlock: Block | null;
  minutesRemaining: number | null;
  blocks: Block[];
  isSoftwareBlockPast: boolean;
}
