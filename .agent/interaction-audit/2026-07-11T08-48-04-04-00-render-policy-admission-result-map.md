# Interaction Audit: Render Policy Admission and Result Map

**Timestamp:** `2026-07-11T08-48-04-04-00`

## Summary

The user-facing controls mutate run input, but visual policy is admitted implicitly during startup. No command or result identifies whether the requested source graph and render policy were accepted, rejected, degraded or partially bound.

## Plan ledger

**Goal:** define typed admission and result surfaces for startup, restart and visual-policy changes without exposing mutable renderer owners.

- [x] Inventory browser commands.
- [x] Trace startup visual construction.
- [x] Identify implicit admissions.
- [x] Define typed commands and terminal results.
- [x] Define public observation constraints.

## Current interaction commands

```txt
Enter / Retry / Run Again
  -> game.start()
  -> streaming prime
  -> camera reset

A / D
  -> steer

W / ArrowUp
  -> boost

Space / button
  -> jump or start

blur
  -> clear input

resize
  -> mutate camera projection and renderer size
```

## Current implicit startup admission

```txt
load module URLs
  -> null-or-module checks
  -> construct runtime
  -> construct visual objects
  -> expose mutable owners
  -> start RAF
```

There is no single command envelope or typed result for the module graph or visual policy.

## Required command

```txt
AdmitVisualPolicyCommand {
  commandId
  runSessionId
  runEpoch
  resourceEpoch
  expectedPolicyRevision
  moduleGraphManifest
  visualPolicyDescriptor
  reason
}
```

## Required result

```txt
VisualPolicyAdmissionResult {
  commandId
  status
  reason
  previousPolicyRevision
  visualPolicyRevision
  moduleGraphFingerprint
  visualPolicyFingerprint
  creatureGeometryHash
  grassPolicyHash
  shadowPolicyHash
  preparedBindings[]
  committedBindings[]
  rollback
  diagnostics[]
  resultFingerprint
}
```

Statuses:

```txt
committed
unchanged
rejected-stale
rejected-invalid
rejected-incompatible
failed-before-prepare
failed-prepared-rolled-back
failed-partial
disposed
```

## Public host direction

Replace mutable owner exposure with additive detached readback:

```txt
PrehistoricRushHost.getSessionObservation()
PrehistoricRushHost.getPatchObservation()
PrehistoricRushHost.getVisualPolicyObservation()
PrehistoricRushHost.getFrameObservation()
PrehistoricRushHost.getResultJournal()
```

Keep mutable engine, adapter, controller, camera and renderer owners private after migration.

## Stale admission

Reject commands when:

```txt
run session differs
run/resource epoch differs
expected policy revision differs
runtime is stopping or disposed
module graph fingerprint is not admitted
descriptor schema is unsupported
consumer bindings are already retired
```

## Interaction-to-frame proof

The command result must be referenceable by the first committed frame that consumes the new policy. A successful admission without a frame receipt is incomplete proof.