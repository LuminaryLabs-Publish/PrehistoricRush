# Render Host Retirement Browser Fixture Gate

**Timestamp:** `2026-07-17T06-23-59-04-00`

## Required source fixtures

```txt
npm run test:syntax
npm test
render-host participant census
base and LOD adapter dispose contract
atmosphere snapshot and restoration contract
stale callback and Worker-result rejection
```

## Required browser fixture

```txt
load game route
wait for admitted lush first frame
record renderer, canvas, scene-light and active-patch identities
retire render host generation
assert RAF and Worker result rejection
assert child and base resources disposed
assert atmosphere-owned lights removed
assert predecessor scene state restored or explicitly retired
assert renderer disposed and canvas detached
construct replacement generation
wait for first replacement frame
assert one canvas, one renderer and one atmosphere light pair
```

## WebGL recovery fixture

```txt
admit generation A
simulate context loss
retire A exactly once
admit recovery generation B
reject stale A callbacks and patch results
render B with matching catalog, atlas, renderer and viewport generations
```

## Deployment parity gate

The same retirement fixture must pass against:

```txt
source modules
built artifact when a build surface exists
GitHub Pages subpath deployment
pinned CDN module graph
```

## Evidence required

```txt
command transcript
exit codes
browser console capture
participant retirement receipts
canvas and light counts before/after
renderer/context status
resource and patch ownership snapshots
first retired and first replacement frame acknowledgements
artifact or deployed URL identity
```

## Current validation state

```txt
source inspection: performed
commit comparison: performed
npm test: not run by this audit
browser fixture: unavailable
WebGL recovery: unavailable
artifact smoke: not run
Pages smoke: not run
```

No deployment, cleanup or production-readiness claim is made.