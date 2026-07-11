# Deploy Audit: Population Parity Fixture Gate

**Timestamp:** `2026-07-10T22-42-00-04-00`

## Current state

The repository has no root `package.json` and no unified validation command. Pages deployment can therefore stage a population implementation without proving capacity, matrix-write, collider, pickup, or physics parity.

## Required independent fixtures

```bash
node scripts/prehistoric-rush-population-plan-fixture.mjs
node scripts/prehistoric-rush-population-capacity-fixture.mjs
node scripts/prehistoric-rush-population-parity-fixture.mjs
node scripts/prehistoric-rush-population-commit-fixture.mjs
```

## Required assertions

```txt
- deterministic candidate ordering and fingerprint
- immutable capacity distinct from active draw count
- no tree, root, grass, rock, or shard write beyond capacity
- active draw count equals successful matrix writes
- LOD rejection consumes no active slot
- exact tree-render/collider/physics parity
- exact shard-render/pickup parity
- sparse-after-dense generation exposes no stale matrices
- overflow returns stable rejected or truncated rows
- failed generation preserves the previous committed state
- host readback matches the committed generation
```

## Deployment gate order

```txt
syntax/import validation
  -> population plan fixture
  -> capacity fixture
  -> parity fixture
  -> atomic commit fixture
  -> browser population smoke
  -> static artifact staging
  -> Pages deployment
```

Do not wire placeholder fixtures into deployment. Add each gate only after it passes independently and fails on a deliberate contract violation.