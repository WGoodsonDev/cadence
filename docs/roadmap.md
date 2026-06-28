# Cadence — Project Roadmap

This document covers project state and phase specs. For conventions, coding
standards, architecture rules, and the schedule model, see `CLAUDE.md`.

**Read before starting any session:**
1. `CLAUDE.md` — conventions and rules
2. This file — current phase and what's built
3. Phase-specific reference files listed in the active phase spec below

---

## Status Legend

- ✅ Complete
- 🔄 In Progress
- ⬜ Pending

---

## Current Status

**Active phase:** Phase 2 — Core UI ⬜
**Tests passing:** 36 (Phase 1 lib functions)
**Known constraints:** Vitest 3.x required (2.x bundles Vite 5, conflicting with top-level Vite 6)

---

## Confirmed Codebase (end of Phase 0)

No application code yet. Scaffold documents produced:

```
CLAUDE.md
/docs/
  roadmap.md          ← this file
  audit-prompt.md
  spec-template.md
```

---

## Phase History

### Phase 1 — Foundation ✅
All 5 sub-tasks complete. 36 tests passing. CI green. Vercel live.

### Phase 0 — Project Setup ✅
Produced `CLAUDE.md`, `roadmap.md`, `docs/audit-prompt.md`,
`docs/spec-template.md` before any code. Architecture decisions
documented in `CLAUDE.md`.

---

## Phase 1 — Foundation 🔄

### Reference files
- `CLAUDE.md` — conventions, architecture, storage model
- `/docs/roadmap.md` — this file

### Goal
Scaffold the Vite + React + TypeScript project, establish the full
directory structure, define all types, write the static schedule config,
implement and test the pure library functions, and get CI running. No UI
beyond a placeholder. Everything built in this phase is the load-bearing
foundation — it must be correct before UI is added.

---

### 1.1 — Project Scaffold

**Task:** Initialize the Vite + React + TypeScript project with Tailwind,
Vitest, and Vercel deployment configured.

**Deliverables:**
- `vite.config.ts` — Vitest configured inline
- `tsconfig.json` — `strict: true`, path aliases for `@/` → `src/`
- `tailwind.config.ts` — content paths set
- `eslint.config.js` — TypeScript-aware, React rules
- `.github/workflows/ci.yml` — runs `lint`, `typecheck`, `test` on push
  to any branch; `test` also runs on PRs targeting `main`
- `vercel.json` — SPA fallback (`rewrites: [{ source: '/(.*)',
  destination: '/index.html' }]`)
- Full directory skeleton (empty `index.ts` barrel files where needed):
  `/src/components/blocks/`, `/src/components/rotation/`,
  `/src/components/layout/`, `/src/config/`, `/src/hooks/`,
  `/src/lib/`, `/src/types/`, `/src/tests/lib/`, `/src/tests/hooks/`
- `src/App.tsx` — placeholder ("Cadence — loading...")
- `src/main.tsx` — standard Vite entry

**Acceptance criteria:**
- [x] `npm run dev` starts without errors
- [x] `npm run typecheck` passes
- [x] `npm run lint` passes
- [x] `npm run test` runs (0 tests, no failures)
- [x] Pushing to `main` triggers CI and all jobs pass
- [x] Vercel preview deployment succeeds

---

### 1.2 — Types

**Task:** Define all core TypeScript types in `/src/types/schedule.ts`.

**Types to define:**

