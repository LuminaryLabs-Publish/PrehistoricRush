# Known Gaps: PrehistoricRush Coordinated Run Reset

**Updated:** `2026-07-12T16-11-48-04-00`

## Implemented reset pieces

```txt
product RunState replacement and runId increment
product InputState replacement
Core Simulation resolution reset
RunStarted event and direct scene transition
camera-follow reset
active-content rebuild from current active patch map
patch-controller reset API
Core capability reset APIs
Worker-executor disposal API
public snapshots for game, simulation, motion, physics, stream and camera
```

## Primary current gap

```txt
no restart command envelope or expected-run admission
Enter restarts even during active gameplay
no reset transaction ID
no cross-domain run generation
no required-participant prepare barrier
no atomic commit or rollback
no Core Motion reset call
no Core Physics body/request/frame reset result
no articulated-motion or articulated-dynamics reset result
no patch-controller preserve/clear policy result
no Worker request generation barrier
no active-content/collider reset revision
no renderer reset policy or receipt
no coherent public reset result
no first-visible-new-run frame acknowledgement
```

## Concrete consequences

```txt
an active run can be erased by pressing Enter
rapid Enter events can advance multiple runIds between visible frames
new product state can coexist with predecessor motion and physics frames
old asynchronous patch work can resolve after a new run begins
camera can reset before all simulation and content participants align
public readback can combine multiple run generations
partial participant failure has no rollback boundary
restart and terminal disposal responsibilities remain interleaved in the browser host
```

## Policy ambiguity

The current implementation does not classify restart behavior as:

```txt
phase-admitted or phase-rejected
initial start, terminal retry, run-again or quick restart
idempotent or duplicate
cache-clearing or cache-preserving
inflight-work-cancelling or generation-fencing
renderer-time-resetting or renderer-time-preserving
fully committed, partially committed or rolled back
visible or awaiting first frame
```

## Reset participant ambiguity

```txt
Core Simulation resetResolution() does not prove complete simulation reset
Core Motion retains current intent/frame history unless explicitly reset
Core Physics has no product-level restart receipt for body and frame state
articulation state is not tied to the new run generation
patch-controller reset() exists but is not invoked
Worker executor dispose() exists but is terminal and not a reusable restart policy
active content is rebuilt before one committed stream/content revision exists
camera reset is explicit but not linked to other participant revisions
renderer and HUD expose no reset transaction or visible-frame result
```

## Retained architecture gaps

```txt
Core Physics requests still do not cite the authorizing Core Motion frame
articulated solving is not called by production game or creator render paths
pose schema and rig binding remain unimplemented
streamed content and committed outcomes lack one shared active-content revision
browser input command authority remains incomplete
render-surface and frame correlation remains incomplete
creator draft, commit and frame proof remains incomplete
stream cadence and world readiness remain host-managed
raw PrehistoricRushHost exposes mutable owners
ordered runtime disposal remains absent
```

## Required fixtures

```txt
Enter during active run returns a typed zero-mutation rejection
terminal retry creates exactly one new run generation
rapid repeat produces at most one reset transaction
all required participant results cite one reset transaction
simulation, motion, physics and articulation reach compatible revisions
patch-controller clear/preserve policy is explicit and deterministic
predecessor Worker response is rejected or admitted only to immutable cache
active content and collider sets share the new run generation
failed prepare produces zero public commit
failed commit rolls back or reports a terminal fault
public readback never presents a mixed generation as committed
first visible frame cites the committed RunRestartResult
browser and deployed Pages behavior match
```

## Proof warning

A new `runId`, reset camera or origin-position frame does not prove coordinated reset. Completion requires phase admission, participant prepare/commit results, stale-work rejection, coherent readback and a visible-frame acknowledgement for one shared run generation.