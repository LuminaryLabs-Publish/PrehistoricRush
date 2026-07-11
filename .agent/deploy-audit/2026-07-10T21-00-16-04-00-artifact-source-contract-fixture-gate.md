# Deploy Audit: Artifact Source Contract Fixture Gate

**Timestamp:** `2026-07-10T21-00-16-04-00`

## Current deployment

GitHub Pages deploys on pushes to `main`. The workflow checks out the repository, copies a static file set into `_site`, uploads the artifact, and deploys it.

## What the workflow proves

```txt
required copy commands found their source files
the static artifact can be uploaded
GitHub Pages can deploy the artifact
```

## What the workflow does not prove

```txt
the browser imports every authoritative-looking JSON file
the runtime values equal runner-tuning.json
the runtime transitions equal game-scenes.json
the runtime imports the kits declared by kit-composition.json
the resolved external module revisions are immutable
the deployed artifact fingerprint equals the runtime fingerprint
population writes remain within capacity
```

## Required pre-upload gate

Add a source-contract fixture before `actions/upload-pages-artifact`:

```txt
node scripts/prehistoric-rush-population-capacity-fixture.mjs
node scripts/prehistoric-rush-source-contract-fixture.mjs
```

The source-contract fixture should emit a compact report containing:

```txt
entrypoint
active local kits
external requested/resolved coordinates
configuration sources
scene source
consumed files
archival files
runtime/build fingerprint
validation errors
```

## Artifact policy

A file copied into `_site` must be one of:

```txt
runtime-consumed
runtime-required asset
explicitly archival documentation
```

Do not deploy an authoritative-looking configuration file with an undefined role.

## Current validation

No workflow or runtime change was made in this documentation pass. Existing Pages behavior remains unchanged.
