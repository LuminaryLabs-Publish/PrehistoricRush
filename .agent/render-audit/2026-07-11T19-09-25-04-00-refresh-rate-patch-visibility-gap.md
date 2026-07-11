# Render Audit: Refresh-Rate Patch Visibility Gap

**Timestamp:** `2026-07-11T19-09-25-04-00`

## Summary

Visible terrain, trees, grass and pickups become available through a ready-patch activation limit of one patch per RAF. The wall-clock time required to make an equal ready backlog visible therefore changes with display cadence.

## Plan ledger

**Goal:** require visible world publication to cite elapsed-time activation policy and cadence revision.

- [x] Trace ready-patch activation into Three consumers.
- [x] Confirm activation maximum is per RAF invocation.
- [x] Compare maximum activation rates at 30/60/120 Hz.
- [x] Identify missing render/cadence evidence.
- [ ] Add executable render parity fixtures.

## Current render path

```txt
controller readyQueue
  -> takeReadyPatches({ maximum: 1 })
  -> adapter.activatePatch(entry, state)
  -> activePatches.set
  -> terrain geometry mutation
  -> tree batch replace and flush
  -> grass/pickup/collider rebuild
  -> renderer.render(scene, camera)
```

## Concrete visibility difference

For a ready backlog of 24 patches after the synchronously primed center patch:

```txt
30 Hz theoretical minimum drain time: 0.80 seconds
60 Hz theoretical minimum drain time: 0.40 seconds
120 Hz theoretical minimum drain time: 0.20 seconds
```

This ignores Worker latency and assumes one activation on every RAF. It demonstrates that the activation policy is frame-count based rather than wall-time based.

## Missing render evidence

```txt
cadenceRevision
activationBudgetSeconds
activationWorkSpent
readyBacklogCount
oldestReadyAge
patchActivationRevision
renderConsumerRevision
firstFrameShowingPatchId
visibleCadenceFrameReceipt
```

## Risks

```txt
low-refresh clients display sparse or late world content for longer wall time
camera and collision may advance while visible activation drains slowly
hidden-tab ready backlog appears over multiple resumed frames without a declared plan
HUD reports patch counts but not backlog age or cadence pressure
host renderer string does not prove which patch revision was visible
```

## Required render contract

```txt
ActivationPlan
  -> admitted ready patch IDs
  -> elapsed-time budget and hard frame ceiling
  -> detached consumer preparation
  -> atomic patch render commit
  -> render submission
  -> first frame acknowledgement carrying cadence and patch revisions
```

## Fixture gate

```txt
same ready backlog at 30/60/120 Hz reaches equivalent wall-time visibility
required-route patches activate before prefetch patches
hidden-tab resume does not publish a mixed-generation frame
HUD and host cite the same ready backlog and visible patch revision
```