```typescript
// Day type: WFH (A) or in-office (B)
export type DayType = 'A' | 'B';

// A single time block in the schedule
export interface Block {
  id: string;           // unique, stable, kebab-case e.g. 'software-transition'
  label: string;        // display name e.g. 'Software Transition'
  startMinute: number;  // minutes from midnight e.g. 7:10am → 430
  endMinute: number;    // minutes from midnight e.g. 8:15am → 495
  notes?: string;       // optional note shown in UI
  isSoftwareBlock: boolean; // true for the one block tracked by rotation
}

// The full schedule for one day type
export interface DaySchedule {
  dayType: DayType;
  blocks: Block[];
}

// A logged completion of a block
export interface BlockCompletion {
  blockId: string;
  completedAt: string;  // ISO 8601
  date: string;         // 'YYYY-MM-DD'
}

// One entry in the software rotation log
export type RotationSessionType = 'prep' | 'project';

export interface RotationEntry {
  date: string;              // 'YYYY-MM-DD'
  sessionType: RotationSessionType;
  loggedAt: string;          // ISO 8601
}

// The full rotation state for a given week
export interface WeeklyRotation {
  weekKey: string;           // ISO week string e.g. '2026-W27'
  entries: RotationEntry[];
}

// Derived state from useSchedule
export interface ScheduleState {
  currentBlock: Block | null;   // null if before first block or after last
  nextBlock: Block | null;      // null if currentBlock is the last
  minutesRemaining: number | null;
  blocks: Block[];              // all blocks for the active day type
}
```

**Acceptance criteria:**
- [ ] All types exported from `/src/types/schedule.ts`
- [ ] `npm run typecheck` passes with no errors
- [ ] No logic in this file — types only

---

### 1.3 — Static Schedule Config

**Task:** Implement the full schedule definition in
`/src/config/schedule.ts` and app constants in
`/src/config/constants.ts`.

**`/src/config/schedule.ts`:**

Define `SCHEDULE_A` and `SCHEDULE_B` as `DaySchedule` objects containing
the full block list for each day type, derived from the schedule in
`CLAUDE.md`. All times as `startMinute`/`endMinute` (minutes from
midnight). The software transition block must have `isSoftwareBlock: true`;
all others `false`.

Export a `SCHEDULES: Record<DayType, DaySchedule>` lookup.

**Day Type A — WFH blocks:**

| id | label | Start | End |
|----|-------|-------|-----|
| `wake-intention` | Wake + Intention | 7:00 | 7:10 |
| `software-transition` | Software Transition | 7:10 | 8:15 |
| `get-ready-breakfast` | Get Ready + Breakfast | 8:15 | 9:00 |
| `workday-startup` | Workday Startup | 9:00 | 9:15 |
| `deep-work` | Deep Work | 9:15 | 12:30 |
| `lunch` | Lunch | 12:30 | 13:15 |
| `afternoon-work` | Afternoon Work | 13:15 | 16:45 |
| `workday-shutdown` | Workday Shutdown | 16:45 | 17:00 |
| `movement` | Movement | 17:00 | 18:00 |
| `solo-intentional-hour` | Solo Intentional Hour | 18:00 | 19:00 |
| `dinner-partner-time` | Dinner + Partner Time | 19:00 | 21:30 |
| `wind-down` | Wind Down | 21:30 | 23:00 |

**Day Type B — In-office blocks:**

| id | label | Start | End |
|----|-------|-------|-----|
| `wake-intention` | Wake + Intention | 7:00 | 7:10 |
| `software-transition` | Software Transition | 7:10 | 8:10 |
| `commute-out` | Commute | 8:27 | 9:10 |
| `workday-startup` | Workday Startup | 9:10 | 9:20 |
| `deep-work` | Deep Work | 9:20 | 12:30 |
| `lunch` | Lunch | 12:30 | 13:15 |
| `afternoon-work` | Afternoon Work | 13:15 | 16:50 |
| `workday-shutdown` | Workday Shutdown | 16:50 | 17:00 |
| `commute-home` | Commute Home | 17:00 | 17:45 |
| `arrive-decompress` | Arrive + Decompress | 17:45 | 18:00 |
| `solo-intentional-hour` | Solo Intentional Hour | 18:00 | 19:00 |
| `dinner-partner-time` | Dinner + Partner Time | 19:00 | 21:30 |
| `wind-down` | Wind Down | 21:30 | 23:00 |

**`/src/config/constants.ts`:**

