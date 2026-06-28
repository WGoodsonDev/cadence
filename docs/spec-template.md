# Spec Template

Use this template when handing a task to Claude Code. Fill in every
section before starting a session. Incomplete specs produce inconsistent
output.

---

## Template

```markdown
## Task
[One sentence describing what this task produces or accomplishes.]

## Phase
[Which phase and sub-task this belongs to — e.g. "Phase 1.4 — Pure
Library Functions"]

## Context
[What Claude needs to know before starting. Reference relevant files,
types, or prior work. Example: "The Block and DaySchedule types are
defined in /src/types/schedule.ts. The schedule data is in
/src/config/schedule.ts."]

## Inputs
[What this task receives. Be explicit about types and where they come
from.]

## Outputs
[What this task produces. Be explicit about types, file locations, and
any side effects (e.g. writes to localStorage).]

## Acceptance Criteria
- [ ] [Criterion 1 — specific and verifiable]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Layer Constraints
[Remind Claude which layer this belongs to and what it must not do.
Example: "This is a lib function. It must not import React or access
localStorage directly."]

## Edge Cases to Handle
- [Edge case 1]
- [Edge case 2]

## Do Not
- [Explicit prohibition 1 — repeat anything from CLAUDE.md that is
  especially relevant to this task]
- [Explicit prohibition 2]

## Tests Required
[List the Vitest tests that must be written as part of this task, if
any. For lib functions, list specific cases. For hooks, note that tests
should use renderHook and vi.stubGlobal for localStorage.]
```

---

## Example: `scheduler.ts` Pure Functions

```markdown
## Task
Implement the three pure scheduling functions in `/src/lib/scheduler.ts`.

## Phase
Phase 1.4 — Pure Library Functions

## Context
Block and DaySchedule types are defined in `/src/types/schedule.ts`.
The schedule data (SCHEDULES.A and SCHEDULES.B) lives in
`/src/config/schedule.ts` — do not import it inside scheduler.ts. The
scheduler receives a DaySchedule as a parameter; it does not look up the
schedule itself. Time utilities are in `/src/lib/timeUtils.ts`.

## Inputs
- `getCurrentBlock(blocks: Block[], currentMinute: number): Block | null`
- `getNextBlock(blocks: Block[], currentBlock: Block | null): Block | null`
- `deriveScheduleState(schedule: DaySchedule, now: Date): ScheduleState`

## Outputs
- `/src/lib/scheduler.ts` — three exported pure functions
- `/src/tests/lib/scheduler.test.ts` — Vitest tests per spec

## Acceptance Criteria
- [ ] `getCurrentBlock` returns the active block or null
- [ ] `getNextBlock` returns the next block or null
- [ ] `deriveScheduleState` returns correct ScheduleState including
      minutesRemaining
- [ ] All functions have explicit return types
- [ ] `npm run test` passes all scheduler tests

## Layer Constraints
This is a lib module. It must not import React. It must not import from
`/src/config/` — the schedule is passed as a parameter, not looked up
internally. It must not access localStorage.

## Edge Cases to Handle
- Before 7:00am: currentBlock is null, nextBlock is the first block
- After 11:00pm: both currentBlock and nextBlock are null
- At exact block boundary (startMinute): block is considered active
- 1 minute before end: block is still active

## Do Not
- Do not import SCHEDULES from /src/config/schedule.ts
- Do not use `any`
- Do not add default exports

## Tests Required
Per Phase 1.5 spec in roadmap.md — see §1.5 for full test case list.
```
