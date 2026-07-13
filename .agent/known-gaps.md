# Known Gaps: PrehistoricRush Browser Runtime Lifecycle

**Updated:** `2026-07-12T20-10-25-04-00`

## Implemented runtime pieces

```txt
pinned module preflight
Nexus Engine composition
Rapier provider and player body
optional Worker executor
seeded patch controller
camera smooth follow
Three scene and WebGL renderer
terrain, tree, grass, shard and creature presentation
browser keyboard, blur and resize adapters
recursive RAF loop
HTML HUD
public PrehistoricRushHost readback
creature-mesh disposal helper
Worker adapter termination capability
```

## Primary current gap

```txt
no runtime session or generation
no lifecycle state machine
no typed start or stop command/result
no participant lease registry
no partial-startup rollback
no retained RAF handle
no removable browser-listener lease set
no stale callback rejection
no public-host publication/revocation lease
no Worker pending-request shutdown composition
no Worker termination in game lifecycle
no patch-controller retirement result
no engine or physics provider retirement result
no Three-adapter dispose surface
no exact-once geometry/material/skeleton retirement
no renderer-disposed acknowledgement
no bounded retirement journal
no stop-then-reentry proof
```

## Concrete consequences

```txt
frame failure can stop successor scheduling without retiring owned participants
startup failure can leave already-created participants without reverse-order rollback proof
blur clears input but simulation, streaming and rendering remain active
external code can retain raw PrehistoricRushHost participant references
late Worker or browser callbacks have no runtime-generation fence
in-document re-entry cannot prove one Worker, listener set or renderer owner
disposal failures cannot be represented without losing successful retirement results
```

## Render ownership ambiguity

```txt
40 mesh/geometry allocations have no resource-set identity
12 materials have no unique/shared ownership registry
player skeleton has no game-runtime retirement receipt
renderer and internal render resources have no explicit stop ordering
existing disposeCreatureMesh() is not imported by the game page
createThreeAdapter() returns no dispose() method
```

The allocation count is source-backed and does not by itself prove a leak or quantify retained GPU memory.

## Callback ownership ambiguity

```txt
keydown listener function is not retained
keyup listener function is not retained
blur listener function is not retained
resize listener function is not retained
RAF request ID is not retained
frame callback has no runtime-generation admission
main().catch does not supervise later RAF exceptions
```

## Worker and stream ambiguity

```txt
Worker ownership is stored but never retired
executor pending rejection/listener removal/termination services are not called
patch-controller has reset semantics but no page-stop contract
late ready/released patch delivery has no stopped-runtime rejection
active content has no shutdown retirement result
```

## Public capability ambiguity

```txt
PrehistoricRushHost is assigned directly to globalThis
raw engine, physics, adapter, controller and camera objects are exposed
no lifecycle capability policy exists
no revocation or terminal read-only projection exists
stale external references cannot be rejected by generation
```

## Retained architecture gaps

```txt
player profile convergence remains unimplemented
coordinated run reset remains unimplemented
Core Physics/Motion authorization parity remains incomplete
articulated production solving and pose binding remain incomplete
streamed content/outcome parity remains incomplete
browser input authority remains incomplete
render-surface/frame correlation remains incomplete
```

## Required fixtures

```txt
partial startup retires accepted participants in reverse order
normal stop retires every required lease
same stop command returns same result
second stop returns AlreadyStopped
frame exception triggers supervised retirement
pending Worker requests reject on stop
late Worker/browser callbacks perform zero mutation
input and resize listeners are removed
RAF does not schedule after stop
public host is revoked
renderer and all registered render resources retire once
new runtime generation can re-enter cleanly
browser and deployed Pages behavior match
```

## Proof warning

A closed page, missing successor frame, terminated Worker or disposed renderer alone does not prove complete shutdown. Completion requires one terminal result covering all participant leases, rejected late callbacks, public capability revocation and re-entry under a new generation.