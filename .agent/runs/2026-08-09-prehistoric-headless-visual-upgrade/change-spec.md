# Change Spec — Prehistoric Headless Visual Upgrade

## Ownership

### NexusEngine Core — reused, not duplicated here
- Object Vegetation / Tree / Foliage: semantic species, growth and foliage descriptors.
- Core Compute: deterministic growth execution.
- Object Shape / Fidelity / Capture: portable forms and LOD package semantics.
- Object Placement: grounding/alignment semantics where integrated by the runtime.
- Graphics: material intent and renderer-neutral presentation semantics.

### NexusEngine-Kits — reused
- Instanced render batch behavior already used by PrehistoricRush.
- Existing optional runtime adapters remain pinned by `src/shared/runtime-versions.js`.

### PrehistoricRush — changes in this run
- `src/shared/prehistoric-tree-art-direction.js` — new product-only visual preset.
- `src/shared/prehistoric-foliage-card-recipes.js` — denser authored canopy zones.
- `src/shared/prehistoric-vegetation-domain.js` — feed art-direction values into Core descriptors.
- `src/shared/prehistoric-tree-growth-compute.js` — stronger product acceptance policy over Core growth plans.
- `src/render/prehistoric-natural-tree-geometry.js` — organic realization of Core growth segments.
- `validation/forest-lab.html` / `validation/forest-lab.js` — deterministic real-pipeline render scenes.
- `tests/headless-visual-contract.mjs` — deterministic product contract checks.
- `tests/browser-visual-validation.mjs` — Playwright screenshot/runtime evidence.
- `.github/workflows/main-validation.yml` — main-branch tests + browser evidence artifact.
- `package.json` — include new deterministic test.

## Direct target changes

### Canopy
- Product near-placement targets: 64-96 by species.
- Medium target: ~35% near.
- Broad crowns use explicit core/shell/fringe placement zones.
- Radial and tiered species retain species-specific topology but use larger target counts.

### Structure
- Core descriptor intent: wider root spread, lower taper, more trunk longitudinal detail.
- Three realization: organic multi-ring segments, low-amplitude radial irregularity, visible root flattening and trunk-base flare.

### Bark
- Keep portable vertex colors so near/medium Fidelity forms retain the look.
- Increase broad longitudinal/radial variation and grounded green-brown root tint without image-map noise.

### Foliage
- Preserve the existing atlas/card families.
- Increase cluster density through authored product recipes rather than renderer-only duplication.
- Existing compute-prepared shading remains authoritative.

### Gameplay safety
- Do not expand current tree collision based on decorative buttresses.
- Route placement rules remain product-owned and unchanged unless validation proves a defect.

## Risks

- Higher foliage count can overflow the current 8192-per-family batch capacity in unusually dense views.
- Larger visual crowns can make routes feel narrower even if collision is unchanged.
- Far captures may require padding adjustment if denser crowns clip.
- CI performance is only a browser-runner proxy; final MacBook Air hardware profiling remains a separate hardware evidence item.

## Required evidence

- Deterministic Node tests.
- 12-species growth metrics.
- 8 fixed browser validation screenshots.
- Production game browser startup + representative input check.
- Zero browser page errors.
- Foliage overflow metric.
- Deployed Pages reachability after all main writes.
