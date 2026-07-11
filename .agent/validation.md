# Validation: PrehistoricRush

**Updated:** `2026-07-11T14-31-27-04-00`

## Scope

Documentation-only audit of RAF stage ordering, simulation and streaming mutation, physics and gameplay application, camera/render/HUD consumption and `PrehistoricRushHost` observation.

## Plan ledger

**Goal:** separate source-confirmed frame-coherence facts from executable proof and define the exact blockers for trustworthy runtime diagnostics.

- [x] Verify the RAF stage order.
- [x] Verify simulation and streaming mutate before render.
- [x] Verify physics, collision and pickup mutation occur before render.
- [x] Verify camera and presentation mutate inside `adapter.render`.
- [x] Verify `renderer.render()` returns no product receipt.
- [x] Verify HUD projection occurs after rendering.
- [x] Verify the host independently samples mutable owners.
- [x] Verify all domains, kits and services.
- [x] Add required documentation outputs.
- [ ] Execute pure and browser frame fixtures after implementation.

## Selection verification

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected repository: LuminaryLabs-Publish/PrehistoricRush
excluded repository: LuminaryLabs-Publish/TheCavalryOfRome
target branch: main
branch created: no
pull request created: no
```

## Source facts verified

```txt
runtime entry:
  src/runtime.mjs -> imports src/game.js

frame owner:
  src/game.js -> loop(now)

simulation:
  game.setInput
  engine.tick(dt)

streaming:
  updateStreaming(state)
  controller release/generate/pump/activate

physics/gameplay:
  actor transform
  physics.step(dt)
  collision fail
  shard collection

presentation:
  adapter.render(state, dt)
  creature pose
  camera follow
  light, grass and shard mutation
  renderer.render(scene, camera)

HUD:
  status.innerHTML
  button.textContent

host:
  PrehistoricRushHost.getState
```

## Frame identity facts

```txt
runtimeSessionId: absent
runSessionId: absent outside product runId
frameId: absent
simulation receipt: absent
stream receipt: absent
collider membership receipt: absent
physics receipt: absent
gameplay receipts: absent
presentation fingerprint: absent
camera receipt: absent
render result: absent
HUD result: absent
committed frame record: absent
failed frame result: absent
```

## Host readback facts

```txt
host publishes raw mutable owners: yes
host getState samples game snapshot: yes
host getState samples controller snapshot separately: yes
host getState samples camera snapshot separately: yes
host reports static renderer label: yes
host exposes committedFrameId: no
host exposes render/HUD receipt: no
host prevents interleaved reads: no
```

## Existing runtime identity

```txt
NexusEngine: e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits: d6630367d557782d9ec965947aeb1c197d37ea15
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js: 0.179.1
Rapier: 0.15.0
prehistoric-rush-domain-kit: 0.5.0
root package.json: absent
```

## Documentation output

```txt
required root .agent files updated: yes
new tracker folder: yes
new turn-ledger entry: yes
architecture audit: yes
render audit: yes
gameplay audit: yes
interaction audit: yes
frame-authority audit: yes
deploy audit: yes
runtime source changed by this pass: no
rendering changed by this pass: no
physics changed by this pass: no
deployment changed by this pass: no
```

## Validation not executed

```txt
frame record fixture
frame failure fixture
host read-model fixture
frame journal fixture
browser frame-coherence smoke
browser render-failure smoke
browser host-interleaving smoke
Pages frame-coherence smoke
```

No runnable checkout or browser session was used through the connector, so no frame-coherence claim is made.

## Required future proof

```txt
one RAF candidate receives one frameId
all stage receipts share runtime, run and frame identity
render and HUD success are mandatory before publication
render failure preserves the predecessor committed frame
HUD failure preserves the predecessor committed frame
host reads during pipeline stages return only the predecessor committed frame
retry rejects predecessor-run receipts
frame records round-trip through JSON and remain bounded
source and deployed Pages behavior match
```

## Future fixture commands

```bash
node scripts/prehistoric-rush-frame-record-fixture.mjs
node scripts/prehistoric-rush-frame-failure-fixture.mjs
node scripts/prehistoric-rush-host-read-model-fixture.mjs
node scripts/prehistoric-rush-frame-journal-fixture.mjs
node scripts/prehistoric-rush-browser-frame-coherence-smoke.mjs
node scripts/prehistoric-rush-browser-render-failure-smoke.mjs
node scripts/prehistoric-rush-browser-host-interleaving-smoke.mjs
node scripts/prehistoric-rush-pages-frame-coherence-smoke.mjs
```

## Readiness statement

The source proves that runtime state and public readback can advance without a correlated canvas/HUD commit. `PrehistoricRushHost` must not be treated as frame-coherent evidence until the committed-frame contract and fixtures pass.