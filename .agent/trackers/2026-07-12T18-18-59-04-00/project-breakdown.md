# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-12T18-18-59-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `player-character-profile-commit-convergence-authority-audited`

## Summary

PrehistoricRush stores one procedural-player profile in `localStorage`, distributes updates through both `BroadcastChannel` and `storage` events, debounces creator edits, renders the profile in menu/creator surfaces, and binds one loaded profile into game boot. The current flow has normalization and a numeric revision, but no atomic predecessor check, writer identity, typed commit result, monotonic subscriber admission, navigation flush, or first-visible-profile-frame acknowledgement.

## Plan ledger

**Goal:** make every profile edit, reset, cross-tab delivery and game boot cite one durable profile commit so concurrent tabs cannot lose or regress edits and navigation cannot load a profile that the creator still reports as saving.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Compare the nine eligible repositories with `LuminaryLabs-Dev/LuminaryLabs`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush`, the oldest eligible synchronized repository.
- [x] Trace schema normalization, storage read/write, deep patching, reset, revision assignment and failure boundaries.
- [x] Trace creator draft state, the 160 ms save timer, external updates, reset and navigation.
- [x] Trace menu subscription and game-boot profile consumption.
- [x] Identify the complete interaction loop and all active domains.
- [x] Preserve all 45 implemented, adapted and proof kit surfaces and their services.
- [x] Define profile commit, conflict, convergence, navigation and visible-frame contracts.
- [x] Add the required timestamped tracker and architecture/system audit family.
- [x] Refresh root `.agent` routing and machine-readable registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime implementation and executable multi-tab/navigation fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0
unsynchronized eligible repositories at final selection: 0

PrehistoricRush    2026-07-12T16-20-55-04-00 selected oldest
HorrorCorridor     2026-07-12T16-39-35-04-00
ZombieOrchard      2026-07-12T16-51-47-04-00
MyCozyIsland       2026-07-12T17-10-31-04-00
TheUnmappedHouse   2026-07-12T17-20-42-04-00
AetherVale         2026-07-12T17-35-48-04-00
TheOpenAbove       2026-07-12T17-41-25-04-00
IntoTheMeadow      2026-07-12T17-58-43-04-00
PhantomCommand     2026-07-12T18-11-53-04-00
TheCavalryOfRome   excluded
```

Only `LuminaryLabs-Publish/PrehistoricRush` was modified in the Publish organization.

## Complete interaction loop

```txt
menu boot
  -> load and normalize localStorage profile
  -> render profile revision and material colors
  -> subscribe to BroadcastChannel and storage events
  -> render every admitted event directly

creator boot
  -> load one profile into mutable draft
  -> create controls and preview transition
  -> subscribe to external profile events

creator edit
  -> mutate draft and preview immediately
  -> show Saving
  -> replace one 160 ms timeout
  -> timeout reloads current storage and deep-merges the captured patch
  -> calculate a numeric revision
  -> setItem full profile
  -> publish BroadcastChannel event
  -> notify local listeners

external update
  -> normalize event payload
  -> replace creator draft or menu projection
  -> do not compare revision, commit identity or writer
  -> do not cancel/rebase a pending creator save

reset
  -> cancel pending timer
  -> save normalized defaults as another revision
  -> publish and project the result

navigation
  -> links can leave while save status is Saving
  -> beforeunload disposes only the Three preview
  -> pending save is not synchronously flushed or acknowledged

game boot
  -> load profile once before runtime imports/composition
  -> build engine and procedural creature from that profile
  -> expose profileId and numeric revision in public readback
  -> publish no profile commit/fingerprint or first visible profile frame receipt
```

## Main source-backed findings

### Revision allocation is not atomic

`savePlayerCharacterProfile()` loads the current profile, calculates `max(previous.revision + 1, input.revision)`, then writes the complete profile. Two tabs can read revision `R`, both create `R+1`, and overwrite each other. There is no expected predecessor, compare-and-swap admission, writer identity, command identity, conflict result or durable readback verification.

### Cross-tab delivery is not monotonic

The same logical update can reach subscribers through `BroadcastChannel` and the browser `storage` event. Both paths normalize and emit the payload without event identity, duplicate suppression or a `profile.revision > current.revision` requirement. An older event can therefore replace a newer creator draft or menu projection.

### A pending creator save can overwrite a remote commit

The creator replaces `draft` when a non-local event arrives but does not cancel or rebase the pending 160 ms timer. The timer retains a patch captured from the predecessor draft. When it fires, it deep-merges that stale patch into the latest durable profile and can overwrite fields changed by another tab while publishing a newer numeric revision.

### Navigation can lose a visibly pending edit

The creator shows `Saving` before the timeout fires. `beforeunload` disposes the preview but does not flush the timer, await a storage result or bind navigation to a commit receipt. The game can therefore load the predecessor profile even though the creator just displayed the edited draft.