```typescript
export const ROTATION_TARGETS = {
  prep: 3,
  project: 2,
} as const;

export const STORAGE_KEYS = {
  dayType: 'cadence-day-type',
  blockLog: 'cadence-block-log',
  rotation: (weekKey: string) => `cadence-rotation-${weekKey}`,
} as const;

export const WEEK_START_DAY = 1; // Monday
```

**Acceptance criteria:**
- [ ] `SCHEDULES.A` and `SCHEDULES.B` contain the correct blocks
- [ ] All times are correct minutes-from-midnight values
- [ ] Exactly one block per schedule has `isSoftwareBlock: true`
- [ ] `npm run typecheck` passes

---

### 1.4 — Pure Library Functions

**Task:** Implement all pure utility functions in `/src/lib/`.

**`/src/lib/timeUtils.ts`:**

```typescript
// Returns minutes elapsed since midnight for a given Date
export const minuteOfDay = (date: Date): number => { ... }

// Returns 'YYYY-MM-DD' string for a given Date
export const toDateString = (date: Date): string => { ... }

// Returns ISO week key e.g. '2026-W27' for a given Date
// Week starts Monday per WEEK_START_DAY
export const toWeekKey = (date: Date): string => { ... }

// Formats a minute-of-day as 'H:MMam/pm' e.g. 430 → '7:10am'
export const formatMinute = (minute: number): string => { ... }

// Returns minutes remaining until endMinute from currentMinute
export const minutesUntil = (currentMinute: number, endMinute: number): number => { ... }
```

**`/src/lib/scheduler.ts`:**

```typescript
import type { Block, DaySchedule, ScheduleState } from '@/types/schedule';

// Returns the block active at currentMinute, or null
export const getCurrentBlock = (
  blocks: Block[],
  currentMinute: number
): Block | null => { ... }

// Returns the next block after currentBlock, or null if last/none
export const getNextBlock = (
  blocks: Block[],
  currentBlock: Block | null
): Block | null => { ... }

// Derives full ScheduleState from a DaySchedule and current time
export const deriveScheduleState = (
  schedule: DaySchedule,
  now: Date
): ScheduleState => { ... }
```

**`/src/lib/storage.ts`:**

```typescript
// Reads and JSON-parses a localStorage value; returns null on missing or
// malformed JSON (never throws)
export const storageGet = <T>(key: string): T | null => { ... }

// JSON-serializes and writes a value to localStorage
export const storageSet = <T>(key: string, value: T): void => { ... }

// Removes a key from localStorage
export const storageRemove = (key: string): void => { ... }
```

**Acceptance criteria:**
- [ ] All functions have explicit return types
- [ ] No React imports anywhere in `/src/lib/`
- [ ] No `localStorage` access outside `storage.ts`
- [ ] `npm run test` passes all tests written in 1.5

---

### 1.5 — Tests for Library Functions

**Task:** Write Vitest tests for all `/src/lib/` functions.

**`/src/tests/lib/timeUtils.test.ts`:**
- `minuteOfDay`: midnight → 0, 7:10am → 430, noon → 720, 11:59pm → 1439
- `toDateString`: returns correct `'YYYY-MM-DD'` format
- `toWeekKey`: returns correct ISO week key; correctly handles
  Monday as week start; week rollover at Sunday midnight
- `formatMinute`: 0 → `'12:00am'`, 430 → `'7:10am'`, 720 → `'12:00pm'`,
  810 → `'1:30pm'`
- `minutesUntil`: basic case, zero remaining, current past end

**`/src/tests/lib/scheduler.test.ts`:**
- `getCurrentBlock`: returns correct block mid-block; returns null before
  first block; returns null after last block; returns correct block at
  exact start boundary; returns correct block 1 min before end boundary
- `getNextBlock`: returns next block when current is not last; returns null
  when current is last block; returns first block when current is null and
  time is before schedule start
- `deriveScheduleState`: full integration — correct current + next + 
  minutesRemaining at a mid-session time; null current before 7am;
  correct final block with null next

