# PrehistoricRush Architecture Audit

**Updated:** `2026-07-08T03:01:20-04:00`

## Current architecture

```txt
PrehistoricRush
├─ static-browser-shell
│  ├─ index.html
│  └─ #app mount
├─ module-runtime-entry
│  ├─ src/runtime.mjs
│  └─ imports src/game.js
├─ composition-bootstrap
│  ├─ src/game.js
│  ├─ event bus
│  ├─ domain host
│  ├─ tick scheduler
│  └─ dino domain installs
├─ dino-entity-domain
│  ├─ dino-form-domain-kit
│  ├─ dino-pose-domain-kit
│  └─ dino-material-domain-kit
├─ legacy-visual-runtime-bridge
│  └─ src/runtime-terrain-v6.mjs
├─ runner-gameplay-authority
│  ├─ movement
│  ├─ jump
│  ├─ boost
│  ├─ distance score
│  ├─ contacts
│  └─ scene transitions
├─ render-surface
│  ├─ Three.js scene
│  ├─ procedural terrain
│  ├─ raptor rig
│  ├─ instanced props
│  ├─ sky/fog/lights
│  └─ HUD projection
└─ host-diagnostics
   ├─ PrehistoricRushComposition.snapshot()
   └─ PrehistoricRushHost.getState()
```

## Target DSK map

```txt
prehistoric-rush-domain
├─ runtime-source-domain
│  ├─ runtime-source-bundle-kit
│  ├─ manifest-load-status-kit
│  ├─ manifest-drift-report-kit
│  └─ runtime-tuning-adapter-kit
├─ action-domain
│  ├─ action-frame-contract-kit
│  ├─ action-batch-contract-kit
│  ├─ action-acceptance-matrix-kit
│  └─ action-result-journal-kit
├─ runner-domain
│  ├─ runner-source-state-kit
│  ├─ runner-step-result-kit
│  ├─ runner-event-journal-kit
│  └─ run-movement-promotion-report-kit
├─ dino-domain
│  ├─ dino-form-domain-kit
│  ├─ dino-pose-domain-kit
│  ├─ dino-material-domain-kit
│  └─ dino-domain-bridge-kit
├─ contact-domain
│  ├─ contact-event-contract-kit
│  ├─ contact-result-snapshot-kit
│  └─ scene-dispatch-result-kit
├─ render-handoff-domain
│  ├─ terrain-render-descriptor-kit
│  ├─ raptor-render-descriptor-kit
│  ├─ sky-render-descriptor-kit
│  ├─ camera-policy-descriptor-kit
│  └─ hud-telemetry-descriptor-kit
└─ validation-domain
   ├─ scripted-action-fixture-kit
   ├─ replay-parity-smoke-kit
   └─ host-diagnostics-smoke-kit
```

## Services currently present

```txt
createEventBus()
createDomainHost({ eventBus })
createTickScheduler({ host, eventBus })
createDinoFormDomainKit({ entityId })
createDinoPoseDomainKit({ entityId })
createDinoMaterialDomainKit({ entityId })
createDinoDomainBundle(config)
PrehistoricRushComposition.snapshot()
PrehistoricRushHost.getState()
```

## Services that should be added next

```txt
loadRuntimeSourceBundle()
createManifestLoadStatus()
createManifestDriftReport()
createSceneAliasCatalog()
createActionFrame()
createActionAcceptanceMatrix()
appendActionResult()
snapshotRunnerSourceState()
reduceRunnerStep()
emitRunnerMoved()
bridgeRunnerMovedToDinoPose()
createContactEvent()
reduceContactResult()
dispatchSceneRequest()
appendSceneDispatchResult()
getReplayJournal()
runSmoke(name)
runReplayParitySmoke()
createRunMovementPromotionReport()
```

## Boundary rules

```txt
- Renderer consumes descriptors only.
- DOM handlers create ActionFrame input only.
- Rapier bridge consumes actor/collider descriptors only.
- Scene transitions consume scene dispatch results only.
- Dino visual rig consumes dino descriptors only.
- Product repo proves local behavior first.
- Shared behavior promotes to ProtoKits only after fixture proof.
```

## Main architecture blocker

The live route has an architecture split, but not yet an authority split.

`src/game.js` is the clean composition layer, while `runtime-terrain-v6.mjs` still owns most gameplay, render, contact, and scene authority.

The next implementation must wrap current behavior into action/result and runner-step contracts before deeper refactors.