### Persistence failures have no typed result

`localStorage.setItem()` is not wrapped. Security, quota or serialization failure escapes after the UI and preview have already changed. Callers receive neither a durable/volatile status nor a rollback/retry result.

### Runtime binding is revision-only

The game loads one profile at boot and correctly keeps that profile stable for the session, but it does not identify the exact commit, content fingerprint, writer, storage result or first visible frame generated from that profile.

## Domains in use

```txt
page routing and menu/creator/game shells
player profile schema, defaults, normalization and deep merge
profile identity, numeric revision and wall-clock metadata
localStorage capability, read, full-snapshot write and reset
BroadcastChannel publication and browser storage-event delivery
listener registration and store shutdown
creator mutable draft, controls, debounce timer and save status
creator procedural preview transition and Three render lifecycle
menu profile projection
runtime module admission and game composition
procedural creature descriptor, body generation, rig and rendering
public game readback
Node tests, static Pages deployment and audit tracking

missing:
profile command and writer identity
expected-predecessor admission
atomic revision allocation and conflict result
commit fingerprint and durable readback
monotonic/duplicate-safe delivery
pending-save rebase or cancellation
navigation flush/barrier result
runtime profile-binding receipt
first visible profile-frame acknowledgement
```

## Implemented kits and services

### Nexus Engine root and subdomain kits: 15

| Kit | Services |
|---|---|
| `core-input-kit` | actions, bindings, input state |
| `core-spatial-kit` | transforms, spatial queries |
| `core-scene-kit` | scene registry, transitions, host descriptor |
| `core-physics-kit` | provider, bodies, colliders, motion requests, step, frame |
| `articulated-dynamics-domain-kit` | articulations, joints, motors, ragdoll state, frames, snapshot, reset |
| `core-simulation-kit` | tick context, proposals, observations, resolution, atomic state/event/transition commit, committed frame |
| `core-motion-kit` | movement modes, intents, trajectories, frames, validation, snapshot, reset |
| `articulated-motion-domain-kit` | rigs, poses, targets, IK, pose resolution, frames, snapshot, reset |
| `core-camera-kit` | camera capability |
| `core-animation-kit` | animation capability |
| `core-graphics-kit` | graphics and frame capability |
| `core-skybox-kit` | sky descriptor |
| `core-ui-kit` | UI capability and projection |
| `core-diagnostics-kit` | diagnostics and readback |
| `core-composition-kit` | composition metadata and capability graph |

### Official NexusEngine-Kits: 5

| Kit | Services |
|---|---|
| `seed-kit` | deterministic seed and random streams |
| `procedural-creature-body-kit` | descriptor, geometry, skeleton, skinning, collision, legacy pose and snapshot |
| `instanced-render-batch-kit` | cell replace/release, flush, overflow, bounds and stats |
| `seeded-world-patch-controller-kit` | focus, membership, queue, cache, generation, delivery, eviction, snapshot and reset |
| `camera-smooth-follow-kit` | damping, reset, teleport handling and snapshot |

### Product, page and Worker kits: 14

| Kit | Services |
|---|---|
| `prehistoric-rush-domain-kit` | run resources, input, movement proposals, motion frames, observations, events, transitions, articulation API and snapshot |
| `prehistoric-rush-resolution-policy` | collision/pickup/goal precedence, state patch, events and transition |
| `player-articulation-adapter-kit` | skeleton-to-rig, legacy-pose conversion and quaternion conversion |
| `player-character-schema-kit` | profile defaults, normalization, clamps and deep merge |
| `player-character-profile-store-kit` | load, save, patch, reset, numeric revision and browser distribution |
| `menu-page-kit` | menu shell, profile projection and route links |
| `character-creator-page-kit` | controls, draft, debounce persistence, reset, subscription, preview and navigation |
| `character-preview-transition-kit` | morph, crossfade, legacy-pose damping, revision and disposal |
| `three-procedural-creature-adapter-kit` | skinned mesh, materials, bone lookup, pose application, damping and disposal |
| `game-page-entry-kit` | module preflight, failure projection and game import |
| `drunk-route-generator` | samples, nearest point, progress, classification and snapshot |
| `player-raptor-preset-kit` | creature recipe and collision capsule |
| `prehistoric-patch-generator` | terrain, trees, grass, shards, colliders, bounds and transferables |
| `prehistoric-patch-worker` | initialization, generation, request/error protocol and transfer |

### External and host adapters: 9