**`/src/tests/lib/storage.test.ts`:**
- `storageGet`: returns parsed value for existing key; returns null for
  missing key; returns null for malformed JSON (no throw)
- `storageSet`: value is retrievable after set; overwrites existing value
- `storageRemove`: key is absent after remove; no-op on missing key

All storage tests must mock `localStorage` via `vi.stubGlobal` — do not
use real browser storage.

**Acceptance criteria:**
- [ ] All tests pass (`npm run test`)
- [ ] No test imports from `/src/components` or `/src/hooks`
- [ ] Storage tests use `vi.stubGlobal` for `localStorage`

---

### Phase 1 Verification Checklist

- [ ] `npm run dev` — app loads, placeholder renders
- [ ] `npm run typecheck` — zero errors
- [ ] `npm run lint` — zero errors
- [ ] `npm run test` — all tests pass, no skipped
- [ ] CI passes on push to `main`
- [ ] Vercel preview deployment is live
- [ ] No logic in `/src/config/` — static data only
- [ ] No React imports in `/src/lib/`
- [ ] No `localStorage` access outside `/src/lib/storage.ts`
- [ ] Every exported function in `/src/lib/` has a test

---

## Phase 2 — Core UI ⬜

### Goal
Build the primary dashboard: current block display, next block preview,
day type selector, and block completion logging. This is the MVP — the
thing that gets opened every morning.

### Planned components
- `CurrentBlockCard` — large display of active block, time remaining,
  progress bar
- `NextBlockPreview` — compact "up next" display
- `DayTypeSelector` — toggle between Type A and Type B, persisted
- `BlockList` — scrollable list of today's blocks with completion status
- `Layout` / `Header` — shell

### Planned hooks
- `useNow` — current time, updates every 30s
- `useSchedule` — derives `ScheduleState` from `useNow` + active day type
- `useDayType` — day type selection + `localStorage` persistence
- `useBlockLog` — block completion log + `localStorage` persistence

### Not in Phase 2
- Rotation tracker (Phase 3)
- Weekly review (Phase 4)
- Backend sync (Phase 5)

---

## Phase 3 — Rotation Tracker ⬜

### Goal
Add the software transition rotation tracker: log each morning's session
as `prep` or `project`, display weekly progress toward the 3:2 target,
and auto-reset on Monday.

### Planned components
- `RotationTracker` — weekly summary (prep: X/3, project: Y/2)
- `LogSessionButton` — appears after software transition block completes;
  prompts for session type

### Planned hooks
- `useRotation` — weekly rotation state + localStorage persistence +
  Monday reset logic

---

## Phase 4 — Weekly Review ⬜

### Goal
Add a lightweight end-of-week view: blocks completed, rotation summary,
streaks. Read-only. Data already captured by Phase 2–3 persistence.

---

## Phase 5 — Backend Sync ⬜

### Goal
Replace `localStorage` with a lightweight backend (likely a Vercel
serverless function + Planetscale or Supabase). Enables cross-device
access. Natural architectural conversation piece: the storage abstraction
in `/lib/storage.ts` makes this a layer swap rather than a rewrite.

### Note for portfolio
The `storage.ts` abstraction is intentionally designed for this upgrade.
The `storageGet`/`storageSet` interface can be re-implemented against a
fetch-based API without touching hooks or components.

---

## Checkpoint Audit Schedule

| Phase | Description     | Audit prompt section |
|-------|-----------------|----------------------|
| 1     | Foundation      | `audit-prompt.md` §CP1 |
| 2     | Core UI         | `audit-prompt.md` §CP2 |
| 3     | Rotation        | `audit-prompt.md` §CP2 |
| 4     | Weekly Review   | `audit-prompt.md` §CP3 |
| 5     | Backend Sync    | `audit-prompt.md` §CP4 |

Paste the standing audit prompt from `audit-prompt.md`, append the
phase-specific block, and run it in a fresh Claude Code session before
beginning the next phase.