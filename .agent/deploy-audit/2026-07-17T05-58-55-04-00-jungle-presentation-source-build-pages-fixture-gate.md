# Jungle Presentation Source, Build and Pages Fixture Gate

**Timestamp:** `2026-07-17T05-58-55-04-00`

## Intent

Prove that the new foliage and atmosphere modules are present, imported, revision-matched and visibly adopted from source hosting, built/static output and the GitHub Pages subpath.

## Current evidence

```txt
source files present: yes
runtime consumer changed by delta: no
package syntax coverage: no
package execution coverage: no
browser import fixture: no
Worker import fixture: no
built-output fixture: no
Pages-origin fixture: no
first matching frame acknowledgement: no
```

## Required source gate

- Syntax-check both new modules.
- Import every public export.
- Validate atlas revision, dimensions, family IDs, atlas cells and scalar ranges.
- Validate ground-cover schema, cloneability and deterministic placement.
- Apply atmosphere twice to a test scene and prove one owned fill/bounce pair.
- Dispose/replace the scene and prove owned-resource retirement.

## Required browser gate

```txt
load exact game import map
  -> create actual game runtime
  -> register foliage and ground-cover catalogs
  -> initialize production Worker
  -> activate one patch containing adopted cards/ground cover
  -> apply one atmosphere generation
  -> capture diagnostics and rendered pixels from the same frame
  -> publish FirstJunglePresentationFrameAck
```

## Required parity rows

```txt
source origin
built/static artifact origin
GitHub Pages subpath origin
```

Each row must bind:

```txt
source revision
engine revision
catalog digest
Worker revision
patch digest
atlas/material digest
atmosphere digest
renderer generation
viewport/DPR
frame number
pixel artifact digest
```

## Failure gate

Fail closed on:

```txt
missing module or export
catalog/atlas mismatch
Worker/main-thread mismatch
unbounded card count
missing atlas material
duplicate atmosphere lights
stale scene/renderer generation
resource-retirement failure
source/artifact/Pages digest mismatch
missing matching-frame acknowledgement
```

## Boundary

No tests, builds, browser sessions, artifacts, workflow runs or Pages requests were executed by this audit.
