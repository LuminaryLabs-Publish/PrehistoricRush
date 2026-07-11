# Render Audit: State, Render, HUD and Host Coherence Gap

**Timestamp:** `2026-07-11T14-31-27-04-00`

## Summary

The Three renderer is the final visual consumer, but it does not return a product-level receipt. Game, patch, physics and camera state can advance before `renderer.render()` completes, while HUD and public host projection occur through separate mutable paths.

## Plan ledger

**Goal:** make the visible canvas, HUD and diagnostics identify the same immutable presentation frame.

- [x] Trace render inputs and mutable presentation state.
- [x] Trace HUD projection after rendering.
- [x] Trace public host readback.
- [x] Identify failure and interleaving cases.
- [ ] Add render and HUD result adapters.
- [ ] Add frame-coherence fixtures.

## Current render path

```txt
adapter.render(state, dt)
  -> increment view.time
  -> update player transform and skeleton pose
  -> update camera target and smooth-follow controller
  -> update sun transform
  -> update grass time/wind uniforms
  -> rotate shard mesh
  -> renderer.render(scene, camera)
  -> return undefined
```

The caller then writes HUD HTML and button text. The canvas and HUD therefore have separate commit points and no shared presentation fingerprint.

## Coherence failures

```txt
render throws:
  game/stream/physics/gameplay state already advanced
  presentation objects may be partially mutated
  previous canvas remains visible
  HUD is not updated
  no next RAF is scheduled
  host remains published

HUD write throws:
  canvas may show the new frame
  HUD may show the prior frame
  no commit result identifies the split

host read during RAF:
  game snapshot can be newer than camera snapshot
  stream snapshot can change before render
  no frame boundary prevents mixed observation
```

## Missing evidence

```txt
frameId
presentation fingerprint
active patch revision consumed by render
collider revision consumed by gameplay
camera revision consumed by render
render submission result
canvas size and pixel ratio receipt
HUD commit result
last committed frame pointer
failed-frame pointer
```

## Required render contract

```txt
renderFrame(presentationState, frameContext)
  -> validate frame/session identities
  -> apply presentation state
  -> apply camera transform
  -> submit Three render
  -> return typed render result

commitHud(hudProjection, frameContext)
  -> update status and button
  -> return typed HUD result

publishFrame(renderResult, hudResult)
  -> require both accepted
  -> publish immutable committed-frame record
```

## Required fixtures

```txt
successful frame commits canvas, HUD and host record
render failure preserves previous committed-frame pointer
HUD failure does not publish the candidate frame
host reads during each pipeline stage return the previous committed frame
camera and presentation fingerprints match the committed record
resize cannot masquerade as a committed gameplay frame
```

## Readiness statement

Rendering remains visually functional, but no frame-coherence guarantee exists until typed render/HUD results and committed-frame readback are implemented and tested.