# Validation: PrehistoricRush

**Updated:** `2026-07-11T12-39-53-04-00`

## Scope

Documentation-only audit of browser runtime startup, retry, RAF/listener ownership, Worker/executor quarantine, stream epochs, Three/Rapier resource ownership, public host revocation and terminal disposal.

## Plan ledger

**Goal:** separate source-confirmed lifecycle facts from executable proof and define the exact gates required before restart or teardown safety is claimed.

- [x] Verify module and runtime construction order.
- [x] Verify Worker creation and patch Worker protocol.
- [x] Verify retry behavior.
- [x] Verify listener and RAF registration.
- [x] Verify public host exposure.
- [x] Verify absence of explicit terminal disposal in current source.
- [x] Verify domains, kits and services.
- [x] Add required documentation outputs.
- [ ] Execute Node and browser lifecycle fixtures after implementation.

## Selection verification

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
nominal oldest repository: LuminaryLabs-Publish/IntoTheMeadow
nominal oldest status: active same-window documentation writes
selected stable repository: LuminaryLabs-Publish/PrehistoricRush
excluded repository: LuminaryLabs-Publish/TheCavalryOfRome
target branch: main
branch created: no
pull request created: no
```

## Source facts verified

```txt
main entry: src/game.js -> main()
required module loading: Promise.all over pinned Nexus/Kits/Three modules
Rapier adapter construction: present
patch generator construction: present
module Worker construction: optional
seeded patch controller construction: present
smooth camera controller construction: present
Three adapter/resource construction: present
initial game.start(): present
initial streaming prime: present
initial camera reset: present
```

## Retry facts verified

```txt
retry entry points: button, Enter, Space outside active game
retry implementation: game.start + updateStreaming(primeCenter) + resetCamera
new runtimeSessionId: absent
new runSessionId exposed by host: absent
new streamEpoch: absent
Worker recreation: no
controller recreation: no
Rapier recreation/reset result: no
Three resource recreation: no
pending Worker cancellation/fence: absent
```

## Scheduling and callback facts verified

```txt
RAF request ID retained: no
loop schedules next RAF unconditionally: yes
button callback lease: absent
keydown listener removal: absent
keyup listener removal: absent
blur listener removal: absent
resize listener removal: absent
pagehide lifecycle handler: absent
explicit stop/dispose API: absent
post-dispose rejection: absent
```

## Worker facts verified

```txt
Worker path: src/workers/prehistoric-patch-worker.js
Worker mode: module
Worker init message: init-patch-worker
Worker generation message: generate-patch
Worker success message: patch-generated
Worker failure message: patch-error
request correlation: requestId
session/run/stream epoch in protocol: absent
cancel message: absent
shutdown message/ack: absent
worker.terminate call: absent
executor disposal call: absent
```

## Resource ownership facts verified

```txt
Three adapter dispose service: absent
renderer.dispose call: absent
geometry/material disposal calls: absent
renderer canvas removal: absent
Rapier terminal dispose/reset result: absent
public host lease/revocation: absent
public host exposes mutable owners: yes
startup cleanup stack: absent
startup rollback: absent
```

## Existing runtime identity

```txt
NexusEngine: e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits: d6630367d557782d9ec965947aeb1c197d37ea15
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js: 0.179.1
Rapier: 0.15.0
parent game domain: prehistoric-rush-domain-kit 0.5.0
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
lifecycle audit: yes
deploy audit: yes
runtime source changed by this pass: no
rendering changed by this pass: no
physics changed by this pass: no
deployment workflow changed by this pass: no
```

## Validation not executed

```txt
startup success fixture
partial startup rollback fixture
single RAF/listener ownership fixture
retry epoch fixture
late Worker response rejection fixture
Worker/executor termination fixture
Three resource disposal fixture
Rapier disposal/reset fixture
host revocation fixture
idempotent repeated dispose fixture
post-dispose command rejection fixture
browser pagehide lifecycle smoke
Pages smoke
```

The GitHub connector provided source inspection and documentation writes. No runnable checkout or browser session was available, so no executable lifecycle claim is made.

## Required future proof

```txt
one startup command produces one live session
partial startup failure leaves zero retained runtime resources
retry changes run/stream epoch and does not duplicate host resources
old Worker responses cannot mutate the new run
stop prevents further tick, streaming, physics and rendering
all callbacks/listeners are retired
Worker/executor terminate or dispose with an acknowledged result
Three and Rapier resources release in a defined order
public host capabilities are revoked before disposal
repeated dispose is stable and idempotent
post-dispose commands return typed rejection
```

## Future fixture commands

```bash
node scripts/prehistoric-rush-lifecycle-startup-fixture.mjs
node scripts/prehistoric-rush-startup-rollback-fixture.mjs
node scripts/prehistoric-rush-retry-epoch-fixture.mjs
node scripts/prehistoric-rush-worker-stale-result-fixture.mjs
node scripts/prehistoric-rush-resource-disposal-fixture.mjs
node scripts/prehistoric-rush-host-revocation-fixture.mjs
node scripts/prehistoric-rush-browser-lifecycle-smoke.mjs
```

## Readiness statement

The current source constructs and runs the game, but startup, retry and teardown are not session-owned or executable-proofed. Route/profile authority remains P0; runtime lifecycle should not be treated as safe until epoch, rollback, disposal and stale-callback fixtures exist.
