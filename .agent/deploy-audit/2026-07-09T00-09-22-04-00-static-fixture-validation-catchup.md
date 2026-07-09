# PrehistoricRush Deploy Audit - Static Fixture Validation Catch-up

**Timestamp:** `2026-07-09T00-09-22-04-00`

## Current deploy read

`PrehistoricRush` is a static browser repo. `README.md` says GitHub Pages deploys from `main` and uploads the static repository root.

This documentation pass changed only `.agent` files, so deploy/runtime behavior was not intentionally changed.

## Current validation limitation

There is no root `package.json` in the repo as of this pass, so validation must not assume npm scripts.

Current viable validation after implementation files are added:

```bash
node scripts/prehistoric-rush-presentation-frame-fixture.mjs
python3 -m http.server 4173
```

Browser checks after serving locally:

```js
globalThis.PrehistoricRushComposition?.snapshot?.()
globalThis.PrehistoricRushHost?.getState?.()
globalThis.PrehistoricRushHost?.getState?.().presentation
```

## Fixture validation target

```txt
DOM-free fixture:
  no canvas
  no WebGL
  no Rapier runtime required
  no Three.js runtime required
  pure source state fixtures
  event bus fixture bridge
  dino pose event readback fixture
  host projection fixture
```

## Deploy-readiness rows after source implementation

```txt
fixture_script_exists
fixture_script_runs_with_node
fixture_rows_pass
legacy_runtime_import_path_unchanged
index_loads_src_runtime_mjs
src_runtime_imports_src_game_js
src_game_imports_runtime_terrain_v6
host_get_state_existing_fields_preserved
host_get_state_presentation_added
static_route_still_serves
pages_workflow_unchanged_unless_runtime_needs_it
```

## Validation status for this docs pass

```txt
runtime source changed: no
package.json assumed: no
fixture script exists: no
fixture run: no
browser smoke: no
pages smoke: no
branch created: no
pull request created: no
pushed to main: yes
```
