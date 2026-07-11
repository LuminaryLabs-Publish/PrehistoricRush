# Deploy Audit: Committed Frame Fixture Gate

**Timestamp:** `2026-07-11T14-31-27-04-00`

## Summary

Static deployment can prove that files are published, but it cannot prove that simulation, rendering, HUD and diagnostics describe the same frame. A committed-frame fixture gate is required before the public host is treated as reliable runtime evidence.

## Plan ledger

**Goal:** define the executable evidence required for frame-coherent browser deployment.

- [x] Separate static Pages proof from runtime frame proof.
- [x] Define pure and browser fixture cases.
- [x] Define required captured evidence.
- [ ] Implement fixtures.
- [ ] Run them against source and deployed Pages.

## Required pure fixtures

```bash
node scripts/prehistoric-rush-frame-record-fixture.mjs
node scripts/prehistoric-rush-frame-failure-fixture.mjs
node scripts/prehistoric-rush-host-read-model-fixture.mjs
node scripts/prehistoric-rush-frame-journal-fixture.mjs
```

These must prove identity monotonicity, receipt correlation, failure publication, JSON safety and bounded journals without a browser.

## Required browser fixtures

```bash
node scripts/prehistoric-rush-browser-frame-coherence-smoke.mjs
node scripts/prehistoric-rush-browser-render-failure-smoke.mjs
node scripts/prehistoric-rush-browser-host-interleaving-smoke.mjs
node scripts/prehistoric-rush-pages-frame-coherence-smoke.mjs
```

## Required cases

```txt
first frame after startup
normal movement
jump
patch activation and release
collision failure
shard collection
win transition
resize between frames
render exception
HUD exception
host read during each stage
retry and stale prior-run receipt
```

## Required evidence packet

```txt
source commit SHA
pinned Nexus Engine/Kits/ProtoKits SHAs
runtimeSessionId and runSessionId
committed frame IDs and fingerprints
per-stage receipts
last frame failure
canvas dimensions and renderer result
HUD result
host JSON transcript
fixture command and exit code
Pages URL and capture timestamp
```

## Blockers

```txt
committed-frame coordinator: absent
render result adapter: absent
HUD result adapter: absent
host detached read model: absent
failure injection hooks: absent
browser fixture harness: absent
```

## Readiness statement

A successful Pages deployment is not committed-frame proof. Public runtime evidence remains blocked until source and deployed browser fixtures show that canvas, HUD and host readback share one committed frame record.