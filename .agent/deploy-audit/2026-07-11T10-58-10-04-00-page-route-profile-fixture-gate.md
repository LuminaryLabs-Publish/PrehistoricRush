# Deploy Audit: Page Route and Profile Fixture Gate

**Timestamp:** `2026-07-11T10-58-10-04-00`

## Summary

A static deployment can succeed while the entry menu links to absent pages. Deployment proof must validate the complete route manifest, module graph and profile-to-game handoff rather than only confirming that files were uploaded.

## Plan ledger

**Goal:** prevent Pages from publishing a menu whose primary actions 404 or whose customization is ignored by the game.

- [x] Record current missing page artifacts.
- [x] Record missing route and profile fixtures.
- [x] Define source/build/Pages gates.
- [ ] Implement and wire the gates before claiming the multi-page product is deployable.

## Current deployment risk

```txt
index.html exists and loads menu.js
menu.html exists and loads menu.js
game.html absent
charactercreator.html absent
page runtime modules exist
static publish can remain green
user navigation can still fail
```

## Required gates

```txt
source page-manifest fixture
  every declared page artifact exists
  every script module exists
  every internal href resolves

built/deployed artifact fixture
  index, menu, creator and game return 200
  module MIME/type is valid
  no import failure or 404 occurs

profile handoff fixture
  creator writes a committed profile
  menu observes the same revision/fingerprint
  game admits the same profile
  creature and collision bindings name that fingerprint

browser frame fixture
  creator preview and game frame correlate to one descriptor
```

## Suggested commands

```bash
node scripts/prehistoric-rush-page-manifest-fixture.mjs
node scripts/prehistoric-rush-profile-store-fixture.mjs
node scripts/prehistoric-rush-profile-game-binding-fixture.mjs
node scripts/prehistoric-rush-pages-route-smoke.mjs
```

## Release blocker

The multi-page runtime should not be marked ready while either primary menu link is missing or while the game does not consume the committed profile.
