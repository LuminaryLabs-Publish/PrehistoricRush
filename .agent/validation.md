# Validation: PrehistoricRush

**Updated:** `2026-07-11T08-48-04-04-00`

## Scope

Documentation-only audit of the current runtime module graph, joined creature neck/head topology, grass-card policy, shadow policy, consumer binding, frame provenance and existing P0 patch activation boundary.

## Plan ledger

**Goal:** distinguish source-inspected facts from executable proof and define the exact validation gates needed before the visual change is treated as authoritative.

- [x] Verify the current product source pins.
- [x] Verify the product runtime visual-policy change.
- [x] Verify the upstream joined neck/head topology change.
- [x] Verify the interaction loop, domains, kits and services.
- [x] Verify current host observation limits.
- [x] Add the required documentation outputs.
- [ ] Run executable Node, browser and Pages fixtures after implementation.

## Selection verification

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected repository: LuminaryLabs-Publish/PrehistoricRush
selection reason: recent undocumented runtime/render change and oldest eligible ledger
excluded repository: LuminaryLabs-Publish/TheCavalryOfRome
target branch: main
branch created: no
pull request created: no
```

## Source facts verified

```txt
active route: index.html -> src/runtime.mjs -> src/game.js
NexusEngine: e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits: d6630367d557782d9ec965947aeb1c197d37ea15
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js: 0.179.1
Rapier: 0.15.0
parent game domain: prehistoric-rush-domain-kit 0.5.0
creature kit version: 0.1.0
renderer label: three-seeded-patch-streaming-neck-shadow-grass-v7
root package.json: absent
```

## Upstream topology facts verified

```txt
joined topology commit: 0cdd178dbc3b581b81e50a385ba5197781f855e1
torso/neck/head share one appendTube call: yes
head uses same radial segment count: yes
topology.connectedParts: 6
upstream smoke checks indexed component count: yes
kit generated integrity changed: yes
kit semantic version changed: no
```

## Product grass facts verified

```txt
grass card X scale: 0.62
alpha silhouette constants changed: yes
vertical fragment shade added: yes
three layer colors changed: yes
wind shader remains time-driven: yes
typed grass policy descriptor: absent
grass policy hash: absent
grass binding result: absent
```

## Product shadow facts verified

```txt
renderer shadow map type: PCFSoftShadowMap
directional shadow bounds: -80 / 80 / 80 / -80
directional shadow near/far: 1 / 180
directional shadow bias: -0.0004
directional shadow normalBias: 0.06
tree crown castShadow: false
tree crown receiveShadow: true
typed shadow policy descriptor: absent
shadow policy hash: absent
shadow binding result: absent
```

## Identity and frame facts verified

```txt
single runtime module-graph manifest: absent
moduleGraphFingerprint: absent
visualPolicyFingerprint: absent
creature exact geometry hash: absent
renderer label: manual string
typed render-policy admission: absent
typed visual binding result: absent
pose revision: absent
camera revision: absent
patch consumer revision: absent
committed render-frame receipt: absent
```

## Existing validation surface

```txt
root package.json: absent
product Node fixture command: absent
browser automation fixture: absent
Pages visual smoke: absent
upstream creature smoke: present in NexusEngine-Kits, not executed here
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
visual-policy audit: yes
deploy audit: yes
runtime source changed by this pass: no
rendering changed by this pass: no
physics changed by this pass: no
deployment workflow changed by this pass: no
```

## Validation not executed

```txt
NexusEngine-Kits smoke test
product patch activation fixture
product visual-policy fingerprint fixture
creature geometry identity fixture
grass shader/geometry binding fixture
shadow binding fixture
render-frame receipt fixture
browser smoke
Pages smoke
```

The GitHub connector provided source inspection and documentation writes. No runnable checkout or browser was available, so no executable validation claim is made.

## Required future proof

```txt
controller active IDs equal committed consumer IDs
joined neck/head geometry has six indexed components
full geometry hash changes with topology, winding or payload
module graph fingerprint changes with any source pin
grass policy fingerprint changes with geometry/shader/palette
shadow policy fingerprint changes with map/camera/caster values
Three bindings match accepted descriptors
one frame names one module graph and visual policy
one frame names exact creature, pose, camera and patch revisions
stale epoch cannot mutate or publish
browser shows continuous neck topology and intended grass silhouette
browser shadow output matches declared policy
disposed runtime reports no live Worker/listener/RAF/Three/Rapier owners
```

## Required fixture commands after implementation

```bash
node scripts/prehistoric-rush-patch-activation-fixture.mjs
node scripts/procedural-creature-geometry-identity-fixture.mjs
node scripts/prehistoric-rush-visual-policy-fixture.mjs
node scripts/prehistoric-rush-render-binding-fixture.mjs
node scripts/prehistoric-rush-frame-receipt-fixture.mjs
node scripts/prehistoric-rush-lifecycle-fixture.mjs
```

## Readiness statement

The active source graph and visual-policy literals are source-verified. Transactional patch activation, canonical graph/policy identity, exact creature geometry identity, typed bindings and committed-frame correlation remain unimplemented and unproved.