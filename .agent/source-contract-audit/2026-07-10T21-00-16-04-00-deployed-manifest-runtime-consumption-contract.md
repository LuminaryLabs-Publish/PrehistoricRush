# Source Contract Audit: Deployed Manifest Runtime Consumption

**Timestamp:** `2026-07-10T21-00-16-04-00`

## Deployed files

The Pages workflow stages:

```txt
index.html
.nojekyll
game-scenes.json
runner-tuning.json
flock-generation.json
kit-composition.json
kit-cutover-inventory.json
src/**
scenes/*.json
```

## Consumption matrix

| File family | Present in artifact | Imported or fetched by active route | Result |
|---|---:|---:|---|
| `src/runtime.mjs` | yes | yes | active entry |
| `src/game.js` | yes | yes | actual composition authority |
| `src/domains/**` | yes | yes | active local kit implementations |
| `runner-tuning.json` | yes | no | dead authoritative-looking config |
| `game-scenes.json` | yes | no | dead authoritative-looking scene graph |
| `kit-composition.json` | yes | no | dead authoritative-looking kit graph |
| `kit-cutover-inventory.json` | yes | no | planning inventory |
| `flock-generation.json` | yes | no | legacy generation config |
| `scenes/*.json` | yes | no | dead scene descriptors |

## Contract defects

```txt
no source schema
no manifest version consumed at boot
no one-owner rule for tuning
no one-owner rule for transitions
no one-owner rule for kit composition
no consumed-file ledger
no ignored/archival marker
no immutable external revision ledger
no source fingerprint
no runtime readback
no deployment parity gate
```

## Corrective options

### Option A: JSON authority

Load, validate, and freeze the JSON inputs before runtime construction. Derive JavaScript tuning and scene transitions from them. Fail boot on invalid or conflicting authority.

### Option B: JavaScript authority

Keep `src/game.js` authoritative. Remove dead JSON files from the public runtime artifact or mark them clearly as archival planning documents. Generate any public manifest from the executed graph.

## Recommended direction

Use one generated runtime source manifest as the public contract:

```json
{
  "schemaVersion": 1,
  "entrypoint": "src/game.js",
  "activeLocalKits": [],
  "externalModules": [],
  "configurationSources": [],
  "sceneSource": "inline-or-file",
  "fingerprint": "..."
}
```

The manifest should be generated or validated, not maintained independently from the runtime.

## Fixture gate

```txt
fail when a deployed authoritative file is unconsumed
fail when a consumed source is undeclared
fail when tuning sources disagree
fail when scene transition sources disagree
fail when active kit imports disagree with the manifest
fail when external coordinates are mutable
pass only when host fingerprint equals build fingerprint
```
