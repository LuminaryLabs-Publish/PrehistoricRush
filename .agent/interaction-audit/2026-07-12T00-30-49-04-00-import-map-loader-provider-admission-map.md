# Interaction Audit: Import Map, Loader and Provider Admission

**Timestamp:** `2026-07-12T00-30-49-04-00`

## Plan ledger

**Goal:** turn browser module resolution and provider selection into one observable startup interaction.

- [x] Map HTML import-map resolution.
- [x] Map dynamic CDN imports and null-on-failure behavior.
- [x] Map factory checks and Rapier fallback.
- [ ] Replace presence checks with typed graph admission.

## Current map

```txt
HTML import map
  -> bare nexusengine resolves to d86188c...

runtime-versions.js
  -> creates pinned URLs for Nexus, Kits, ProtoKits, Three and Rapier

Promise.all(load(...))
  -> each failure becomes null
  -> required module presence is checked
  -> selected Nexus/Kits factory names are checked

Rapier setup
  -> optional module/kit factories may be absent
  -> adapter returns null
  -> gameplay continues with fallback overlap collision

startup publication
  -> engine, renderer and host become live
  -> no graph admission receipt or physics-provider decision is published
```

## Required map

```txt
manifest + import-map observation
  -> candidate load results
  -> export-contract results
  -> compatibility policy
  -> provider decision
  -> one sourceGraphFingerprint
  -> engine composition admission
  -> first-frame receipt
```

Rejected required graphs must produce no engine, renderer, Worker, listeners, RAF or public host.