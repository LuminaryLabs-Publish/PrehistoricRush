# Architecture Audit: Player Character Composition Transition DSK

**Timestamp:** `2026-07-13T13-58-35-04-00`

## Goal

Define the product composition boundary that coordinates existing Core Creature, Core Character, Core Player, articulated motion and presentation participants without moving their bounded ownership into one monolithic kit.

## Existing ownership

```txt
procedural-creature-body-kit
  owns generated body, geometry, skeleton, collision and legacy pose

articulated-motion-domain-kit
  owns rig registration, FK, target solving and pose frames

core-creature-kit
  owns neutral creature identity, body/rig references, support and presentation descriptors

core-character-kit
  owns active character identity and pose/motion/physics bindings

core-player-kit
  owns player identity, possession and control generation

character-preview-transition-kit
  owns visible morph/crossfade, mesh placement and transition state

camera-framing-kit
  owns framing calculations from accepted subject bounds
```

These boundaries are appropriate. The missing authority coordinates adoption across them.

## Current composition sequence

```txt
body.create
  -> articulatedMotion.registerRig
  -> coreCreature.register or replace
  -> coreCharacter.create or replace
  -> corePlayer.register when absent
  -> corePlayer.possess
  -> return detached clones of the resulting records
```

Each live participant can publish before the next participant succeeds.

## Required parent domain

`prehistoric-rush-player-character-composition-transition-authority-domain`

## Planned kits

| Kit | Responsibility |
|---|---|
| `composition-attempt-identity-kit` | allocate attempt ID, engine generation and profile revision |
| `composition-predecessor-kit` | bind expected body, rig, creature, character and player revisions |
| `body-candidate-kit` | build and fingerprint procedural body without live registration |
| `rig-candidate-kit` | build and validate articulated rig without live registration |
| `creature-candidate-kit` | build neutral creature definition and support/presentation contract |
| `character-candidate-kit` | build active character binding candidate |
| `player-possession-candidate-kit` | prepare optional registration/possession candidate |
| `support-anchor-evaluation-kit` | evaluate support bones from the candidate rig and pose |
| `presentation-bounds-kit` | compute local unscaled bounds and candidate framing metadata |
| `composition-reference-validation-kit` | prove body/rig/creature/character/player references agree |
| `composition-conflict-policy-kit` | return typed Duplicate, Replace, Conflict, Stale or Invalid results |
| `registry-preparation-receipt-kit` | collect non-publishing participant receipts |
| `composition-atomic-adoption-kit` | adopt all live registry participants or none |
| `composition-rollback-kit` | preserve or restore every predecessor on failure |
| `composition-result-kit` | publish terminal result and participant revisions |
| `preview-mesh-candidate-kit` | prepare mesh/topology/placement before registry adoption |
| `preview-transition-generation-kit` | own morph/crossfade generation and stale retirement |
| `camera-framing-candidate-kit` | prepare framing from the accepted candidate bounds |
| `composition-resource-retirement-kit` | release predecessor mesh/rig resources after adoption |
| `composition-observation-journal-kit` | retain bounded attempts, results, failures and visible acks |
| `first-composed-frame-ack-kit` | acknowledge the first visible frame matching accepted composition |
| `composition-fixture-kit` | deterministic participant failure and rapid-edit tests |
| `composition-pages-parity-kit` | source/build/Pages behavior comparison |

## Required transaction

```txt
PlayerCharacterCompositionCommand
  -> allocate attempt and generation
  -> validate expected predecessor revisions
  -> prepare body and rig candidates
  -> prepare creature, character and optional player candidates
  -> evaluate support anchors and bounds
  -> prepare mesh, placement and framing
  -> validate all references and conflict policy
  -> atomically adopt registries or preserve predecessors
  -> publish PlayerCharacterCompositionResult
  -> start one admitted preview transition generation
  -> retire predecessor resources after visible adoption
  -> publish FirstComposedCharacterFrameAck
```

## Boundary rules

- Core Creature remains renderer-neutral.
- Core Character remains the active binding authority.
- Core Player remains the possession/control authority.
- The product composition domain owns only cross-participant orchestration and results.
- Error-message parsing cannot determine replacement policy.
- Support and bounds evidence must cite the same body/rig candidate generation.
- Visible preview state cannot advance independently of accepted composition state.
- Game startup and creator edits use the same composition result contract, with possession optional.

## Completion gate

Do not mark the composition transition authority complete until participant failure at every preparation/adoption point preserves the complete predecessor, duplicate and replacement outcomes are typed, rapid edits retire stale generations, and registry/persistence/visible readback cite the same accepted profile revision.