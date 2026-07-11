# Deploy Audit: Kit-Graph / Adapter Fixture Gate

**Timestamp:** `2026-07-10T23-08-11-04-00`

## Current deploy risk

The static page resolves two architecture-critical dependencies from mutable branch heads:

```txt
https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine@main/src/index.js
https://cdn.jsdelivr.net/gh/LuminaryLabs-Agents/NexusRealtime-ProtoKits@main/protokits/rapier-physics-domain-kit/index.js
```

A later upstream push can change the core-kit factory surface, DSK behavior or Rapier adapter without a commit in this repository. The deployed page therefore has no immutable runtime source identity.

## Existing validation surface

```txt
root package.json: absent
unified npm test/check: absent
kit-graph fixture: absent
core-service consumption fixture: absent
source-admission fixture: absent
browser adapter smoke: absent
Pages source-revision smoke: absent
```

## Required source-admission row

```json
{
  "dependencyId": "nexus-engine-runtime",
  "requested": "LuminaryLabs-Dev/NexusEngine@<sha>/src/index.js",
  "resolvedRevision": "<sha>",
  "contentFingerprint": "<hash>",
  "requiredExports": [
    "createRealtimeGame",
    "createCoreInputKit",
    "createCoreSceneKit",
    "createCorePhysicsKit",
    "createCoreCompositionKit"
  ],
  "accepted": true,
  "reason": "required API surface present"
}
```

## DOM-free fixture gate

### Kit graph

```bash
node scripts/prehistoric-rush-kit-graph-fixture.mjs
```

Required assertions:

```txt
- pinned NexusEngine source imports
- all 12 requested core-kit factories exist
- parent domain defines expected resources/events/system/API
- engine creates without DOM or WebGL
- game.start() creates run 1 in game status
- tick advances deterministic run state
- fail/retry/collect behavior is stable
- snapshot is JSON-safe
```

### Consumption reconciliation

```bash
node scripts/prehistoric-rush-core-consumption-fixture.mjs
```

Required assertions:

```txt
- every declared kit has one classification row
- every required service has one consumer or allowed replacement
- no required kit remains silently unused
- composition fingerprint is stable across repeated runs
```

### Source admission

```bash
node scripts/prehistoric-rush-source-admission-fixture.mjs
```

Required assertions:

```txt
- requested URLs are immutable
- resolved revisions match the manifest
- required exports are present
- failed or incompatible sources produce typed rejection
```

### Adapter contracts

```bash
node scripts/prehistoric-rush-adapter-contract-fixture.mjs
```

Required assertions:

```txt
- browser, physics and render adapters expose narrow contracts
- adapters identify consumed/replaced core services
- adapter snapshots are JSON-safe
- stop/dispose is idempotent
```

## Browser smoke

The browser smoke should load the deployed artifact and verify:

```txt
composition fingerprint matches expected revision
source revisions match pinned values
start/jump/steer/boost/retry inputs reach the named input consumer
physics step and contacts reach the named physics consumer
scene transitions report accepted results
camera/animation/graphics/UI adapters report current revisions
no unclassified required kit exists
no duplicate RAF or listeners appear after restart/remount
```

## Deployment admission policy

```txt
fixture failure
  -> do not publish

source revision mismatch
  -> do not publish

required service unconsumed
  -> do not publish

adapter classification missing
  -> do not publish

all fixtures + browser smoke pass
  -> publish static artifact from main
```

## Validation this pass

Documentation only. No workflow, build, source, dependency or route file changed. The proposed fixtures do not exist and were not run. No branch or pull request was created.