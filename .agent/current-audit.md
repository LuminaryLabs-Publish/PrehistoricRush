# PrehistoricRush Current Audit

**Timestamp:** `2026-07-13T13-58-35-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Runtime revision reviewed:** `0c181c308716eb4a143768a0c674177c33c2264c`  
**Status:** `player-character-composition-transition-authority-central-reconciled`  
**Technical status:** `player-character-composition-transition-authority-audited`

## Summary

Core Creature, Core Character and Core Player are now active in PrehistoricRush. The product composes a procedural body and articulated rig into a neutral creature definition, binds that creature to an active character and optionally gives a player possession. The game resolves the controlled character for motion, physics and pose publication, while the creator uses the same composition path without player possession.

The current gap is cross-participant atomicity and visible adoption. Rig, creature, character and player registries mutate sequentially. The creator mutates those registries before topology validation, mesh creation, crossfade completion and framing. No composition attempt, expected revisions, typed duplicate/replace policy, participant receipts, rollback result or matching visible-frame acknowledgement exists.

## Plan ledger

**Goal:** keep Core ownership separated while adding one product composition result that every registry and visible-preview participant adopts together.

- [x] Reconcile the full Publish inventory and central ledger.
- [x] Select only PrehistoricRush under the oldest/local-ahead rule.
- [x] Inspect 18 new source/test commits after the documented runtime revision.
- [x] Identify the complete interaction loop and all domains.
- [x] Correct the inventory to 52 implemented kit/adapter/proof surfaces.
- [x] Define the player-character composition transition authority.
- [x] Add the timestamped tracker and audit family.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement and execute atomic composition/failure/visible-frame fixtures later.

## Interaction loop

```txt
profile
  -> procedural body
  -> articulated rig
  -> Core Creature
  -> Core Character
  -> optional Core Player possession
  -> controlled-character pose/simulation path

creator profile edit
  -> compose into live registries
  -> support-pose evaluation
  -> support-local grounding
  -> topology morph or crossfade
  -> articulated preview pose
  -> camera framing
  -> applied visual revision
  -> delayed durable profile commit
```

## Domains in use

```txt
browser boot, pinned providers, profile binding, input, resize and RAF
profile schema, persistence, debounce and cross-page distribution
Core Creature definitions, body/rig references, support anchors and presentation hints
Core Character identity, creature/profile reference, pose/motion/physics bindings and lifecycle
Core Player identity, possession, control and spawn generation
Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
articulated motion and articulated dynamics
procedural creature body, rig, skinning, collision and legacy pose
player-character composition and controlled-character resolution
support-anchor evaluation, local bounds, platform grounding and camera framing
creator morph/crossfade and visible transition lifecycle
Rapier, route generation, patch streaming, terrain and vegetation
run movement, jumping, scoring, collisions and outcomes
Three.js rendering, HUD and diagnostics
composition preparation, atomic adoption, rollback, retirement and visible proof
validation, build and GitHub Pages deployment
```

## Implemented state

```txt
Core Creature domain installed: yes
Core Character domain installed: yes
Core Player domain installed: yes
neutral creature support/presentation descriptor: yes
active character motion/physics/pose bindings: yes
player registration and possession: yes
controlled-character resolution in game loop: yes
shared game/creator composition helper: yes
creator optional no-player composition: yes
local unscaled presentation bounds: yes
support bone IDs and fallback policy: yes
support-pose grounding: yes
bounds-based camera framing: yes
idempotent identical composition test: yes
changed embodiment replacement test: yes
creator source authority test: yes
npm test wiring: yes
```

## Current gaps

```txt
CompositionAttemptId and CompositionRevision: absent
expected participant revisions: absent
detached body/rig/creature/character/player candidate set: absent
typed Duplicate/Replace/Conflict result: absent
replacement policy parses exception text: present
aggregate preparation receipts: absent
atomic registry adoption: absent
aggregate rollback: absent
rig-change pose compatibility result: absent
support-anchor revision/result: absent
mesh/framing candidate receipt: absent
crossfade generation and stale retirement result: absent
registry/visible/persistence revision correlation: absent
FirstComposedCharacterFrameAck: absent
participant failure fixtures: absent
browser/build/Pages proof: absent
```

## Required authority

```txt
prehistoric-rush-player-character-composition-transition-authority-domain
```

```txt
PlayerCharacterCompositionCommand
  -> bind engine/profile/participant predecessor revisions
  -> prepare body, rig, creature, character and optional player candidates
  -> evaluate support anchors, bounds, topology and pose compatibility
  -> prepare mesh, placement and camera framing without live mutation
  -> atomically adopt all registries or preserve all predecessors
  -> publish terminal composition and participant results
  -> admit one visual transition generation
  -> acknowledge the first matching composed-character frame
```

## Current output

See `.agent/trackers/2026-07-13T13-58-35-04-00/project-breakdown.md` and its linked audit family.

## Validation

Documentation only. No runtime code changed in this pass. Source and test wiring were inspected, but `npm test`, real-runtime failure injection, browser creator transitions, built output and GitHub Pages were not independently executed.