| Kit | Services |
|---|---|
| `three-runtime-module` | scene, geometry, materials, instancing, camera, lighting and rendering |
| `rapier-physics-domain-kit` | Nexus physics provider bridge |
| `rapier-runtime-module` | bodies, colliders, queries and world step |
| `message-worker-executor-adapter-kit` | request correlation, generation, pending rejection, listener removal and termination |
| `active-content-consumer-adapter` | terrain, trees, grass, shards, pickups, colliders and height |
| `creator-viewport-framing-adapter` | bounds, target and distance |
| `creator-persistence-scheduler` | timer replacement and delayed profile commit |
| `browser-input-adapter` | keyboard, buttons, keyup, blur, input patch and restart activation |
| `creature-camera-render-host-adapters` | pose application, collision/pickup sampling, camera, HUD and readback |

### Proof kits: 2

| Kit | Services |
|---|---|
| `prehistoric-rush-resolution-policy-test-kit` | continue, win, collision, precedence, pickup idempotency, fallback and serialization proof |
| `player-articulation-test-kit` | rig adaptation, Euler/quaternion conversion and cloneability proof |

```txt
implemented/adapted/proof surfaces: 45
candidate profile-authority kits including parent: 31
```

## Required parent domain

```txt
prehistoric-rush-player-character-profile-commit-convergence-authority-domain
```

## Candidate coordinating kits

```txt
prehistoric-rush-player-character-profile-commit-convergence-authority-domain
player-profile-writer-session-kit
player-profile-command-id-kit
player-profile-command-sequence-kit
player-profile-revision-kit
player-profile-content-fingerprint-kit
player-profile-edit-command-kit
player-profile-patch-schema-kit
player-profile-expected-predecessor-kit
player-profile-commit-admission-kit
player-profile-conflict-detection-kit
player-profile-conflict-policy-kit
player-profile-merge-plan-kit
player-profile-storage-write-result-kit
player-profile-storage-readback-kit
player-profile-commit-result-kit
player-profile-reset-command-kit
player-profile-reset-result-kit
player-profile-event-id-kit
player-profile-channel-envelope-kit
player-profile-monotonic-subscription-kit
player-profile-duplicate-delivery-rejection-kit
player-profile-stale-delivery-rejection-kit
creator-draft-revision-kit
creator-save-lease-kit
creator-save-rebase-kit
creator-save-flush-kit
creator-navigation-barrier-kit
runtime-player-profile-binding-kit
player-profile-visible-frame-ack-kit
player-profile-observation-kit
player-profile-journal-kit
```

## Required transaction

```txt
CommitPlayerCharacterProfileCommand
  -> identify writer session, command, sequence and draft revision
  -> validate patch schema and normalize a detached candidate
  -> read the current durable profile and verify expected predecessor
  -> reject or merge conflicts under one explicit field policy
  -> allocate one successor revision and content fingerprint
  -> write the complete candidate and verify durable readback
  -> publish one PlayerProfileCommitResult
  -> publish one event envelope carrying commit ID and fingerprint
  -> admit subscriber delivery only when nonduplicate and monotonic
  -> rebase or cancel pending creator saves after remote admission
  -> flush or reject navigation while a save lease is unresolved
  -> bind game boot to the exact committed profile
  -> acknowledge the first visible menu/creator/game frame using that commit
```

## Required result statuses

```txt
Committed
CommittedMerged
RejectedInvalidPatch
RejectedStalePredecessor
RejectedConflict
RejectedDuplicate
RejectedUnsupportedSchema
FailedStorageUnavailable
FailedStorageWrite
FailedStorageReadback
FailedNavigationFlush
VolatileOnly
```

## Required invariants

```txt
one command ID produces at most one terminal result
successor revisions are strictly monotonic per profile
two writers cannot both commit the same predecessor revision
stale or duplicate channel deliveries never regress a projection
remote admission rebases or cancels every predecessor-draft timer
navigation never reports a saved draft without a commit receipt
failed durable writes never publish a durable-success event
reset participates in the same conflict and commit protocol
game boot cites one profile commit and fingerprint
first visible profile-dependent frame cites that binding
```

## Repo-local output

```txt
.agent/trackers/2026-07-12T18-18-59-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T18-18-59-04-00.md
.agent/architecture-audit/2026-07-12T18-18-59-04-00-player-profile-commit-convergence-dsk-map.md
.agent/render-audit/2026-07-12T18-18-59-04-00-profile-commit-visible-creature-gap.md
.agent/gameplay-audit/2026-07-12T18-18-59-04-00-stale-draft-navigation-profile-loop.md
.agent/interaction-audit/2026-07-12T18-18-59-04-00-profile-edit-commit-delivery-binding-map.md
.agent/profile-convergence-audit/2026-07-12T18-18-59-04-00-revision-conflict-debounce-navigation-contract.md
.agent/deploy-audit/2026-07-12T18-18-59-04-00-profile-convergence-fixture-gate.md
```

## Validation boundary

Documentation only. Runtime, profile storage, creator behavior, game boot, rendering, package scripts, dependencies and deployment were not changed. `npm test`, multi-tab browser fixtures, navigation flush fixtures and deployed Pages fixtures were not run.