# Known Gaps: PrehistoricRush

**Updated:** `2026-07-12T09-01-44-04-00`

## Implemented advance

```txt
core-simulation installed
run state, pickups and goal submitted as proposals
Rapier and fallback collision submitted as observations
one product resolution policy selects continue/fail/win
collision beats goal and rejects pickups
unique pickups commit before a non-collision goal
state patch, events and transition commit together
pure Node policy test exists
Nexus Engine runtime pins corrected across game and creator hosts
```

## Primary current gap

```txt
game.start mutates outside authoritative TickContext
no start command ID or run epoch
no predecessor commit admission
no cross-consumer prepare/commit/rollback
no physics reset result
no stream/Worker reset or adoption result
no active-content/collider reset revision
no first committed tick or visible-frame receipt
public readback can temporarily mix new run state with predecessor evidence
```

## Concrete bypass

```txt
browser button/Enter/Space
  -> game.start()
  -> resetResolution()
  -> replace RunState/InputState
  -> emit RunStarted
  -> direct scene transition
  -> host content refresh
  -> host streaming update/prime
  -> host camera reset
  -> next engine tick later
```

## Retained gaps

```txt
runtime-module admission fingerprint incomplete
browser input command authority incomplete
render-surface/frame correlation incomplete
profile/creator commit proof incomplete
release/activation materialization still rebuilds complete active content
stream cadence and world readiness remain host-managed
collider/content revisions and rollback remain absent
raw PrehistoricRushHost exposes mutable owners
coordinated Worker/stream/physics/frame reset remains absent
ordered runtime disposal remains absent
```

## Required fixtures

```txt
initial boot and retry use the same start transaction
duplicate start commands are idempotent
participant failure rolls back
stale Worker/stream results are rejected
physics body, content, camera and scene cite one run epoch
first committed tick and visible frame cite the epoch
public readback never mixes epochs
browser and deployed Pages behavior match
```

Do not treat the pure resolution-policy test as proof that initial start, restart, physics, streaming, rendering or public readback are transactionally coherent.
