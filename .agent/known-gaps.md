# Known Gaps: PrehistoricRush

**Updated:** `2026-07-10T16-28-47-04-00`

## Frame authority gaps

```txt
tick scheduler is created but never started
domainHost.tick is never driven by the live route
primary runtime uses an independent requestAnimationFrame loop
secondary presentation pass uses another independent requestAnimationFrame loop
no single sourceFrameId shared by simulation and presentation
no render commit owner
no one-render-per-source-frame invariant
no phase ordering contract
no dropped/duplicate render decision row
```

## Domain consumption gaps

```txt
dino-pose-domain-kit waits for runner.moved but live runtime never emits it
camera-domain-kit preset is duplicated as direct constants in applyCloseCamera
hud-domain-kit render service is bypassed by direct innerHTML composition
tick-scheduler snapshot remains dormant
event-bus history records setup events but not live runner frames
domain snapshots do not prove runtime consumption
```

## Lifecycle gaps

```txt
Start changes scene only
Retry changes scene only
Run Again changes scene only
runner position, distance, jump, speed, pickups, collected set, collision state, and best-session state are not reset
run-over cause is not retained
win cause is not retained
no SceneTransitionResult
no RestartTransaction
no restart id or source frame
terminal conditions can immediately re-trigger after button activation
README advertises menu return paths that are not implemented by the live runtime
```

## Source contract gaps

```txt
README describes a manifest-driven multi-scene loader
live runtime does not import game-scenes.json
live runtime does not import scene JSON manifests
live runtime does not import runner-tuning.json
live runtime hardcodes tuning and scene transitions
README says A/D move left/right while runtime uses free yaw steering
README says retry/menu lifecycle exists while runtime has no real reset or menu return
game-scenes.json declares transitions not consumed by runtime
NexusEngine CDN declared by manifest is not the live boot authority
```

## Host/readback gaps

```txt
PrehistoricRushHost exposes the mutable app object
getState returns app.state by reference
runner.collected is a Set and not a detached JSON-safe row
no frame authority state
no primary/secondary phase rows
no render commit row
no scene transition result
no restart result
no runtime source fingerprint
no manifest-consumption summary
no fixture metadata
```

## Render gaps

```txt
primary loop renders once
secondary presentation loop renders again
camera and pose can be overwritten between the two commits
HUD can be rewritten twice per display refresh
renderer statistics are not captured per commit
no proof that two RAF callbacks correspond to the same simulation frame
```

## Validation gaps

```txt
no root package.json found
no npm run check
no DOM-free frame-authority fixture
no restart lifecycle fixture
no browser smoke in this pass
no GitHub Pages smoke in this pass
```

## Do not solve first

```txt
visual expansion
terrain rewrite
movement retune
new dinosaur mesh
new pickups
new obstacle families
renderer extraction
ProtoKit promotion
```

## Current ledge

```txt
PrehistoricRush Single Frame Authority + Restart Transaction Fixture Gate
```
