# Validation: PrehistoricRush

**Updated:** `2026-07-10T22-42-00-04-00`

## Scope

Documentation-only architecture and population-system audit.

## Verified by source inspection

```txt
active route: index.html -> src/runtime.mjs -> src/game.js
active repo-local domain kits: 6
terrain radius: 3
window chunks: 49
trees per chunk: 7
maximum tree candidates: 343
roots per admitted tree: 4
maximum root candidates: 1,372
root instance capacity: 400
grass per chunk: 70
maximum grass candidates: 3,430
grass capacities: 3,600 / 2,600 / 1,300
rocks maximum/capacity: 98 / 320
shards maximum/capacity: 98 / 220
```

## Population behavior verified

```txt
- tree and root counters increment before unguarded setMatrixAt calls
- tree and root writes have no explicit capacity checks
- grass candidate counter increments before capacity and LOD checks
- grass capacity check reads layer.mesh.count
- layer.mesh.count is overwritten with the candidate counter after generation
- tree colliders are appended independently from render admission
- shard pickup rows are appended inline with matrix writes
- physics fixed colliders are replaced from state.colliders after generation
- no generation plan, commit result, rollback, fingerprint, or parity rows exist
- PrehistoricRushHost.getState exposes no population admission evidence
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
population-system audit: yes
deploy audit: yes
central ledger sync required: yes
central change-log entry required: yes
```

## Runtime validation not performed

```txt
runtime source changed: no
package scripts changed: no
dependencies changed: no
routes changed: no
rendering changed: no
physics changed: no
deployment workflow changed: no
branch created: no
pull request created: no
root package.json found: no
npm validation: unavailable
population plan fixture: absent / not run
capacity fixture: absent / not run
parity fixture: absent / not run
atomic commit fixture: absent / not run
browser smoke: not run
Pages smoke: not run
target branch: main
```

## Required future proof

```txt
- activeCount never exceeds immutable capacity
- committed draw count equals successful matrix writes
- rejected or LOD-culled candidates do not consume active slots
- root overflow returns typed truncation or rejection evidence
- every admitted tree render row has exactly one collider row
- every admitted shard render row has exactly one pickup row
- failed generation leaves the prior committed generation unchanged
- identical inputs produce identical plans and fingerprints
- host readback reports generationId, windowKey, counts, parity, and fingerprint
```

## Required fixture commands after implementation

```bash
node scripts/prehistoric-rush-population-plan-fixture.mjs
node scripts/prehistoric-rush-population-capacity-fixture.mjs
node scripts/prehistoric-rush-population-parity-fixture.mjs
node scripts/prehistoric-rush-population-commit-fixture.mjs
```