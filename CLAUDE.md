# CLAUDE.md

## Project Overview
**Cadence** is a personal daily schedule dashboard for a software engineer
in career transition. It answers one question at any moment: *what block am
I in, and what's next?* It also tracks the weekly software transition
rotation (interview prep vs. project work) and logs block completions so
the week can be reviewed.

For current project state, active phase, and phase specs, see
`/docs/roadmap.md`.

---

## Tech Stack
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS
- **State:** React context + `useReducer` (no external state library for MVP)
- **Persistence:** `localStorage` (MVP); backend sync is Phase 3
- **Testing:** Vitest + React Testing Library
- **Deployment:** Vercel (auto-deploy from `main`)
- **CI:** GitHub Actions (`lint`, `typecheck`, `test` on every push)

---

## Project Structure

```
/src
  /components         → UI components (presentational where possible)
    /blocks           → Block-related components
    /rotation         → Software rotation tracker components
    /layout           → Shell, header, layout primitives
  /config
    schedule.ts       → Static schedule definition (day types, blocks, anchors)
    constants.ts      → App-wide constants (rotation targets, storage keys)
  /hooks
    useNow.ts         → Current time, updates every 30s
    useSchedule.ts    → Derives current block + next block from time + day type
    useDayType.ts     → Day type (A/B) selection and persistence
    useRotation.ts    → Weekly software rotation state + persistence
    useBlockLog.ts    → Block completion log + persistence
  /lib
    scheduler.ts      → Pure fns: derive current block, next block, block list
    storage.ts        → localStorage read/write wrappers (typed)
    timeUtils.ts      → Pure time utilities (minute-of-day, overlap, format)
  /types
    schedule.ts       → Block, DayType, BlockLog, RotationEntry, WeeklyRotation
  /tests
    /lib              → Vitest unit tests mirroring /lib
    /hooks            → Hook tests using renderHook
/docs
  roadmap.md          → Project state, phases, specs
  audit-prompt.md     → Standing audit prompt + phase-specific additions
  spec-template.md    → Template for handing work to Claude Code agents
/public
  favicon.svg
CLAUDE.md             → This file
```

---

## Data Flow

```
Static config (schedule.ts)
  + Current time (useNow)
  + Day type selection (useDayType)
  → useSchedule → current block, next block, block list for today

User actions (mark complete, set day type, log rotation)
  → useBlockLog / useRotation / useDayType
  → localStorage (via storage.ts wrappers)
  → re-render
```

---

## Architecture Principles

### Separation of concerns
- **`/config`** — static data only. No logic, no imports from `/lib`.
- **`/lib`** — pure functions only. No React, no side effects, no storage.
  `scheduler.ts` and `timeUtils.ts` must be fully testable without a DOM.
- **`/hooks`** — compose config + lib + React state + storage. One concern
  per hook. Hooks are the only layer that touches `localStorage` (via
  `storage.ts`).
- **`/components`** — consume hooks and render. No business logic inline.
  No direct `localStorage` access in components.

This separation is a hard rule. It keeps every layer independently
testable and makes the architecture legible in code review.

### Pure functions first
Any logic that does not need React state or side effects must live in
`/lib` as a pure function with a corresponding Vitest test. This includes
all block-derivation logic, time utilities, and storage serialization.

---

## TypeScript Conventions
- `strict: true` in `tsconfig.json`. No exceptions.
- No `any`. Define the type or ask for clarification.
- All schedule and state shapes typed in `/types/schedule.ts`.
- Avoid type assertions (`as`) unless unavoidable; comment why when used.

---

## Coding Conventions
- Named exports throughout. No default exports except for the root `App`
  component and Vite config.
- `const` arrow functions for utilities and hooks.
- `function` declarations for React components.
- Prefer explicit return types on all functions in `/lib` and `/hooks`.
- All `localStorage` access must go through `/lib/storage.ts` — never
  inline in components or hooks.
- No hardcoded time strings outside `/config/schedule.ts`.

---

## Schedule Model
The schedule has two day types:
- **Type A — WFH** (1–2× per week): 7:00am–11:00pm, 10 blocks
- **Type B — In-office** (3–4× per week): 7:00am–11:00pm, 11 blocks

Day type is set manually by the user each morning (or persisted from the
prior day as a default). There is no automatic detection.

The software transition block runs 7:10–8:15 (Type A) or 7:10–8:10
(Type B). It is the only block tracked by the rotation system.

See `/config/schedule.ts` for the full block definitions.

---

## Rotation System
The weekly software transition rotation target is **3× interview
prep/system design : 2× project work** per week (Mon–Sun).

`useRotation` tracks:
- Sessions completed this week (with type: `'prep'` or `'project'`)
- Resets automatically on Monday

The rotation state is persisted to `localStorage` keyed by ISO week
string (e.g. `'rotation-2026-W27'`).

---

## Storage Keys
All `localStorage` keys are defined as constants in
`/config/constants.ts`. Never use string literals for storage keys
outside that file.

---

## Testing Requirements
- Every function in `/lib` must have a Vitest unit test.
- `scheduler.ts` tests must cover: current block at various times,
  edge cases at block boundaries, no active block (before 7am / after
  11pm), and correct next-block derivation.
- `timeUtils.ts` tests must cover all exported utilities.
- `storage.ts` tests must mock `localStorage` and cover read, write,
  missing key, and malformed JSON.
- Hook tests use `renderHook` from React Testing Library and mock
  `localStorage` via `vi.stubGlobal`.
- Component tests are not required for MVP but are welcome.

---

## Git Workflow
Follows global conventions in `~/.claude/CLAUDE.md` (Conventional
Commits, branch naming, PR size target). Project-specific scopes:

`feat(config):`, `feat(scheduler):`, `feat(hooks):`, `feat(components):`,
`fix(storage):`, `test(scheduler):`, etc.

---

## What Claude Should Do
- Reference `/types/schedule.ts` before creating any new data structures.
- Reference `/config/schedule.ts` before writing any scheduling logic.
- Write Vitest tests for every function added to `/lib`.
- Keep components thin — if logic creeps in, extract it to `/lib` or a
  hook.
- When the day type or rotation state shape is ambiguous, ask.

## What Claude Should NOT Do
- Do not write scheduling logic inside components or hooks — it belongs
  in `/lib/scheduler.ts`.
- Do not access `localStorage` directly outside `/lib/storage.ts`.
- Do not hardcode block times outside `/config/schedule.ts`.
- Do not use `any`.
- Do not add external state management libraries (Redux, Zustand, etc.)
  in Phase 1 or 2 — the hook + context pattern is sufficient.

---

## Checkpoint Audits
Before opening a PR at the end of any phase, prompt for a checkpoint
audit. The standing audit prompt and phase-specific additions are in
`/docs/audit-prompt.md`. The audit schedule is in `/docs/roadmap.md`.
