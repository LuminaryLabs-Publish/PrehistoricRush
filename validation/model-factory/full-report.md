# Prehistoric Rush GLB Upgrade Report

## Result

PASS for deterministic generation, exported GLB loading, mesh integrity, headless rendering, 50 bounded review concerns, runtime loader integration, startup ownership, and deterministic game contracts.

Browser automation is unsupported in this environment because the existing Playwright validation dependency and Chromium executable are unavailable. This is an environment limitation, not a substituted browser pass.

## Startup defect fixed

The renderer continued to send optional fidelity progress to `n:runtime:startup` after `startup.enter()` changed Core Startup from `starting` to `ready`. The semantic entry now closes the Foundation progress bridge immediately after the required Foundation preparation becomes ready. Background fidelity remains owned by Assets and Presentation and can no longer call `startup.working()` after launch completion.

## Generated catalog

- 12 rigged racer GLBs.
- 12 rigged tree GLBs.
- Racer clips: `idle`, `run`, `ability`.
- Tree clips: `wind`, `gust`.
- Deterministic seeds, file hashes, bounds, normals, geometry metrics, and manifest entries.
- Selected racer GLB is loaded by the first of the four required logical asset groups.
- Tree GLBs remain optional members of streamed species packages.
- Procedural racer and generic vegetation proxies remain failure fallbacks.

## Validation evidence

- 24/24 GLBs reloaded through `@headless-three/renderer.loadGltfFromFile`.
- 24/24 GLBs passed finite normalized-normal, bounds, ground-contact, geometry-detail, animation-count, and digest checks.
- 50/50 review attempts passed after four accepted visual corrections.
- True headless Three.js/WGPU renders were produced with a software Vulkan adapter.
- Full catalog size: 7,411,088 bytes.
- Largest GLB: 510,784 bytes.
- Every selected-racer candidate remains below the 524,288-byte startup asset budget.
- Total measured local GLB load time: approximately 241 ms.
- Maximum measured local GLB load time: approximately 48 ms.

Timing values are local validation observations, not guarantees for a browser or network. Byte budgets are deterministic acceptance gates.

## Performance safeguards

- Required asset group count remains exactly four.
- Only the selected racer GLB gates play.
- Detailed tree models load through the existing two-request optional concurrency limit.
- Tree GLBs are not parsed on the frame hot path.
- Worker patch generation and one-patch-per-frame activation remain unchanged.
- Post-play fidelity cannot update completed Core Startup state.
- Warm-cache racer restoration returns the GLB directly instead of trying to hydrate it as a tree package.

## Review corrections

1. Connected the Brachiosaurus head with a continuous long-neck silhouette.
2. Connected the Pteranodon head, torso, and wing roots.
3. Raised Pteranodon wing roots to remove ground-plane intersections.
4. Kept deliberately smooth forms after direct render inspection rather than treating low edge noise as a geometry defect.

## Evidence files

- `assets/models/manifest.json`
- `validation/model-factory/mesh-integrity-report.json`
- `validation/model-factory/review-50.json`
- `validation/model-factory/model-contact-sheet.png`
- `validation/model-factory/renders/`

## Remaining environment gate

Run `npm run test:browser-visual` on a machine with Playwright and Chromium to confirm the deployed browser, CDN GLTFLoader import, live WebGL presentation, input, and streaming behavior. The deterministic suite and the real headless GLB renderer pass, but this report does not represent the unavailable browser run as successful.
