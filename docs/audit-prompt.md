# Cadence — Audit Prompt

Run a checkpoint audit at the end of each phase before opening a PR.
Paste this standing prompt into a fresh Claude Code session, then append
the phase-specific block below.

---

## Standing Audit Prompt

You are auditing the Cadence codebase at a phase checkpoint. Cadence is a
personal daily schedule dashboard built with React + Vite + TypeScript.

Read `CLAUDE.md` and `/docs/roadmap.md` in full before proceeding.

Audit the codebase against the following standing checklist. For each
item, report: ✅ Pass, ⚠️ Warning (works but could be better), or
❌ Fail (must be fixed before PR). Add a one-line note for any non-pass.

### Standing Checklist

**Architecture**
- [ ] No scheduling or business logic inside React components
- [ ] No `localStorage` access outside `/src/lib/storage.ts`
- [ ] No hardcoded time strings outside `/src/config/schedule.ts`
- [ ] No React imports in `/src/lib/`
- [ ] `/src/config/` contains only static data — no functions, no logic

**TypeScript**
- [ ] `npm run typecheck` passes with zero errors
- [ ] No `any` used without an inline justification comment
- [ ] All functions in `/src/lib/` and `/src/hooks/` have explicit return
      types
- [ ] No new types defined outside `/src/types/`

**Testing**
- [ ] `npm run test` passes with zero failures and zero skipped tests
- [ ] Every exported function in `/src/lib/` has at least one test
- [ ] Storage tests mock `localStorage` via `vi.stubGlobal` — not real
      browser storage

**Code quality**
- [ ] No default exports except `App` and Vite config
- [ ] No inline TODO comments that should be tracked issues
- [ ] No commented-out code blocks
- [ ] No unused imports

**CI / deployment**
- [ ] `npm run lint` passes
- [ ] GitHub Actions CI passes on the current branch
- [ ] Vercel preview deployment is live and renders without console errors

---

## Phase-Specific Additions

### §CP1 — Phase 1: Foundation

Audit these additional items after the standing checklist:

**Types (`/src/types/schedule.ts`)**
- [ ] All types from the Phase 1.2 spec are present and correctly shaped
- [ ] `Block.isSoftwareBlock` is present and typed `boolean`
- [ ] `WeeklyRotation.weekKey` is present and typed `string`

**Schedule config (`/src/config/schedule.ts`)**
- [ ] `SCHEDULES.A` has 12 blocks matching the Phase 1.3 table exactly
- [ ] `SCHEDULES.B` has 13 blocks matching the Phase 1.3 table exactly
- [ ] All `startMinute`/`endMinute` values are correct (spot-check:
      7:10am → 430, 8:15am → 495, 12:30pm → 750, 4:45pm → 1005,
      9:30pm → 1290)
- [ ] Exactly one block per schedule has `isSoftwareBlock: true`
      (`software-transition`)
- [ ] `afternoon-work` ends at minute 1005 (4:45pm) in Type A and
      minute 1010 (4:50pm) in Type B — not 1020 (5:00pm)
- [ ] `STORAGE_KEYS.rotation` is a function, not a string

**Library functions (`/src/lib/`)**
- [ ] `getCurrentBlock` returns `null` before 7:00am and after 11:00pm
- [ ] `deriveScheduleState` returns correct `minutesRemaining`
- [ ] `storageGet` returns `null` (not throws) on malformed JSON
- [ ] `toWeekKey` returns a Monday-anchored ISO week key

---

### §CP2 — Phase 2–3: Core UI + Rotation

Audit these additional items after the standing checklist:

**Hooks**
- [ ] `useNow` updates no more frequently than every 30 seconds
- [ ] `useDayType` reads from and writes to `STORAGE_KEYS.dayType`
- [ ] `useBlockLog` correctly filters completions by today's date
- [ ] `useRotation` resets to empty entries when `weekKey` changes

**Components**
- [ ] `CurrentBlockCard` handles `currentBlock === null` gracefully
- [ ] `DayTypeSelector` reflects persisted state on page load
- [ ] No component accesses `localStorage` directly
- [ ] No component calls scheduler functions directly — goes through hooks

**Rotation**
- [ ] Weekly rotation resets on Monday (test with a mocked date)
- [ ] `prep` and `project` counts are correct given a sample entry set

---

### §CP3 — Phase 4: Weekly Review

Audit these additional items after the standing checklist:

- [ ] Weekly review is read-only — no mutations from review components
- [ ] Review data is derived from the same `localStorage` keys as Phase
      2–3, not a separate store
- [ ] Streak calculation handles gaps (non-consecutive days) correctly

---

### §CP4 — Phase 5: Backend Sync

Audit these additional items after the standing checklist:

- [ ] `storageGet`/`storageSet` in `/src/lib/storage.ts` are the only
      call sites changed — hooks and components are unmodified
- [ ] API calls have explicit error handling — no unhandled promise
      rejections
- [ ] Optimistic updates (if used) have a rollback path on failure
- [ ] No API keys or secrets committed to the repository