# Known Gaps: PrehistoricRush

**Updated:** `2026-07-12T11-11-34-04-00`

## Implemented advance

```txt
Nexus Engine core-simulation installed
run movement, pickups and goal submitted as proposals
Rapier and fallback collision submitted as observations
one product policy commits state, events and optional transition
collision beats goal and same-step pickups
pure outcome-policy test exists
runtime import pins and failure reporting improved
```

## Primary current gap

```txt
engine tick observes the previous host-frame content set
stream release and activation occur after the tick
visible content and physics colliders are replaced before render
no active-content revision links observations, committed outcome and visible frame
```

## Concrete consequences

```txt
released collider may commit failure but be absent from rendered frame
newly activated collider may be visible before collision admission
newly activated pickup may be visible before collection admission
accepted pickup visible removal is host-managed after commit
physics/content synchronization failure has no transaction rollback
public readback exposes independent simulation, physics, patch and renderer snapshots without parity admission
```

## Retained gaps

```txt
run start/restart still bypasses authoritative TickContext
runtime-module admission fingerprint incomplete
browser input command authority incomplete
render-surface/frame correlation incomplete
profile/creator commit proof incomplete
release/activation still rebuilds complete active content
stream cadence and world readiness remain host-managed
raw PrehistoricRushHost exposes mutable owners
coordinated Worker/stream/physics/frame reset remains absent
ordered runtime disposal remains absent
```

## Required fixtures

```txt
released collider cannot produce invisible failure
activated collider is not rendered before outcome admission
activated pickup is not rendered before pickup admission
mixed content revisions are rejected
content/physics participant failure rolls back
stale Worker result cannot mutate newer content revision
committed outcome and first visible frame share one content revision
browser and deployed Pages behavior match
```

Do not treat the pure resolution-policy test as proof of stream/content/collider/pickup parity.
