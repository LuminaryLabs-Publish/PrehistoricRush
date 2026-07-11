# Validation: PrehistoricRush

**Updated:** `2026-07-11T10-58-10-04-00`

## Scope

Documentation-only audit of the new menu, character-creator, shared player profile and game-page entry runtimes, with emphasis on page artifact integrity, durable profile commit, cross-context synchronization and profile consumption by the existing 3D game.

## Plan ledger

**Goal:** separate source-confirmed facts from executable proof and define the exact route/profile gates required before customization is treated as functional.

- [x] Verify the current root and explicit menu routes.
- [x] Verify menu navigation targets.
- [x] Verify the profile schema and store services.
- [x] Verify the creator draft/debounce path.
- [x] Verify the game entry and current static creature source.
- [x] Verify domains, kits and services.
- [x] Add required documentation outputs.
- [ ] Execute Node, browser and Pages fixtures after implementation.

## Selection verification

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected repository: LuminaryLabs-Publish/PrehistoricRush
selection reason: substantive multi-page/profile runtime changes after prior audit
excluded repository: LuminaryLabs-Publish/TheCavalryOfRome
target branch: main
branch created: no
pull request created: no
```

## Source facts verified

```txt
index entry: index.html -> src/pages/menu.js
explicit menu: menu.html -> src/pages/menu.js
menu Start Run href: ./game.html
game.html present: no
menu Character Creator href: ./charactercreator.html
charactercreator.html present: no
game page runtime present: src/pages/game.js
creator runtime present: src/pages/character-creator.js
profile schema present: src/shared/player-character-schema.js
profile store present: src/shared/player-character-store.js
```

## Profile schema/store facts verified

```txt
schema version: prehistoric-rush.character.v1
storage key: prehistoric-rush:character:v1
broadcast channel: prehistoric-rush:character
normalization/clamping: present
deep merge helper: present
load/save/patch/reset: present
storage-event sync: present
BroadcastChannel sync: present
typed load/save result: absent
profile fingerprint: absent
writer/transaction identity: absent
conflict result: absent
```

## Creator facts verified

```txt
initial draft loads from store: yes
numeric controls: seven
color controls: two
preview type: CSS silhouette
JSON projection: yes
autosave delay: 140 ms
save persists captured final patch: yes
full draft candidate persisted each debounce: no
remote update replaces draft: yes
subscription disposed: no
pending timer lifecycle result: absent
```

## Game consumption facts verified

```txt
src/pages/game.js imports src/game.js: yes
src/game.js imports player profile store: no
game creature source: game.getPlayerBody()
static preset source: player-raptor-preset-kit
saved profile admission: absent
profile-to-creature result: absent
profile-to-Rapier collision result: absent
profile revision in PrehistoricRushHost: absent
profile revision in rendered frame receipt: absent
```

## Existing runtime identity

```txt
NexusEngine: e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits: d6630367d557782d9ec965947aeb1c197d37ea15
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js: 0.179.1
Rapier: 0.15.0
parent game domain: prehistoric-rush-domain-kit 0.5.0
root package.json: absent
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
player-profile audit: yes
deploy audit: yes
runtime source changed by this pass: no
rendering changed by this pass: no
physics changed by this pass: no
deployment workflow changed by this pass: no
```

## Validation not executed

```txt
source/deployed route crawler
menu navigation browser smoke
profile store Node fixture
cross-tab conflict fixture
rapid cross-group debounce fixture
profile-to-game binding fixture
profile-to-collision fixture
profile frame-receipt fixture
patch activation fixture
Pages smoke
```

The GitHub connector provided source inspection and documentation writes. No runnable checkout or browser session was available, so no executable validation claim is made.

## Required future proof

```txt
all page-manifest entries exist in source and Pages artifact
menu links load valid modules without 404
rapid changes to proportions and material persist together
storage failure returns a typed rejection and preserves prior commit
concurrent writers produce deterministic order or explicit conflict
profile fingerprint changes with any normalized creature field
game creature recipe equals committed profile
Rapier collision equals accepted profile collision
creator preview and game binding use one adapter
rendered frame names profile, creature, collision, camera and patch revisions
stale profile/page epoch cannot publish
```

## Future fixture commands

```bash
node scripts/prehistoric-rush-page-manifest-fixture.mjs
node scripts/prehistoric-rush-profile-store-fixture.mjs
node scripts/prehistoric-rush-profile-conflict-fixture.mjs
node scripts/prehistoric-rush-profile-game-binding-fixture.mjs
node scripts/prehistoric-rush-profile-frame-receipt-fixture.mjs
```

## Readiness statement

The new source files are confirmed, but the published navigation path is incomplete and saved character profiles are not consumed by gameplay. Route admission, durable profile commit, conflict handling, creature/collision binding and frame correlation remain unimplemented and unproved.
