# PrehistoricRush Architecture Audit: Host Presentation Event Ledger DSK Map

**Generated:** `2026-07-09T11-46-08-04-00`

## Scope

Documentation-only architecture breakdown for `LuminaryLabs-Publish/PrehistoricRush`.

No runtime source was changed.

## Current architecture

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
      -> event-bus
      -> domain-host
      -> tick-scheduler
      -> dino form / pose / material kits
      -> camera kit
      -> HUD kit
      -> PrehistoricRushComposition snapshot
      -> runtime-terrain-v6 import
      -> presentation pass
  -> src/runtime-terrain-v6.mjs
      -> Three.js CDN
      -> Rapier CDN
      -> rapier-physics-domain-kit CDN
      -> DOM shell
      -> runner loop
      -> terrain/population/contact/scene mutations
      -> PrehistoricRushHost.getState legacy readback
```

## DSK/domain map

```txt
prehistoric-rush
├─ browser-shell-domain
│  ├─ index-static-shell-kit
│  └─ module-runtime-entry-kit
├─ composition-domain
│  ├─ event-bus-kit
│  ├─ domain-host-kit
│  ├─ tick-scheduler-kit
│  └─ composition-snapshot-kit
├─ dino-domain
│  ├─ dino-form-domain-kit
│  ├─ dino-pose-domain-kit
│  ├─ dino-material-domain-kit
│  └─ dino-domain-bundle-kit
├─ camera-domain
│  └─ camera-domain-kit
├─ hud-domain
│  └─ hud-domain-kit
├─ legacy-runner-domain
│  ├─ runner-input-kit
│  ├─ runner-motion-kit
│  ├─ runner-terrain-stream-kit
│  ├─ runner-spawn-population-kit
│  ├─ runner-contact-kit
│  ├─ runner-pickup-kit
│  ├─ runner-scene-dispatch-kit
│  └─ runner-score-kit
├─ physics-domain
│  └─ rapier-physics-domain-kit
├─ render-domain
│  ├─ three-render-host-kit
│  ├─ raptor-render-adapter-kit
│  ├─ terrain-render-kit
│  └─ render-readback-kit
└─ next-cut presentation-proof-domain
   ├─ runner-source-state-kit
   ├─ runner-step-delta-kit
   ├─ runner-moved-event-kit
   ├─ presentation-events-kit
   ├─ dino-pose-frame-kit
   ├─ camera-frame-request-kit
   ├─ hud-frame-request-kit
   ├─ contact-result-snapshot-kit
   ├─ scene-dispatch-result-kit
   ├─ render-readback-kit
   ├─ presentation-frame-record-kit
   ├─ presentation-journal-kit
   ├─ host-presentation-snapshot-kit
   └─ dom-free-presentation-fixture-kit
```

## Interaction loop captured

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js installs DSK scaffold
  -> runtime-terrain-v6 loads visual runtime
  -> menu waits for Start / Enter / Space
  -> keyboard input mutates app.input
  -> game loop mutates runner state inline
  -> physics bridge snapshots contacts
  -> contact and pickup checks mutate scene inline
  -> renderer draws baseline frame
  -> presentation pass mutates camera/HUD/raptor stride and draws second frame
  -> host exposes legacy state only
```

## Architecture finding

The existing domain shape is close enough to support a proper event proof path.

The blocker is the missing source-owned event bridge between the live runner mutation loop and the already-installed DSK consumers.

`dino-pose-domain-kit` is ready to consume `runner.moved`, but the monolithic runtime does not emit that event from live movement.

## Required next extraction

```txt
1. Project app.state into RunnerSourceState.
2. Compare previous/current RunnerSourceState into RunnerStepDelta.
3. Emit RunnerMovedEvent to eventBus.
4. Capture dino.pose.changed output as DinoPoseFrame.
5. Capture camera, HUD, contact, scene, and render consumption as frame records.
6. Publish PrehistoricRushHost.getState().presentation additively.
7. Prove rows through scripts/prehistoric-rush-presentation-frame-fixture.mjs.
```

## Boundary rule

Do not move terrain, collision, renderer, or physics authority yet.

First prove a read-only ledger around the live route.
