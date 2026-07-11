# Deploy Audit: Pinned Module Graph and Descriptor Adapter Fixture Gate

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Timestamp:** `2026-07-11T00-39-25-04-00`

## Current deployment posture

The route is a static browser application with commit-pinned CDN imports. `index.html` maps the bare `nexusengine` package name to the same Nexus Engine commit currently referenced by `src/game.js`, allowing the official NexusEngine-Kits module to resolve its dependency in the browser.

This is a necessary compatibility fix, but there is no automated gate preventing the import map and JavaScript constants from drifting later.

## Required DOM-free fixtures

```txt
scripts/prehistoric-rush-module-graph-fixture.mjs
scripts/prehistoric-rush-creature-descriptor-fixture.mjs
scripts/prehistoric-rush-creature-render-binding-fixture.mjs
scripts/prehistoric-rush-creature-pose-fixture.mjs
scripts/prehistoric-rush-creature-collision-fixture.mjs
scripts/prehistoric-rush-creature-lifecycle-fixture.mjs
```

## Module graph assertions

```txt
index import map NexusEngine commit equals runtime NexusEngine commit
NexusEngine-Kits commit is immutable
ProtoKits commit is immutable
all requested URLs contain exact commits or exact package versions
bare nexusengine resolution matches the kit's expected engine source
required factories exist before game construction
resolved source rows are JSON-safe
module graph fingerprint is stable
```

## Descriptor assertions

```txt
player raptor preset normalizes deterministically
same preset produces same content hash
descriptor has finite geometry arrays
index ranges are valid
attribute lengths reconcile with vertex count
bone IDs are unique and parent references resolve
skin indices are in range
skin weights are finite and normalized or explicitly repaired
attachments reference valid bones
collision dimensions are positive and scaled once
snapshot round trip preserves content hash
```

## Adapter assertions

```txt
Three preparation uses the admitted descriptor hash
render binding reports exact topology and bone counts
pose consumption reports every matched/missing bone
Rapier binding uses the same creature ID and descriptor hash
Rapier dimensions match descriptor collision values
prepare failure allocates no retained resources
dispose releases geometry/material/scene ownership exactly once
post-dispose pose update rejects
public host evidence contains no live mutable owners
```

## Browser smoke

```txt
load deployed route
verify exact module revisions
verify raptor binding accepted
verify pose sequence advances during run
verify collision binding accepted
verify render continues after multiple run restarts
verify no duplicate creature mesh or physics actor
verify terminal disposal/remount when lifecycle authority lands
```

## Existing blockers

```txt
no root package.json
no unified validation command
no module-graph fixture
no descriptor fixture
no adapter lifecycle fixture
no Pages source-proof smoke
```

## Gate rule

Do not treat a successful page load, visible raptor or successful CDN import as end-to-end proof. Deployment is not fully admitted until module identity, descriptor validity, render binding, pose consumption, collision parity and lifecycle cleanup are all deterministic and observable.