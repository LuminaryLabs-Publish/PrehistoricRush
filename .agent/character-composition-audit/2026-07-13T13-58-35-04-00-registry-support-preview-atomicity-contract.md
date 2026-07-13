# Character Composition Audit: Registry, Support and Preview Atomicity

**Timestamp:** `2026-07-13T13-58-35-04-00`

## Goal

Define the exact contract required to keep body, rig, creature, character, player, support placement and visible preview on one composition generation.

## Participant ledger

| Participant | Current mutation | Required preparation evidence |
|---|---|---|
| procedural body | `creatureBody.create(recipe)` | body ID, content hash, local bounds, scale, collision |
| articulated rig | `articulatedMotion.registerRig(rig)` | rig ID, source body hash, support bones, topology hash |
| Core Creature | `register()` or `replace()` | expected revision, typed duplicate/replace policy |
| Core Character | `create()` or `replace()` | expected revision, binding compatibility, pose compatibility |
| Core Player | optional `register()` then `possess()` | expected control/spawn generation, possession receipt |
| support placement | evaluate empty support pose | rig revision, support bone results, clearance policy |
| preview mesh | create/morph/crossfade | topology fingerprint, mesh generation, resource receipt |
| camera framing | bounds plus mesh transform | bounds revision, viewport revision, framing result |
| profile store | delayed patch/reset/distribution | durable profile revision and commit result |

## Current atomicity defects

1. Rig registration precedes every Core registry operation.
2. Creature replacement can publish before character replacement validates.
3. Character replacement can publish before player possession succeeds.
4. The replacement policy is selected by parsing an exception message.
5. Existing character `poseId` and `lifecycleRevision` are copied into a successor descriptor without an explicit rig-compatibility receipt.
6. Support-local Y is calculated after live registry mutation and is retained only in creator-local transition state.
7. Successor mesh preparation occurs after registry adoption.
8. Visible `appliedRevision` is independent from registry revisions.
9. Delayed persistence can invoke a second composition for the same user gesture.
10. No aggregate rollback or observation journal exists.

## Required invariants

```txt
I1: every accepted composition has one AttemptId and CompositionRevision
I2: all candidate references resolve before live adoption
I3: duplicate input changes no participant revision
I4: replacement is a typed policy result, never inferred from message text
I5: rig change requires explicit predecessor-pose compatibility or pose reset
I6: support anchors and presentation bounds cite candidate body/rig revisions
I7: no Core registry publishes a successor unless all registry participants can adopt
I8: creator mesh and framing candidates are prepared before registry adoption
I9: failed adoption preserves all predecessor records and visible resources
I10: only the accepted composition generation may become visibly Ready
I11: stale edit/save/crossfade generations terminate explicitly
I12: durable profile, Core readback and visible frame converge on one profile revision
```

## Snapshot requirements

The composition authority must expose clone-safe bounded readback:

```txt
latestAttempt
acceptedComposition
participantRevisions
supportAnchorReceipt
presentationBoundsReceipt
previewTransition
lastFailure
lastVisibleAck
```

## Failure-injection matrix

```txt
body creation throws
rig validation rejects
rig registration/adoption rejects
creature duplicate/conflict/replace rejects
character reference or binding rejects
player registration rejects
possession rejects
support bone missing
support pose evaluation throws
mesh creation throws
crossfade update throws
camera framing rejects bounds
persistence commit fails
rapid edit supersedes candidate
reset during transition
unload during transition
```

## Completion gate

The system is complete only when each matrix case produces one terminal result, every rejected case preserves the complete predecessor, and accepted cases produce one matching registry/persistence/visible-frame fingerprint.